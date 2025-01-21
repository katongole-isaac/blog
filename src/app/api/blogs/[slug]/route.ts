import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextRequest, NextResponse } from "next/server";
import { BlogResponse } from "@/utils/types";
import slugify from "slugify";
import apiErrorHandler from "@/lib/apiErrorHandler";

/**
 * Get a single blog post by slug (blog name)
 */
 async function _GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const regexp = /\w+(\.md)$/; // ending in .md

  const fileName = regexp.test(slug.trim()) ? slug.trim() : `${slug}.md`;
  const filePath = path.join(process.cwd(), "blogs", fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      {
        error: " Oops! We couldn't find the blog post you're looking for. It might not exist or has been moved. Please check the URL and try again.",
      },
      { status: 404 }
    );
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");

  const stats = fs.statSync(filePath);

  const _matter = matter(fileContents);
  const _slug = slugify((_matter.data["slug"] as string).trim(), { lower: true, strict: true });

  const blog: BlogResponse = {
    _slug,
    fileName,
    //@ts-ignore
    matter: _matter,
    createdAt: stats.birthtimeMs,
    lastModified: stats.mtimeMs,
    isModified: stats.birthtimeMs !== stats.mtimeMs ? true : false,
  };

  return NextResponse.json({ ...blog });
}

//@ts-ignore
export const GET = apiErrorHandler(_GET);