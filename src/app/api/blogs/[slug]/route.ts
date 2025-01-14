import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { BlogResponse } from "@/utils/types";

/**
 * Get a single blog post by slug (blog name)
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), "blogs", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");

  const stats = fs.statSync(filePath);

  const result: BlogResponse = {
    matter: matter(fileContents),
    createdAt: stats.birthtimeMs,
    lastModified: stats.mtimeMs,
    isModified: stats.birthtimeMs !== stats.mtimeMs ? true : false,
  };

  return NextResponse.json({ ...result });
}
