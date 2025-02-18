import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const hashpassword = (password: string) => {
  const hash = bcrypt.hashSync(password, 10);
  return hash;
};

if (!process.env.APP_SECRET_KEY || !process.env.LOGIN_USERNAME || !process.env.LOGIN_PASSWORD)
  throw new Error("Please set the environment variables APP_SECRET_KEY, LOGIN_USERNAME, and LOGIN_PASSWORD before starting the app.");

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

export default {
  verifyToken,
  generateToken,
  hashpassword,
};
