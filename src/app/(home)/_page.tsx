import BlogCard from "@/components/blog/blogCard";

import utils from "@/utils";

import BlogsLoading from "./blogsLoading";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBlogs, getAllBlogsState } from "@/store/blogSlice";
import { useEffect, useMemo } from "react";
import { BlogError } from "@/components/common/error";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector(getAllBlogsState);

  useEffect(() => {
    if (data.length <= 0) dispatch(fetchBlogs());
  }, []);

  const blogs = useMemo(() => utils.displayOrderForBlogs(data), [data]);

  if (error)
    return (
      <div className="mt-20 max-w-screen-md m-auto ">
        <BlogError error={error} />
      </div>
    );

  return (
    <main className="dark:bg-black prose dark:prose-invert m-auto max-w-screen-lg mt-16 ">
      {/* blog cotainer list */}
      <section className="max-w-screen-lg m-auto flex flex-col gap-8  items-center justify-center px-5 py-5 md:px-10 lg:px-14 md:py-8">
        {isLoading && <BlogsLoading />}
        {data && !isLoading && blogs.length === 0 && (
          <div className="">
            <p className="text-xl tracking-wider font-semibold">Oops! Looks like there are no posts at the moment.</p>
          </div>
        )}
        {data &&
          !isLoading &&
          blogs.map((blogArray, index) => {
            if (index === 0 && blogs.length > 1)
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
