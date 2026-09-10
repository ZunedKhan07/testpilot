import crypto from "crypto";

/**
 * 1. Flexible Gemini API Key Validation
 * Validates Google Gemini API keys (starts with 'AIzaSy' and length >= 35).
 */
export const isValidGeminiKey = (key: string): boolean => {
  if (typeof key !== "string") return false;
  const trimmedKey = key.trim();
  return trimmedKey.startsWith("AIzaSy") && trimmedKey.length >= 35;
};

/**
 * 2. Encryption & Decryption Configuration
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "v-32-byte-long-secret-key-123456"; // Must be exactly 32 chars
const IV_LENGTH = 16;

/**
 * Encrypts sensitive text using AES-256-CBC
 */
export const encryptKey = (text: string): string => {
  if (!text) throw new Error("Text to encrypt cannot be empty.");
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
    iv
  );
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  return `${iv.toString("hex")}:${encrypted}`;
};

/**
 * Decrypts encrypted key string back to plain text
 */
export const decryptKey = (text: string): string => {
  if (!text || !text.includes(":")) throw new Error("Invalid encrypted text format.");

  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
    iv
  );
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString("utf8");
};