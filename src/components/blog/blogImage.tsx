import Image from "next/image";

interface Props {
  caption?: string;
  url: string;
}

export default function BlogImage() {
  return (
    <section className="pt-2 pb-6 px-6 lg:px-0 space-y-2 transition-all">
      <div className="relative border transition-all h-60 md:h-80 lg:h-96 lg:max-h-96 rounded-md overflow-hidden">
        <Image src="/images/default.png" alt="Default image" objectFit="contain" fill />
      </div>
      <div className="">
        <p className="text-neutral-500 text-center text-sm font-semibold">The new caption of this image is so cool, lol</p>
      </div>
    </section>
  );
}
