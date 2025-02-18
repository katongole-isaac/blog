import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import apiErrorHandler from "@/lib/apiErrorHandler";
import auth from "@/lib/auth";

const user = {
  username: process.env.LOGIN_USERNAME!,
  passwordHash: process.env.LOGIN_PASSWORD!,
};

const salt = process.env.APP_SLT!;

const _POST = async (req: NextRequest) => {
  try {
    const { username, password } = await req.json();

    const isValidUsername = await auth.verifyPassword(username, user.username, salt);
    if (!isValidUsername) return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });

    const isValidPassword = await auth.verifyPassword(password, user.passwordHash, salt);
    if (!isValidPassword) return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });

    // Generate JWT token
    const token = await auth.generateToken({
      username: process.env.NODE_ENV === "production" ? "default" : username,
      type: "basic",
      developedBy: "isaac <errortor40@gmail.com>",
    });

    (await cookies()).set("x-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

//@ts-ignore
export const POST = apiErrorHandler(_POST);
