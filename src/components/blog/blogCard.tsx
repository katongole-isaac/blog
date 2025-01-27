import Link from "next/link";
import slugify from "slugify";
import Image from "next/legacy/image";
import { sendGTMEvent } from "@next/third-parties/google";

import { cn } from "@/lib/utils";
import config from "@/config/default.json";
import { BlogResponse } from "@/utils/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_CATEGORY, DEFAULT_IMAGE } from "@/utils/constants";
import useBlogTimeFormat from "@/hooks/useBlogTimeFormat";

interface Props {
  blog: BlogResponse;
}

type CardProps = React.ComponentProps<typeof Card> & { size?: "sm" | "lg" };

export default function BlogCard({ className, blog, size = "sm", ...props }: CardProps & Props) {
  const { matter, lastModified, isModified, createdAt, _slug } = blog;

  const { formattedTime } = useBlogTimeFormat(isModified ? lastModified : createdAt);

  console.log({createdAt, lastModified });

  const slugURL = _slug.trim() ? _slug.trim() : matter.data.slug.trim();
  const slug = slugify(slugURL, { lower: true, strict: true });
  const blogURL = `${config.blogBaseURL}/${slug}`;

  const blogCategory = matter.data.tags[0].trim() ?? DEFAULT_CATEGORY;

  // analytics
  const handleLinkClick = () =>
    sendGTMEvent({
      event: "blogView",
      blog: matter.data.title,
      blogUrl: window.location.href
    });

  if (size === "lg")
    return (
      <Link  onClick={handleLinkClick} href={blogURL} className="block w-full no-underline">
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
              <CardDescription className={cn("uppercase font-semibold text-xs")}>{blogCategory}</CardDescription>
              <CardTitle className={cn("md:text-3xl")}>{matter.data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className={cn("font-medium")}>
                {isModified && <span className="font-semibold">Updated</span>} {formattedTime}{" "}
              </CardDescription>
            </CardContent>
          </div>
        </Card>
      </Link>
    );

  return (
    <Link href={blogURL} className="no-underline">
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
          <CardDescription className={cn("uppercase font-semibold text-xs line-clamp-1")}>{blogCategory}</CardDescription>
          <CardTitle className="line-clamp-2">{matter.data.title}</CardTitle>
          <CardDescription className={cn("font-medium")}>
            {isModified && <span className="font-semibold">Updated</span>} {formattedTime}{" "}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
