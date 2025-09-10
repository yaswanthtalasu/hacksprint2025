import crypto from "crypto";

const ALGO = "aes-256-cbc";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
if (KEY.length !== 32)
  throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");

export function encryptJSON(obj: any) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const str = JSON.stringify(obj);
  const encrypted = Buffer.concat([cipher.update(str, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptJSON(cipherText: string) {
  const [ivHex, dataHex] = cipherText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  const out = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(out.toString("utf8"));
}
