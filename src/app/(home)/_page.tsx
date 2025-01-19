import BlogCard from "@/components/blog/blogCard";
import { useQuery } from "@tanstack/react-query";

import utils from "@/utils";
import config from "@/config/default.json";
import { type BlogResponse } from "@/utils/types";
import BlogsLoading from "./blogsLoading";

export default function HomePage() {
  const fetchBlogs: () => Promise<{ results: BlogResponse[] }> = () => fetch(config.getPosts).then((res) => res.json());
  const { data, error, isLoading } = useQuery({
    queryKey: ["all-blogs"],
    queryFn: fetchBlogs,
  });

  return (
    <main className="dark:bg-black prose dark:prose-invert m-auto max-w-screen-lg mt-12 ">
      {/* blog cotainer list */}
      <section className="max-w-screen-lg m-auto flex flex-col gap-8  items-center justify-center px-5 py-5 md:px-10 lg:px-14 md:py-8">
        {isLoading && <BlogsLoading />}
        {data &&
          !isLoading &&
          utils.displayOrderForBlogs(data.results).map((blogArray, index) => {
            if (index === 0)
              return blogArray.map((blog, idx) => (
                <BlogCard key={blog.matter.data.title + idx.toString()} blog={blog} size="lg" className="flex-1" />
              ));

            return (
              <div key={index} className="flex flex-col md:flex-row gap-4">
                {blogArray.map((blog, _idx) => (
                  <BlogCard key={blog.matter.data.title + _idx.toString()} blog={blog} />
                ))}
              </div>
            );
          })}
      </section>
    </main>
  );
}
