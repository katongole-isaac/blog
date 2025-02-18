import Image from "next/legacy/image";

import SocialMediaLinks from "./socials";
import constants from "@/utils/constants";

interface Props {
  metadata: { [x: string]: any };
}
const BlogHeaderPreview: React.FC<Props> = ({ metadata }) => {
  const blogCategory = Array.isArray(metadata.tags) ? metadata.tags[0] : constants.DEFAULT_CATEGORY;

  return (
    <>
      <section className="prose dark:prose-invert pb-5 mt-5 ">
        <div className="flex flex-col gap-1">
          <div className="space-y-1 not-prose">
            <p className="uppercase text-neutral-500 font-medium text-xs dark:text-neutral-700"> {blogCategory} </p>
          </div>

          <h1 className="text-3xl md:text-4xl text-center text-black lg:text-5xl mt-4">{metadata.title || ""}</h1>
        </div>

        {metadata.description && (
          <div className="font-semibold text-lg text-center text-neutral-700 mb-0 py-0">
            <p>{metadata.description}</p>
          </div>
        )}

        <SocialMediaLinks preview />

        {metadata.image && (
          <div className="mt-8">
            <div className="w-full h-52 md:h-80 border dark:border-neutral-300 rounded-md relative">
              <Image
                src={metadata.image || constants.DEFAULT_IMAGE}
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
