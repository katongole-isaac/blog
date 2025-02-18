"use client";

import {  useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, useScroll } from "framer-motion";

import Navbar from "@/components/navbar";
import constants from "@/utils/constants";
import ReactQueryProvider from "@/lib/reactQuery";
import { AppContext } from "@/context/appContext";
import BlogScrollProgress from "@/components/blog/blogScrollProgress";

// lazy loading
const BlogImagePreview = dynamic(() => import("@/components/blog/blogImagePreview"), { ssr: false });

interface Props {
  children: React.ReactNode;
}
export default function BlogLayout({ children }: Props): React.JSX.Element {
  const { scrollYProgress } = useScroll();

  const [imagePreview, setImagePreview] = useState({
    open: false,
    url: "",
  });

  const handleImagePreview = (src: string) => {
    if (src === constants.DEFAULT_IMAGE) return;
    setImagePreview((prev) => ({ ...prev, url: src, open: true }));
  };

  const closeImagePreview = () => {
    setTimeout(() => {
      setImagePreview((prev) => ({ ...prev, url: "" }));
    }, 500);
    setImagePreview((prev) => ({ ...prev, open: false }));
  };
  return (
    <div className="mt-5 bg-gray-50/50 dark:bg-black min-h-screen">
      <ReactQueryProvider>
        <AppContext.Provider value={{ imagePreviewOpen: imagePreview.open, handleImagePreview, imagePreviewURL: imagePreview.url }}>
          <AnimatePresence>{imagePreview.open && <BlogImagePreview onClose={closeImagePreview} />}</AnimatePresence>
          <Navbar />
          <BlogScrollProgress scrollYProgress={scrollYProgress} />
          <section className=" max-w-screen-md m-auto py-10 font-apple prose dark:prose-invert  prose-headings:font-medium prose-blockquote:border-0 prose-pre:bg-transparent prose-pre:p-0 prose-h1:mb-0 prose-a:no-underline ">
            <section className="px-10 md:px-14">{children}</section>
          </section>
        </AppContext.Provider>
      </ReactQueryProvider>
    </div>
  );
}

