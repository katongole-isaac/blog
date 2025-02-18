import { getAllBlogsState } from "@/store/blogSlice";
import { useAppSelector } from "@/store/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import config from "@/config/default.json";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
}

const NextBlogButton: React.FC<Props> = ({ slug }) => {
  const router = useRouter();
  const firstBlogIndex = 0;

  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const { data } = useAppSelector(getAllBlogsState);

  const pathname = (str: string) => str.split("/")[1].replace(".md", "");

  const handlePrevAndNext = useCallback(
    (currentIndex: number, operation: "prev" | "next") => {
      if (data) {
        let index: number;

        if (currentIndex === data.length) index = data.length - 1;
        else index = operation === "next" ? ++currentIndex : --currentIndex;

        const prevBlog = data[index];

        if (prevBlog) {
          setCurrentBlogIndex(index);
          const blogURL = `${config.blogBaseURL}/${pathname(prevBlog.pathname)}`;
          router.push(blogURL);
        }
      }
    },
    [data]
  );

  useEffect(() => {
    if (data) {
      const index = data.findIndex((blog) => pathname(blog.pathname) === slug);
      if (index > -1) setCurrentBlogIndex(index);
    }
  }, [data]);

  return (
    <div className="mt-20 flex justify-between h-max ">
      {currentBlogIndex !== firstBlogIndex && (
        <div
          role="button"
          onClick={() => handlePrevAndNext(currentBlogIndex, "prev")}
          className="border w-32 py-3 px-4 rounded-md justify-center flex gap-0 items-center dark:hover:bg-neutral-900 hover:bg-gray-100"
        >
          <ChevronLeft size={22} />
          <p className="text-base !p-0 !m-0">Prev</p>
        </div>
      )}
      {data && currentBlogIndex !== data?.length - 1 && (
        <div
          role="button"
          onClick={() => handlePrevAndNext(currentBlogIndex, "next")}
          className="border w-32 py-3 px-4 rounded-md justify-center flex gap-0 items-center dark:hover:bg-neutral-900 hover:bg-gray-100"
        >
          <p className="text-base !p-0 !m-0">Next</p>
          <ChevronRight size={22} />
        </div>
      )}
    </div>
  );
};

export default NextBlogButton;
