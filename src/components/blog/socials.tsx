import Link from "next/link";
import toast from "react-hot-toast";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link as LinkIcon } from "lucide-react";

import utils from "@/utils";

const SocialMediaLinks = () => {
  const iconSize = 20;
  
  const handleCopyLink = async () => {
    utils.copyToClipboard("Uganda", () => {
      toast.custom(<Toast />, { position: "bottom-right", id: "copy-link" });
    });
  };

  const Toast = () => (
    <div className="flex gap-3 items-center bg-neutral-800 text-gray-100 py-2 px-5 border dark:border-neutral-700 min-w-max w-max max-w-96 rounded-md shadow-sm ">
      <LinkIcon size={iconSize} />
      <p>Copied link to clipboard</p>
    </div>
  );

  return (
    <section className="py-2">
      <p className="absolute hidden " id="clipboard" data-clipboard-text="normal"></p>
      <div className="flex gap-4 text-neutral-500 [&>*]:cursor-pointer hover:[&_svg]:text-neutral-700 dark:hover:[&_svg]:text-neutral-400 duration-200 transition-all">
        <Link href="https://www.facebook.com/sharer/sharer.php?u=https://your-blog-post-url.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook size={iconSize} />
        </Link>
        <Link
          href="https://x.com/intent/tweet?text=Check+out+this+post!&url=https://your-blog-post-url.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaXTwitter size={iconSize} />
        </Link>
        <LinkIcon className="dark:text-white text-black" size={iconSize} onClick={() => handleCopyLink()} />
      </div>
    </section>
  );
};

export default SocialMediaLinks;
