import SocialMediaLinks from "./socials";
import { DEFAULT_CATEGORY, DEFAULT_IMAGE } from "@/utils/constants";
import Image from "next/legacy/image";

interface Props {
  metadata: { [x: string]: any };
}
const BlogHeaderPreview: React.FC<Props> = ({ metadata }) => {
  const blogCategory = Array.isArray(metadata.tags) ? metadata.tags[0] : DEFAULT_CATEGORY;

  return (
    <>
      <section className="prose dark:prose-invert pb-5 mt-5 ">
        <div className="flex flex-col gap-1">
          <div className="space-y-1 not-prose">
            <p className="uppercase text-neutral-500 dark:text-neutral-300 font-medium text-xs"> {blogCategory} </p>
          </div>

          <h1 className="text-3xl md:text-4xl text-center lg:text-5xl mt-4">{metadata.title || ""}</h1>
        </div>

        {metadata.description && (
          <div className="font-semibold text-lg text-center mb-0 py-0">
            <p>{metadata.description}</p>
          </div>
        )}

        <SocialMediaLinks preview />

        {metadata.image && (
          <div className="mt-8">
            <div className="w-full h-52 md:h-80 border dark:border-neutral-800 relative">
              <Image
                src={metadata.image || DEFAULT_IMAGE}
                alt={metadata.title}
                layout="fill"
                objectFit="contain"
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

export default BlogHeaderPreview;
