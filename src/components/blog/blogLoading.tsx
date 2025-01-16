import { Skeleton } from "../ui/skeleton";

const BlogLoading = () => {
  return (
    <div className="">
      <div className="space-y-8 mb-20">
        <Skeleton className="w-full h-10" />
        <div className="space-y-8">
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-32" />
        </div>
        <Skeleton className="w-full h-10" />
      </div>
      <div className="space-y-6">
        <Skeleton className="w-full h-56" />
        <Skeleton className="w-full h-56" />
        <Skeleton className="w-full h-56" />
      </div>
    </div>
  );
};

export default BlogLoading;
