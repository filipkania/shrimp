import { AppContext } from "@/src";
import { verifyHMAC } from "@/src/utils/proxy/urlHash";

export const method = "GET";
export const route = "/mails/proxy/:hmac/:filename{.+$}";

export const handler = async (c: AppContext) => {
  const { filename, hmac } = c.req.param();

  if (
    !hmac ||
    !(await verifyHMAC(hmac, Buffer.from(filename), c.env.JWT_SECRET))
  ) {
    return c.json(
      {
        message: "Invalid HMAC.",
      },
      400
    );
  }

  try {
    const url = new URL(filename);

    if (!["https:", "http:"].includes(url.protocol)) {
      throw new Error("Invalid protocol.");
    }
  } catch (_) {
    return c.json(
      {
        message: "Invalid URL.",
      },
      400
    );
  }

  try {
    const res = await fetch(filename);

    const remoteContentType = res.headers.get("Content-Type") || "plain/text";
    if (!remoteContentType.startsWith("image/")) {
      return c.json(
        {
          message: "Invalid Content-Type.",
        },
        400
      );
    }

    return c.body(res.body, 200, {
      "Content-Type": remoteContentType,
      "Cache-Control": "max-age=604800", // around 7 days
    });
  } catch (e) {
    // something bad happened while proxying that request.
    // redirect user to the original page.
    console.error(e);

    return c.redirect(filename, 307);
  }
};
