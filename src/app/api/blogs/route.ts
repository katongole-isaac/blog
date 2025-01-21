import fs from "fs";
import path from "path";
import slugify from "slugify";
import matter from "gray-matter";
import { NextResponse } from "next/server";

import { type BlogResponse } from "@/utils/types";
import apiErrorHandler from "@/lib/apiErrorHandler";

async function _GET(req: Request) {
  const blogsDirectory = path.join(process.cwd(), "blogs");

  if (!fs.existsSync(blogsDirectory)) {
    return NextResponse.json({ error: "Blogs directory is missing" }, { status: 500 });
  }

  const blogs: BlogResponse[] = [];

  const fileNames = fs.readdirSync(blogsDirectory);

  fileNames.map((fileName) => {
    const filePath = path.join(blogsDirectory, fileName);

    const stats = fs.statSync(filePath);
    const fileContents = fs.readFileSync(filePath);

    const _matter = matter(fileContents);

    const _slug = slugify((_matter.data["slug"] as string).trim(), { lower: true, strict: true });

    blogs.push({
      _slug,
      fileName,
      //@ts-ignore
      matter: _matter,
      createdAt: stats.birthtimeMs,
      lastModified: stats.mtimeMs,
      isModified: stats.birthtimeMs !== stats.mtimeMs ? true : false,
    });
  });

  return NextResponse.json({ blogs });
}

//@ts-ignore
export const GET = apiErrorHandler(_GET);
