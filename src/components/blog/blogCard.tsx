import Link from "next/link";
import Image from "next/legacy/image";
import { sendGTMEvent } from "@next/third-parties/google";

import { cn } from "@/lib/utils";
import config from "@/config/default.json";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_CATEGORY, DEFAULT_IMAGE } from "@/utils/constants";
import useBlogTimeFormat from "@/hooks/useBlogTimeFormat";
import { ListBlobResultBlob } from "@vercel/blob";
import grayMatter from "gray-matter";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import utils from "@/utils";

interface Props {
  blog: ListBlobResultBlob;
}

type CardProps = React.ComponentProps<typeof Card> & { size?: "sm" | "lg" };

export const fetchBlogContent = (url: string) =>
  utils.fetchWithTimeout(url).then(async (res) => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error((error as Error).message ?? "Something went wrong while fetching Blog content");
    }

    return await (await res.blob()).text();
  });

export default function BlogCard({ className, blog, size = "sm", ...props }: CardProps & Props) {
  const [matter, setMatter] = useState<ReturnType<typeof grayMatter> | null>(null);

  const { url, uploadedAt, pathname } = blog;

  const { formattedTime } = useBlogTimeFormat(uploadedAt.toString());

  const blogUrl = pathname.split("/")[1].replace(".md", "");

  const blogURL = `${config.blogBaseURL}/${blogUrl}`;

  const showCategory = useCallback(() => {
    if (matter) return matter.data.tags[0].trim() ?? DEFAULT_CATEGORY;
  }, [matter]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["blogs", url],
    queryFn: ({ queryKey }) => fetchBlogContent(queryKey[1]),
  });

  useEffect(() => {
    if (!matter && data) setMatter(grayMatter(data));
  }, [data]);

  // analytics
  const handleLinkClick = useCallback(
    () =>
      sendGTMEvent({
        event: "blogView",
        blog: matter?.data.title || "",
        blogUrl: window.location.href,
      }),
    [matter]
  );

  if (!matter) return null;

  if (size === "lg")
    return (
      <Link onClick={handleLinkClick} href={blogURL} className="block w-full no-underline">
        <Card
          className={cn("cursor-pointer group w-full md:grid grid-cols-[1fr_350px] relative overflow-hidden border-gray-50 shadow", className)}
          {...props}
        >
          <div className={cn("min-h-48 relative border-r border-gray-50 dark:border-neutral-800")}>
            <Image
              src={matter.data.image || DEFAULT_IMAGE}
              alt={matter.data.title}
              layout="fill"
              objectFit="cover"
              priority
              className="transition-all group-hover:scale-110 duration-300"
            />
          </div>
          <div className="">
            <CardHeader className={cn("relative h-auto flex flex-col gap-3 mb-2")}>
              <CardDescription className={cn("uppercase font-semibold text-xs")}>{showCategory()}</CardDescription>
              <CardTitle className={cn("md:text-3xl")}>{matter.data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className={cn("font-medium")}>
                {/* {isModified && <span className="font-semibold">Updated</span>} */}
                {formattedTime}{" "}
              </CardDescription>
            </CardContent>
          </div>
        </Card>
      </Link>
    );

  return (
    <Link href={blogURL} onClick={handleLinkClick} className="no-underline">
      <Card
        className={cn(" cursor-pointer group min-w-[330px] max-w-[400px] w-full relative overflow-hidden border-gray-50 shadow", className)}
        {...props}
      >
        <div className={cn("min-h-48 relative border-b border-gray-50 dark:border-neutral-800")}>
          <Image
            src={matter.data.image || DEFAULT_IMAGE}
            alt={matter.data.title}
            layout="fill"
            objectFit="cover"
            priority
            className="transition-all group-hover:scale-110 duration-300"
          />
        </div>
        <CardHeader className={cn("relative  h-auto  flex flex-col gap-3 ")}>
          <CardDescription className={cn("uppercase font-semibold text-xs line-clamp-1")}>{showCategory()}</CardDescription>
          <CardTitle className="line-clamp-2">{matter.data.title}</CardTitle>
          <CardDescription className={cn("font-medium")}>
            {/* {isModified && <span className="font-semibold">Updated</span>} */}
            {formattedTime}{" "}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
