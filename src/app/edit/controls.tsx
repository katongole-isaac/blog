import { Button } from "@/components/ui/button";
import { getEditorData } from "@/store/editorSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { BlogMetadata, BlogType } from "@/utils/types";
import matter, { GrayMatterOption } from "gray-matter";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import BlogUsageModal from "./blogUsageModal";
import slugify from "slugify";
import { useMutation, useQuery } from "@tanstack/react-query";
import config from "@/config/default.json";

interface BlogPayload {
  metadata: BlogMetadata;
  data: string;
}

const publishBlog = (payload: BlogPayload) => {
  const url = `${config.blogUploads}?filename=${payload.metadata.slug}`;
  return fetch(url, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }).then(async (res) => {
    if (!res.ok) {
      const error = await res.json(); // server error;
      throw new Error("Something wen wrong while posting blog post", {
        cause: { status: res.status, statusText: res.statusText, message: error?.message || res.statusText },
      });
    }
    return await res.json();
  });
};

const url = "https://9d3odxrej5fvz5hs.public.blob.vercel-storage.com/published/how-to-write-a-blog-AIK59WIQxLZMgD64BiX3aSGqhDTz3Z.md";
const fe = () => fetch(url).then(async (res) => await res.blob());

const AppEditorActions = () => {
  const { mutate, data, error } = useMutation({
    mutationFn: publishBlog,
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
      const sendBlog = () => mutate(payload);

      // we use this delay so as to wait for the user recent updates that occured during typing.
      // so this delay is morethan the delayed editor time by 100
      const delay = 600;

      setTimeout(sendBlog, delay);
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
      <Button variant="outline" size="sm" onClick={() => handlePublishBlog("published")}>
        Publish
      </Button>

      <BlogUsageModal externalStatePassed isOpen={showGuides} setIsOpen={setShowGudies} />
    </div>
  );
};

export default AppEditorActions;
