import matter from "gray-matter";
import { NextRequest, NextResponse } from "next/server";

import utils from "@/utils";
import vercelBlob from "@/lib/vercelBlob";
import { type BlogMetadata } from "@/utils/types";
import apiErrorHandler from "@/lib/apiErrorHandler";

const _GET = async (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const url = `published/${slug}.md`;

  const { data, error, status } = await vercelBlob.getBlogByUrl(url);

  if (error && status) return NextResponse.json({ message: error, status });

  if (error) return NextResponse.json({ message: error });

  const response = await fetch(data?.url as string);

  if (!response.ok) return NextResponse.json({ message: await response.json() });

  const blogContents = await (await response.blob()).text();

  const blog: BlogMetadata | {} = {};

  const _matter = matter(blogContents);

  const createdAt = utils.dayjsConvertToTz(data?.uploadedAt?.toString()!);

  (blog as BlogMetadata).tags = _matter.data.tags;
  (blog as BlogMetadata).title = _matter.data.title;
  (blog as BlogMetadata).image = _matter.data.image;
  (blog as BlogMetadata).createdAt = createdAt.unix();
  (blog as BlogMetadata).description = _matter.data.description;

  return NextResponse.json({ ...blog });
};

//@ts-ignore
export const GET = apiErrorHandler(_GET);
