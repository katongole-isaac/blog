import vercelBlob from "@/lib/vercelBlob";
import { NextRequest, NextResponse } from "next/server";

import apiErrorHandler from "@/lib/apiErrorHandler";

export const _POST = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filename = searchParams.get("filename");

  const body = await req.json();

  if (!filename) return NextResponse.json({ message: "Please provide the filename of this blog post" }, { status: 400 });

  const { data, error } = await vercelBlob.uploadBlogPost(filename, body.data);

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  return NextResponse.json({ data }, { status: 201 });
};

/**
 * Getting metadata for a single blog post
 *
 */
const _GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  console.log("dasd");

  const blogType = searchParams.get("type") || "";
  const blogPath = searchParams.get("blogUrl") || "";

  console.log({ blogPath, blogType });

  if (!blogType) return NextResponse.json({ message: "Invalid blog type requested" }, { status: 400 });
  if (!blogPath) return NextResponse.json({ message: "Please provide blog URL" }, { status: 400 });

  const pattern = /^https:\/\//gi;
  const blogURL = pattern.test(blogPath.trim()) ? blogPath : `${blogType.trim()}/${blogPath.trim()}.md`;

  const _url = "https://9d3odxrej5fvz5hs.public.blob.vercel-storage.com/published/how-to-write-a-blog-AIK59WIQxLZMgD64BiX3aSGqhDTz3Z.md";

  const { data, error, status } = await vercelBlob.getBlogByUrl(_url);

  if (error && status) return NextResponse.json({ message: error }, { status: 404 });

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  return NextResponse.json({ ... data });
};

const _DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filename = searchParams.get("filename");

  if (!filename) return NextResponse.json({ message: "Please provide the filename of this blog post" }, { status: 400 });

  const { error } = await vercelBlob.deleteBlogPost(filename);

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  return NextResponse.json({ message: "ok" });
};

//@ts-ignore
export const DELETE = apiErrorHandler(_DELETE);
//@ts-ignore
export const POST = apiErrorHandler(_POST);
//@ts-ignore
export const GET = apiErrorHandler(_GET);
