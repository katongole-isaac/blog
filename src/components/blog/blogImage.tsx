"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAppContext } from "@/context/appContext";

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

const BlogImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, height, width, ...props }) => {
  const { handleImagePreview } = useAppContext();

  return (
    <>
      <span className="pt-2 inline-flex flex-col w-full justify-center items-center pb-6 px-6 lg:px-0 space-y-2 transition-all">
        <motion.span
          variants={variants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          role="button"
          onClick={() => handleImagePreview(src!)}
          className="relative inline-flex justify-center items-center border border-gray-100/40 transition-all w-full h-40  md:h-72 lg:h-90 lg:max-h-96 rounded-md overflow-hidden"
        >
          <Image src={src!} alt={alt!} height={height as number} width={width as number} fill quality={100} objectFit="contain" {...props} />
        </motion.span>
        {/* if you ever need caption */}
        {/* <span className="text-neutral-500 inline-block text-center text-sm font-semibold">The new caption of this image is so cool, lol</span> */}
      </span>
    </>
  );
};

export default BlogImage;
