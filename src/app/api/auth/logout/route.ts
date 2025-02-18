import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the x-auth-token cookie
  response.cookies.set("x-auth-token", "", { expires: new Date(0), path: "/" });

  return response;
}
