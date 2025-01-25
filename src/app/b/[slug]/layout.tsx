import { Metadata } from "next";
import BlogLayout from "./blogLayout";
import config from "@/config/default.json";
import { type BlogMetadata } from "@/utils/types";

interface Props {
  children: React.ReactNode;
}

interface IMetadata {
  params: Promise<{ [key: string]: any }>;
}
export default function ({ children }: Props): React.JSX.Element {
  return <BlogLayout>{children}</BlogLayout>;
}

export async function generateMetadata({ params }: IMetadata): Promise<Metadata> {
  const { slug } = await params;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const url = `${baseURL}/${config.blogMetadata}/${slug.trim()}`;

  const res = await fetch(url);
  const data = (await res.json()) as BlogMetadata;

  return { ...data };
}
