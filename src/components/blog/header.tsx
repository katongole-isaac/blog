import { BlogResponse } from "@/utils/types";
import SocialMediaLinks from "./socials";

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
      <section className="prose dark:prose-invert pb-6 pt-2">
        <div className="flex flex-col gap-6">
          <div className="space-y-1 not-prose">
            <p className="uppercase text-neutral-500 dark:text-neutral-300 font-medium text-xs"> Press Release </p>
            <p className="uppercase text-neutral-500 dark:text-neutral-300 font-medium text-xs"> {new Date().toDateString()} </p>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl mt-4">{metadata.title}</h1>
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
