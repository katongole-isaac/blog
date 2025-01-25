import dayjs from "dayjs";
import { Metadata } from "next";

import BlogLayout from "./blogLayout";
import config from "@/config/default.json";
import { type BlogMetadata } from "@/utils/types";
import Footer from "@/components/common/footer";
import { SITE_CREATOR, SITE_NAME } from "@/utils/constants";

interface Props {
  children: React.ReactNode;
}

interface IMetadata {
  params: Promise<{ [key: string]: any }>;
}
export default function ({ children }: Props): React.JSX.Element {
  return (
    <>
      <BlogLayout>{children}</BlogLayout>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: IMetadata): Promise<Metadata> {
  const { slug } = await params;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const url = `${baseURL}/${config.blogMetadata}/${slug.trim()}`;

  const res = await fetch(url);
  const data = (await res.json()) as BlogMetadata;

  const publishedTime = dayjs(data.createdAt).format();

  return {
    title: data.title,
    description: data.description,
    keywords: data.tags,
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [data.image!],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    creator: SITE_CREATOR,

    openGraph: {
      url: baseURL,
      publishedTime,
      type: "article",
      title: data.title,
      siteName: SITE_NAME,
      description: data.description,
      images: [
        {
          url: data.image!,
          width: 800,
          height: 600,
        },
      ],
    },
  };
}
