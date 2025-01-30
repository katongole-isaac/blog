import Image from "next/legacy/image";

import SocialMediaLinks from "./socials";
import { DEFAULT_CATEGORY, DEFAULT_IMAGE } from "@/utils/constants";
import useBlogTimeFormat from "@/hooks/useBlogTimeFormat";

interface Props {
  metadata: { [x: string]: any };
  uploadedAt: string;
}
const BlogHeader: React.FC<Props> = ({ metadata, uploadedAt }) => {
  const { formattedTime } = useBlogTimeFormat(uploadedAt);
  const blogCategory = metadata.tags[0] ?? DEFAULT_CATEGORY;

  return (
    <>
      <section className="prose dark:prose-invert pb-10 mt-5 ">
        <div className="flex flex-col gap-6">
          <div className="space-y-1 not-prose">
            <p className="uppercase text-neutral-500 dark:text-neutral-300 font-medium text-xs"> {blogCategory} </p>
            <p className=" text-neutral-500 dark:text-neutral-300 font-medium text-xs">
              {/* {isModified && <span className="font-semibold">Updated</span>}  */}
              {formattedTime}
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl text-center lg:text-5xl mt-4">{metadata.title}</h1>
        </div>

        {metadata.description && (
          <div className="font-semibold text-lg mb-0 py-2">
            <p>{metadata.description}</p>
          </div>
        )}

        <SocialMediaLinks />
        {metadata.image && (
          <div className="mt-8">
            <div className="w-full h-52 md:h-80 relative">
              <Image
                src={metadata.image || DEFAULT_IMAGE}
                alt={metadata.title}
                layout="fill"
                objectFit="cover"
                priority
                className="transition-all group-hover:scale-110 duration-300"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default BlogHeader;
