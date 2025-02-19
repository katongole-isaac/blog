import { SignJWT, jwtVerify, JWTPayload } from "jose";

const hashPassword = async (password: string, salt: string) => {
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);

  const iterations = 100_000; // Adjust for security/performance
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations,
    },
    keyMaterial,
    256 // 256-bit derived key
  );

  return btoa(String.fromCharCode(...new Uint8Array(derivedKey))); // Convert to base64
};

const verifyPassword = async (inputPassword: string, storedHash: string, salt: string) => {
  const inputHash = await hashPassword(inputPassword, salt);
  return inputHash === storedHash;
};

// Convert your secret key to a format `jose` can use
const secret = new TextEncoder().encode(process.env.APP_SECRET_KEY!);

// Function to generate a JWT (valid for 1 month)
async function generateToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d") // 1 month
    .sign(secret);
}

// Function to verify a JWT
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; // Returns decoded payload if valid
  } catch (error) {
    return null; // Token is invalid or expired
  }
}

const validateEnvVariables = () => {
  if (
    !process.env.APP_SECRET_KEY ||
    !process.env.LOGIN_USERNAME ||
    !process.env.LOGIN_PASSWORD ||
    !process.env.APP_SLT ||
    !process.env.BLOB_READ_WRITE_TOKEN
  )
    throw new Error(`
    Please set the environment variables APP_SECRET_KEY, LOGIN_USERNAME, LOGIN_PASSWORD and APP_SLT before starting the app.

    Download the credentials-cli tool to get credentials here https://github.com/katongole-isaac/blog/releases/tag/v0.1

    Go to vercel dashboard under your project to obtain the value of BLOB_READ_WRITE_TOKEN  env variable.

`);
};

export default {
  verifyToken,
  generateToken,
  hashPassword,
  verifyPassword,
  validateEnvVariables,
};
