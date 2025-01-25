import SocialMediaLinks from "./socials";
import { BlogResponse } from "@/utils/types";
import { DEFAULT_CATEGORY } from "@/utils/constants";
import useBlogTimeFormat from "@/hooks/useBlogTimeFormat";

interface Props {
  blog: BlogResponse;
}
const BlogHeader: React.FC<Props> = ({ blog }) => {
  const {
    lastModified,
    createdAt,
    isModified,
    matter: { data: metadata },
  } = blog;

  const { formattedTime } = useBlogTimeFormat(isModified ? lastModified : createdAt);
  const blogCategory = metadata.tags[0] ?? DEFAULT_CATEGORY;

  return (
    <>
      <section className="prose dark:prose-invert pb-6 mt-5">
        <div className="flex flex-col gap-6">
          <div className="space-y-1 not-prose">
            <p className="uppercase text-neutral-500 dark:text-neutral-300 font-medium text-xs"> {blogCategory} </p>
            <p className=" text-neutral-500 dark:text-neutral-300 font-medium text-xs">
              {isModified && <span className="font-semibold">Updated</span>} {formattedTime}{" "}
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
      </section>
    </>
  );
};

export default BlogHeader;
