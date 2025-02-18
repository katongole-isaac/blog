"use client";

import { Button } from "@/components/ui/button";
import { resetActiveDraft } from "@/store/blogSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const createPostLink = "/d/create";

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleCreateNewBlog = () => {
    dispatch(resetActiveDraft());
    router.push(createPostLink);
  };

  return (
    <div className="mb-6 flex justify-between items-center  px-2 lg:px-0">
      <h3 className=" text-xl md:text-2xl font-semibold">Dashboard</h3>
      <Button
        size="sm"
        variant="outline"
        onClick={handleCreateNewBlog}
        className="font-semibold text-neutral-600 hover:text-neutral-700 dark:text-gray-200"
      >
        Create Post
      </Button>
    </div>
  );
};

export default DashboardHeader;
