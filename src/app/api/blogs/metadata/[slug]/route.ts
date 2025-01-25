import fs from "fs";
import path from "path";
import slugify from "slugify";
import matter from "gray-matter";
import { NextRequest, NextResponse } from "next/server";

import { type BlogMetadata } from "@/utils/types";
import apiErrorHandler from "@/lib/apiErrorHandler";

const _GET = async (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const blogsDirectory = path.join(process.cwd(), "blogs");

  if (!fs.existsSync(blogsDirectory)) {
    return NextResponse.json({ error: "Blogs directory is missing" }, { status: 500 });
  }

  const blog: BlogMetadata | {} = {};

  const fileNames = fs.readdirSync(blogsDirectory);

  for (let fileName of fileNames) {
    const filePath = path.join(blogsDirectory, fileName);

    const fileContents = fs.readFileSync(filePath);

    const stats = fs.statSync(filePath);

    const _matter = matter(fileContents);

    const _slug = slugify((_matter.data["slug"] as string).trim(), { lower: true, strict: true });

    if (_slug !== slug.trim()) continue;

    (blog as BlogMetadata).title = _matter.data.title;
    (blog as BlogMetadata).lastModified = stats.mtimeMs;
    (blog as BlogMetadata).description = _matter.data.description;
  }

  return NextResponse.json({ ...blog });
};

//@ts-ignore
export const GET = apiErrorHandler(_GET);
