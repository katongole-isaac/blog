"use client";

import Navbar from "@/components/navbar";
import Test from "./test";
import BlogHeader from "@/components/blog/header";
import BlogContent from "@/components/blog/content";
import SocialMediaLinks from "@/components/blog/socials";
import BlogImage from "@/components/blog/blogImage";
import BlogImagePreview from "../components/blog/blogImagePreview";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [imagePreviewModal, setImagePreviewModal] = useState(false);

  return (
    <>
      <Navbar />
      <Test />
    </>
  );
  return (
    <>
      <AnimatePresence>
        {imagePreviewModal && <BlogImagePreview onClose={() => setImagePreviewModal(false)} open={imagePreviewModal} />}
      </AnimatePresence>
      <Navbar />
      <main className="">
        {/* blog cotainer list */}
        {/* <section className="max-w-screen-lg m-auto flex flex-col gap-10  items-center justify-center py-5 md:px-14 lg:px-16 md:py-10">
        </section> */}

        <section className="max-w-screen-md m-auto py-10">
          <BlogHeader />
          <BlogImage url="" onOpenPreview={() => setImagePreviewModal(true)} />
          <BlogContent />
          <BlogContent />
          <BlogContent />
          <div className="px-10 md:px-14">
            <SocialMediaLinks />
          </div>
        </section>
      </main>
    </>
  );
}
