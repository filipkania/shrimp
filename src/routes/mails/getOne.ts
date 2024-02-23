import { AppContext } from "@/src";
import mail from "@/src/db/mail";

export const method = "GET";
export const route = "/mails/:id";

export const handler = async (c: AppContext) => {
  const mailId = parseInt(c.req.param("id"));
  if (isNaN(mailId)) {
    return c.json({ message: "mailId must be a number." }, 400);
  }

  return c.json(await mail.findById(c.env.DB, mailId));
};
