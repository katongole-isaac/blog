"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface Props {
  caption?: string;
  url: string;
  onOpenPreview?: () => void;
}

const variants: Variants = {
  offscreen: {
    y: 20,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      ease: "easeOut",
    },
  },
};

const BlogImage: React.FC<Props> = ({ onOpenPreview }) => {
  return (
    <>
      <section className="pt-2 pb-6 px-6 lg:px-0 space-y-2 transition-all">
        <motion.div
          variants={variants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          role="button"
          onClick={onOpenPreview}
          className="relative border transition-all h-60 md:h-80 lg:h-96 lg:max-h-96 rounded-md overflow-hidden"
        >
          <Image src="/images/default.png" alt="Default image" objectFit="contain" fill />
        </motion.div>
        <div className="">
          <p className="text-neutral-500 text-center text-sm font-semibold">The new caption of this image is so cool, lol</p>
        </div>
      </section>
    </>
  );
};

export default BlogImage;
