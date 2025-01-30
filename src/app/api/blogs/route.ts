import { NextResponse } from "next/server";

import { BlogType } from "@/utils/types";
import apiErrorHandler from "@/lib/apiErrorHandler";
import vercelBlob from "@/lib/vercelBlob";

async function _GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const blogType = searchParams.get("type");

  if (!blogType) return NextResponse.json({ message: "Invalid blog type requested" }, { status: 400 });

  const { data, error } = await vercelBlob.getAllBlogs(blogType as BlogType);

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  return NextResponse.json({ blogs: data?.blobs });
}

//@ts-ignore
export const GET = apiErrorHandler(_GET);
