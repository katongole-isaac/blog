import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

const SocialMediaLinks = () => {
  const iconSize = 20;
  // bottom-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4

  const handleCopyLink = () => {
    toast.custom(<Toast />, { position: "bottom-center", id: "copy-link" });
  };

  const Toast = () => (
    <div className="dark:bg-neutral-800 bg-dark text-dark dark:text-white  py-2 px-5 border dark:border-neutral-700 min-w-max w-max max-w-96 rounded-md shadow-sm ">
      <p>Link copied</p>
    </div>
  );

  return (
    <section className="py-2">
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
        <LinkIcon size={iconSize} onClick={() => handleCopyLink()} />
      </div>
    </section>
  );
};

export default SocialMediaLinks;
