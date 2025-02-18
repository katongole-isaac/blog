import vercelBlob from "@/lib/vercelBlob";
import { NextRequest, NextResponse } from "next/server";

import apiErrorHandler from "@/lib/apiErrorHandler";
import { BlogType } from "@/utils/types";

const _POST = async (req: NextRequest) => {
  
  const { searchParams } = new URL(req.url);

  const filename = searchParams.get("filename");
  const replaceBlogPost = searchParams.get("replace"); // used for put method
  const blogType = searchParams.get("type") as BlogType; // used for put method

  const body = await req.json();

  if (!filename) return NextResponse.json({ message: "Please provide the filename of this blog post" }, { status: 400 });

  if (replaceBlogPost === "true") {
    // PUT method
    const { data, error } = await vercelBlob.uploadBlogPost(
      filename,
      body.data,
      blogType === "drafts" || blogType === "draft" ? { replace: true, blogType, modified: true } : { replace: true, modified:true }
    );

    if (error) return NextResponse.json({ message: error }, { status: 400 });

    return NextResponse.json({ ...data });
  }

  const { data, error } = await vercelBlob.uploadBlogPost(
    filename,
    body.data,
    blogType === "drafts" || blogType === "draft" ? { blogType, replace: true } : {}
  );

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  return NextResponse.json({ ...data }, { status: 201 });
};

/**
 * Getting metadata for a single blog post
 *
 */
const _GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const blogType = searchParams.get("type") || "";
  const blogPath = searchParams.get("blogUrl") || "";

  if (!blogType) return NextResponse.json({ message: "Invalid blog type requested" }, { status: 400 });
  if (!blogPath) return NextResponse.json({ message: "Please provide blog URL" }, { status: 400 });

  const pattern = /^https:\/\//gi;
  const blogURL = pattern.test(blogPath.trim()) ? blogPath : `${blogType.trim()}/${blogPath.trim()}.md`;

  const { data, error, status } = await vercelBlob.getBlogByUrl(blogURL);

  if (error && status) return NextResponse.json({ message: error }, { status: 404 });

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  return NextResponse.json({ ...data });
};

const _DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const urls = searchParams.get("urls");

  if (!urls) return NextResponse.json({ message: "Please provide the filename of this blog post" }, { status: 400 });

  const { error } = await vercelBlob.deleteBlogPost(urls.split(","));

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  return NextResponse.json({ message: "ok" });
};

//@ts-ignore
export const DELETE = apiErrorHandler(_DELETE);
//@ts-ignore
export const POST = apiErrorHandler(_POST);
//@ts-ignore
export const PUT = apiErrorHandler(_POST);
//@ts-ignore
export const GET = apiErrorHandler(_GET);
