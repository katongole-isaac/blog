import fs from "fs";
import path from "path";
import dayjs from "dayjs";
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

    // We consider any changes made in a blog post that are not
    // morethan one week to be within creationTime otherwise
    // those are consider updates and isModified is set to true
    const diffInWeeks = dayjs(stats.mtimeMs).diff(dayjs(stats.birthtimeMs), "week");

    const isModified = diffInWeeks > 1 ? true :  false;

    blogs.push({
      _slug,
      fileName,
      isModified,
      //@ts-ignore
      matter: _matter,
      createdAt: stats.birthtimeMs,
      lastModified: stats.mtimeMs,
    });
  });


  blogs.sort((a, b)=> a.lastModified - b.lastModified ) // ASC order

  return NextResponse.json({ blogs });
}

//@ts-ignore
export const GET = apiErrorHandler(_GET);
