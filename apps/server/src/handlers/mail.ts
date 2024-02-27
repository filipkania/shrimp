import { Env } from "..";
import { streamToArrayBuffer } from "../utils/streamToArrayBuffer";

import PostalMime from "postal-mime";
import { postalMimeToEmail } from "../utils/postalMimeToEmail";

import mail from "../db/mail";
import contact from "../db/contact";
import { ProxyRewriter } from "../utils/proxy/srcRewriter";

export const emailHandler = async (
  message: ForwardableEmailMessage,
  env: Env
) => {
  const rawEmail = await streamToArrayBuffer(message.raw, message.rawSize);
  const parser = new PostalMime();
  const email = await parser.parse(Buffer.from(rawEmail));

  const rewriter = new HTMLRewriter().on(
    "img",
    new ProxyRewriter("src", env.JWT_SECRET)
  );

  const senderContact = await contact.insert(env.DB, {
    name: email.from.name,
    address: email.from.address,
  });

  const parsedMail = postalMimeToEmail(email);

  const mailId = await mail.insert(env.DB, {
    ...parsedMail,
    html: await rewriter.transform(new Response(parsedMail.html)).text(),
    from_id: senderContact,
    received_at: new Date().toISOString(),
  });

  await mail.addRecipients(env.DB, mailId, email.to);
  if (email.cc) {
    await mail.addCCs(env.DB, mailId, email.cc);
  }

  if (email.replyTo) {
    await mail.addReplyTos(env.DB, mailId, email.replyTo);
  }

  // TODO: add proper attachments handling
};
