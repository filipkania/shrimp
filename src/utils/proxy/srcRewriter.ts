import { signHMAC } from "./urlHash";

export class ProxyRewriter {
  private attribName: string;
  private secret: string;

  constructor(attrib: string, secret: string) {
    this.attribName = attrib;
    this.secret = secret;
  }

  async element(element: Element) {
    const attribute = element.getAttribute(this.attribName);

    if (attribute && attribute.toLowerCase().startsWith("http")) {
      const signedHMAC = await signHMAC(Buffer.from(attribute), this.secret);

      element.setAttribute(
        this.attribName,
        `/api/mails/proxy/${encodeURIComponent(signedHMAC)}/${encodeURIComponent(attribute)}`
      );
    }
  }
}
