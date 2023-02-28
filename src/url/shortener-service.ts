import crypto from "crypto";

export function generateShortId(urlAddress: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const id = sha256(urlAddress, salt).slice(0, 7);
  return id;
}

export function sha256(content: string, salt: string) {
  const res = crypto.createHmac("sha256", salt).update(content).digest("hex");
  return res;
}
