import { BlogResponse } from "@/utils/types";
import SocialMediaLinks from "./socials";
import utils from "@/utils";


interface Props {
  blog: BlogResponse;
}
const BlogHeader: React.FC<Props> = ({ blog }) => {
  const {
    lastModified,
    matter: { data: metadata },
  } = blog;

  return (
    <>
      <section className="prose dark:prose-invert pb-6 mt-5">
        <div className="flex flex-col gap-6">
          <div className="space-y-1 not-prose">
            <p className="uppercase text-neutral-500 dark:text-neutral-300 font-medium text-xs"> Press Release </p>
            <p className=" text-neutral-500 dark:text-neutral-300 font-medium text-xs"> {utils.blogTimeFormat(Date.now())} </p>
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
