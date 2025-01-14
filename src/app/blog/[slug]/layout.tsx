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
    }, 100);
    setImagePreview((prev) => ({ ...prev, open: false }));
  };
  return (
    <ReactQueryProvider>
      <AppContext.Provider value={{ imagePreviewOpen: imagePreview.open, handleImagePreview, imagePreviewURL: imagePreview.url }}>
        <AnimatePresence>{imagePreview.open && <BlogImagePreview onClose={closeImagePreview} />}</AnimatePresence>
        <Navbar />
        <section className="max-w-screen-md m-auto py-10 font-apple">
          <BlogHeader />

          <section className="px-10 md:px-14">{children}</section>
        </section>
      </AppContext.Provider>
    </ReactQueryProvider>
  );
}
