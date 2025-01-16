"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "@/components/navbar";
import { AppContext } from "@/context/appContext";
import BlogHeader from "@/components/blog/header";
import ReactQueryProvider from "@/utils/RQProvider";
import BlogImagePreview from "@/components/blog/blogImagePreview";
import { DEFAULT_IMAGE } from "@/utils/constants";

interface Props {
  children: React.ReactNode;
}
export default function BlogLayout({ children }: Props): React.JSX.Element {
  const [imagePreview, setImagePreview] = useState({
    open: false,
    url: "",
  });

  const handleImagePreview = (src: string) => {
    if (src === DEFAULT_IMAGE) return;
    setImagePreview((prev) => ({ ...prev, url: src, open: true }));
  };

  const closeImagePreview = () => {
    setTimeout(() => {
      setImagePreview((prev) => ({ ...prev, url: "" }));
    }, 500);
    setImagePreview((prev) => ({ ...prev, open: false }));
  };
  return (
    <div className="bg-gray-50/50 dark:bg-black min-h-screen">
      <ReactQueryProvider>
        <AppContext.Provider value={{ imagePreviewOpen: imagePreview.open, handleImagePreview, imagePreviewURL: imagePreview.url }}>
          <AnimatePresence>{imagePreview.open && <BlogImagePreview onClose={closeImagePreview} />}</AnimatePresence>
          <Navbar />
          <section className=" max-w-screen-md m-auto py-10 font-apple prose dark:prose-invert  prose-headings:font-medium prose-blockquote:border-0 prose-pre:bg-transparent prose-pre:p-0 prose-h1:mb-0 prose-a:no-underline ">
            <section className="px-10 md:px-14">{children}</section>
          </section>
        </AppContext.Provider>
      </ReactQueryProvider>
    </div>
  );
}
