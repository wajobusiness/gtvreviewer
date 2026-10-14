/**
 * lib/auth/password.ts
 *
 * Cryptographically secure password hashing and verification using Node.js built-in crypto.
 * Uses PBKDF2 with HMAC-SHA512 and 100,000 iterations with a unique 16-byte random salt.
 */

import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = "sha512";

/**
 * Hash a plain-text password using salted PBKDF2.
 * Output format: pbkdf2:<iterations>:<salt_hex>:<hash_hex>
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  return `pbkdf2:${ITERATIONS}:${salt}:${hash}`;
}

/**
 * Verify a plain-text password against a stored PBKDF2 hash.
 * Uses timingSafeEqual to protect against timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash || typeof password !== "string" || typeof storedHash !== "string") {
    return false;
  }

  const parts = storedHash.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") {
    return false;
  }

  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const expectedHash = parts[3];

  if (!iterations || !salt || !expectedHash) {
    return false;
  }

  try {
    const candidateHash = pbkdf2Sync(password, salt, iterations, KEY_LEN, DIGEST).toString("hex");
    const candidateBuf = Buffer.from(candidateHash, "hex");
    const expectedBuf = Buffer.from(expectedHash, "hex");

    if (candidateBuf.length !== expectedBuf.length) {
      return false;
    }

    return timingSafeEqual(candidateBuf, expectedBuf);
  } catch {
    return false;
  }
}

