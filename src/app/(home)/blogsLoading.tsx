import { Skeleton } from "@/components/ui/skeleton";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export const BlogCardLoading: React.FC<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { size?: "lg" | "sm" }> = ({
  className,
  size = "sm",
  ...props
}) => {
  const _size = size === "lg";
  return (
    <div className={`${_size ? "" : "space-y-6"} border border-gray-100 dark:border-neutral-900 rounded-md ${className}`} {...props}>
      <Skeleton className="h-48 flex-1 bg-gray-200" />
      <div className="flex-1 flex gap-3 flex-col">
        <Skeleton className={`h-6 rounded-none bg-gray-200 ${_size ? "flex-1" : ""} `} />
        <Skeleton className="h-20 rounded-none bg-gray-200" />
        <Skeleton className={`h-6 rounded-none bg-gray-200 ${_size ? "flex-1" : ""} `} />
      </div>
    </div>
  );
};

export default function BlogsLoading() {
  return (
    <div className="w-full space-y-14">
      <BlogCardLoading className="flex w-full gap-8 " size="lg" />
      <div className="space-y-4 md:flex gap-8 w-full ">
        <BlogCardLoading className="flex-1 " />
        <BlogCardLoading className="flex-1 " />
      </div>
      <div className="space-y-4 md:flex gap-5 w-full ">
        <BlogCardLoading className="flex-1 " />
        <BlogCardLoading className="flex-1 " />
        <BlogCardLoading className="flex-1 " />
      </div>
      <div className="space-y-4 md:flex gap-5 w-full ">
        <BlogCardLoading className="flex-1 " />
        <BlogCardLoading className="flex-1 " />
        <BlogCardLoading className="flex-1 " />
      </div>
    </div>
  );
}
