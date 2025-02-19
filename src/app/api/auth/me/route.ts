import { NextRequest, NextResponse } from "next/server";
import auth from "@/lib/auth"; // Your JWT verification utility

export async function GET(req: NextRequest) {

  auth.validateEnvVariables();
  
  const token = req.cookies.get("x-auth-token")?.value;

  if (!token || !(await auth.verifyToken(token))) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  return NextResponse.json({ isAuthenticated: true });
}
