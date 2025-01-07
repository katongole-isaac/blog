import { Link } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function SocialMediaLinks() {
  const iconSize = 20;
  return (
    <section className="py-2">
      <div className="flex gap-4 text-neutral-500 [&>*]:cursor-pointer hover:[&>svg]:text-neutral-700 duration-200 transition-all">
        <FaFacebook size={iconSize} />
        <FaXTwitter size={iconSize} />
        <Link size={iconSize} />
      </div>
    </section>
  );
}
