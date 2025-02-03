import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import BlogCard from "@/components/blog/blogCard";

import utils from "@/utils";
import BlogsLoading from "./blogsLoading";
import { BlogError } from "@/components/common/error";
import ProgressBar from "@/components/common/progressBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAllBlogError, fetchBlogs, getAllBlogsState } from "@/store/blogSlice";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const [onFirstRender, setOnFirstRender] = useState(true);

  const { data, isLoading, error } = useAppSelector(getAllBlogsState);

  useEffect(() => {
    setOnFirstRender(false);
    dispatch(clearAllBlogError());
    dispatch(fetchBlogs());
  }, []);

  useEffect(() => {
    if (error && data && data.length > 0 && !onFirstRender)
      toast.custom(
        <div className="max-w-[400px] min-w-[400px] border border-rose-600 py-3 px-4 text-white from-rose-700 via-rose-800 to-rose-900  bg-gradient-to-b">
          {error?.message}
        </div>,
        {
          id: "blogs_fetch_error",
          position: "bottom-left",
        }
      );
  }, [data, onFirstRender, error]);

  const blogs = useMemo(() => (data ? utils.displayOrderForBlogs(data) : []), [data]);

  if (error && data?.length === 0)
    return (
      <div className="mt-20 max-w-screen-md m-auto ">
        {" "}
        <BlogError error={error} />{" "}
      </div>
    );

  return (
    <>
      {isLoading && data && data?.length > 0 && <ProgressBar />}
      <main className="dark:bg-black prose dark:prose-invert m-auto max-w-screen-lg mt-16 ">
        {/* blog cotainer list */}
        <section className="max-w-screen-lg m-auto flex flex-col gap-8 items-center  px-5 py-5 md:px-10 lg:px-14 md:py-8">
          {isLoading && data?.length === 0 && <BlogsLoading />}
          {!!data?.length && !isLoading && blogs.length === 0 && (
            <div className="">
              <p className="text-xl tracking-wider font-semibold">Oops! Looks like there are no posts at the moment.</p>
            </div>
          )}
          {!!data?.length &&
            blogs.map((blogArray, index) => {
              if (index === 0 && blogs.length > 1)
                return blogArray.map((blog, idx) => <BlogCard key={blog.pathname + idx.toString()} blog={blog} size="lg" className="flex-1" />);

              return (
                <div key={index} className="flex flex-col md:flex-row gap-4">
                  {blogArray.map((blog, _idx) => (
                    <BlogCard key={blog.pathname + _idx.toString()} blog={blog} />
                  ))}
                </div>
              );
            })}
        </section>
      </main>
    </>
  );
}
