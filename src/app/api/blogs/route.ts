import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

import { type BlogResponse } from "@/utils/types";

export async function GET(req: Request) {
  const blogsDirectory = path.join(process.cwd(), "blogs");

  if (!fs.existsSync(blogsDirectory)) {
    return NextResponse.json({ error: "Blogs directory is missing" }, { status: 404 });
  }

  const results: BlogResponse[] = [];

  const fileNames = fs.readdirSync(blogsDirectory);

  fileNames.map((fileName) => {
    const filePath = path.join(blogsDirectory, fileName);

    const stats = fs.statSync(filePath);
    const fileContents = fs.readFileSync(filePath);

    results.push({
      fileName,
      //@ts-ignore
      matter: matter(fileContents),
      createdAt: stats.birthtimeMs,
      lastModified: stats.mtimeMs,
      isModified: stats.birthtimeMs !== stats.mtimeMs ? true : false,
    });
  });

  return NextResponse.json({ results });
}
