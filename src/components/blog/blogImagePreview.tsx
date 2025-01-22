import NextImage from "next/legacy/image";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_IMAGE } from "@/utils/constants";
import { useAppContext } from "@/context/appContext";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  onClose: () => void;
}

const BlogImagePreview: React.FC<Props> = ({ onClose }) => {
  const { imagePreviewOpen, imagePreviewURL } = useAppContext();
  const imageURL = imagePreviewURL?.trim() ? imagePreviewURL : DEFAULT_IMAGE;

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && ref.current.contains(e.target as Node) && imagePreviewOpen) return;
    onClose();
  };

  const closeOnEsc = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "escape" && imagePreviewOpen) handleModalClose();
  };
  const handleModalClose = () => onClose();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", closeOnEsc);

    return () => {
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, [imagePreviewOpen]);

  return (
    <Dialog open={imagePreviewOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-md !bg-transparent border-none shadow-sm dark:shadow-none">
        <DialogTitle></DialogTitle>
        <div className="max-w-screen-lg w-full m-auto py-4 px-5 md:px-10 lg:px-5 h-full flex flex-col justify-center  ">
          <div ref={ref} className="relative bg-transparent w-full h-60 border- dark:border-neutral-900  md:h-96 lg:h-[26rem]">
            <NextImage src={imageURL} alt="default.png" layout="fill" sizes="100vw" objectFit="contain" quality={80} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogImagePreview;
