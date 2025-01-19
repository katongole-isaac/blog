import { Skeleton } from "../ui/skeleton";

const BlogLoading = () => {
  return (
    <div className="mt-4">
      <div className="space-y-8 mb-20">
        <Skeleton className="w-full h-10 bg-gray-200" />
        <div className="space-y-8">
          <Skeleton className="w-full h-52 bg-gray-200" />
          <Skeleton className="w-full h-32 bg-gray-200" />
        </div>
        <Skeleton className="w-full h-10 bg-gray-200" />
      </div>
      <div className="space-y-6">
        <Skeleton className="w-full h-56 bg-gray-200" />
        <Skeleton className="w-full h-56 bg-gray-200" />
        <Skeleton className="w-full h-56 bg-gray-200" />
      </div>
    </div>
  );
};

export default BlogLoading;
