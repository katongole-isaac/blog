import { Button } from "@/components/ui/button";
import { getEditorData } from "@/store/editorSlice";
import { useAppSelector } from "@/store/hooks";
import type { BlogMetadata, BlogType } from "@/utils/types";
import matter from "gray-matter";
import { useState } from "react";
import toast from "react-hot-toast";
import BlogUsageModal from "./blogUsageModal";
import slugify from "slugify";
import { useMutation } from "@tanstack/react-query";
import config from "@/config/default.json";
import { Loader } from "lucide-react";
import utils from "@/utils";
import Link from "next/link";
import { PutBlobResult } from "@vercel/blob";

interface BlogPayload {
  metadata: BlogMetadata;
  data: string;
}

const publishBlog = async (payload: BlogPayload) => {
  const url = `${config.blogUploads}?filename=${payload.metadata.slug}`;
  return fetch(url, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }).then(async (res) => {
    if (!res.ok) {
      const error = await res.json(); // server error;
      throw new Error(error?.message || "Something went wrong while posting blog post", {
        cause: { status: res.status, statusText: res.statusText, message: error?.message || res.statusText },
      });
    }
    return await res.json();
  });
};

const url = "https://9d3odxrej5fvz5hs.public.blob.vercel-storage.com/published/how-to-write-a-blog-AIK59WIQxLZMgD64BiX3aSGqhDTz3Z.md";
const fe = () => fetch(url).then(async (res) => await res.blob());

const AppEditorActions = () => {
  const { mutate, data, error, isPending } = useMutation({
    mutationFn: publishBlog,
    onMutate: (v) => {},
    onSuccess: (data, v) => {},
    onError: (error, v, c) => {},
  });

  const [showGuides, setShowGudies] = useState(false);

  const editorData = useAppSelector(getEditorData);

  const handlePublishBlog = (blogType: BlogType) => {
    try {
      const { data, content } = matter(editorData);

      const title = data?.title?.trim() || "";
      const description = data?.description?.trim() || "";
      const slug = data?.slug?.trim() || "";
      const image = data?.image?.trim() || "";
      const tags = data?.tags || [];

      // if the blog doesn't meet the guidelines
      // show the guidelines
      if (!(title && description && slug && image && tags.length > 0) || !content.trim()) {
        setTimeout(() => {
          toast.custom(noContentMessage, { id: "blog-guidlines-publish" });
        }, 1_000);

        setShowGudies(true);

        return;
      }

      const filename = slugify(slug, { lower: true, strict: true });

      const payload = {
        metadata: { title, slug: filename, description, image, tags },
        data: editorData,
        lastModified: Date.now(),
        createdAt: Date.now(),
      };

      // send to the backend
      const sendBlog = () =>
        toast.promise(
          new Promise((res, rej) => {
            mutate(payload, {
              onSuccess: res,
              onError: rej,
            });
          }),
          {
            loading: <span className="text-gray-400"> Publishing your blog post</span>,
            success: (blog: PutBlobResult) => {
              const slug = blog.pathname.split("/")[1].replace(".md", "");

              return (
                <div className="flex gap-3 text-neutral-100 dark:text-neutral-400">
                  <span>Post published</span>
                  <Link href={`${config.blogBaseURL}/${slug}`} target="_blank" className="text-blue-500 hover:text-blue-600 underline cursor-pointer">
                    view
                  </Link>
                </div>
              );
            },
            error: (ex: any) => <span className="text-rose-600">{ex?.message || "Unable to publish this post. Please try again !"} </span>,
          },

          utils.toastPromiseDefaultConfig
        );

      // we use this delay so as to wait for the user recent updates that occured during typing.
      // so this delay is morethan the delayed editor time by 100
      const delay = 600;

      setTimeout(sendBlog, delay);

      // toast.promise()
    } catch (ex) {
      console.error("Error HandlePublishBlog: ", ex);
    }
  };

  const handleSavedAsDraft = () => {};

  const noContentMessage = (
    <div className="flex gap-3 items-center bg-neutral-800 text-gray-100 py-2 px-5 border border-neutral-800 dark:border-neutral-700 min-w-max w-max max-w-96 rounded-md shadow-sm ">
      <p>Please review the guidelines on how to write a blog.</p>
    </div>
  );

  return (
    <div className="w-full py-5 px-4 flex gap-2 justify-end">
      <Button variant="outline" size="sm">
        Saved as Draft
      </Button>
      <Button variant="outline" className="transition-all" size="sm" disabled={isPending} onClick={() => handlePublishBlog("published")}>
        {isPending && <Loader className="animate-spin" />} <span>Publish</span>
      </Button>

      <BlogUsageModal externalStatePassed isOpen={showGuides} setIsOpen={setShowGudies} />
    </div>
  );
};

export default AppEditorActions;
