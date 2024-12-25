import { subtle } from "node:crypto";

export async function generateRandomBytes(length: number): Promise<Uint8Array> {
  return subtle.generateKey({ name: "HMAC", hash: "SHA-256" }, true, [
    "sign",
    "verify",
  ]).then(() => {
    return subtle.getRandomValues(new Uint8Array(length));
  });
}

export async function generateRandomId(length: number = 16): Promise<string> {
  const bytes = await generateRandomBytes(length);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
