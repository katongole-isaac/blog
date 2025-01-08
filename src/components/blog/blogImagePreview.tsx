import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  url?: string;
  onClose: () => void;
  open: boolean;
}

// for motion [animations]
const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const DEFAULT_IMAGE_PATH = "/images/default.png";

const BlogImagePreview: React.FC<Props> = ({ url, open, onClose }) => {
  const imageURL = url?.trim() ? url : DEFAULT_IMAGE_PATH;

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && ref.current.contains(e.target as Node) && open) return;
    onClose();
  };

  const handleModalClose = () => onClose();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      className="fixed z-[1000] w-screen bg-gray-50/60 h-screen filter backdrop-blur"
    >
      <div className="max-w-screen-md m-auto py-4 px-5 md:px-10 lg:px-5 h-full flex flex-col justify-center ">
        <div
          onClick={handleModalClose}
          role="button"
          className=" absolute right-10 top-10 rounded-full w-10 h-10 p-2 bg-gray-200 cursor-pointer flex items-center justify-center"
        >
          <X size={25} className="text-neutral-500 hover:text-neutral-600 transition-all" />
        </div>

        <div ref={ref} className="relative bg-white w-full h-60  md:h-96 lg:h-[26rem]">
          <Image src={imageURL} alt="default.png" fill objectFit="contain" />
        </div>
      </div>
    </motion.section>
  );
};

export default BlogImagePreview;
