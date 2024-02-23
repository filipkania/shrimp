import { AppContext } from "@/src";
import { z } from "zod";

export const method = "POST";
export const route = "/mails/send";

const contactSchema = z.object({
  email: z.string(),
  name: z.string().optional(),
});

const requestBody = z.object({
  to: z.array(contactSchema).min(1),
  replyTo: z.array(contactSchema).optional(),
  cc: z.array(contactSchema).optional(),
  bcc: z.array(contactSchema).optional(),

  from: contactSchema,

  subject: z.string(),
  content: z
    .array(
      z.object({
        type: z.string(),
        value: z.string(),
      })
    )
    .min(1),
});

export const handler = async (c: AppContext) => {
  const body = await c.req.json();

  let data: z.infer<typeof requestBody>;
  try {
    data = await requestBody.parseAsync(body);
  } catch (err) {
    return c.json(
      {
        message: "Validation failed: " + (err as any).message,
      },
      400
    );
  }

  const req = new Request("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      headers: {
        "X-Sent-With": "Shrimp <https://github.com/filipkania/shrimp>",
        "X-Shrimp-Id": crypto.randomUUID(),
      },
      from: data.from,
      personalizations: [
        {
          to: data.to,
          cc: data.cc,
          bcc: data.bcc,
          reply_to: data.replyTo,
          from: data.from,
        },
      ],
      subject: data.subject,
      content: data.content,
    }),
  });

  const res = await fetch(req);
  if (res.ok) {
    return c.json({
      message: "ok",
    });
  }

  return c.json(
    {
      message: await res.text(),
    },
    res.status
  );
};
