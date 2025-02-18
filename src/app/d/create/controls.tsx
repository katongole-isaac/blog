import dayjs from "dayjs";
import slugify from "slugify";
import Link from "next/link";
import { useState } from "react";
import matter from "gray-matter";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { PutBlobResult } from "@vercel/blob";
import { useMutation } from "@tanstack/react-query";

import utils from "@/utils";
import constants from "@/utils/constants";
import config from "@/config/default.json";
import BlogUsageModal from "./blogUsageModal";
import { Button } from "@/components/ui/button";
import { getEditState } from "@/store/editorSlice";
import type { BlogMetadata, BlogType } from "@/utils/types";
import { addBlog, resetActiveDraft } from "@/store/blogSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface BlogPayload {
  metadata: BlogMetadata;
  data: string;
}

const publishBlog = async (payload: BlogPayload) => {
  const url = `${config.blogUploads}?filename=${payload.metadata.slug}`;
  return utils
    .fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      timeout: 2 * 60 * 1_000,
    })
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json(); // server error;
        throw new Error(error?.message || "Something went wrong while posting blog post", {
          cause: { status: res.status, statusText: res.statusText, message: error?.message || res.statusText },
        });
      }
      return await res.json();
    });
};

interface Props {
  onPublish: () => void;
  draftFilename: string;
}

const AppEditorActions: React.FC<Props> = ({ onPublish, draftFilename }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["upload-post"],
    mutationFn: publishBlog,
    onMutate: (v) => {},
    onSuccess: (data: PutBlobResult, v) => {
      const uploadedAt = new Date();
      dispatch(addBlog({ downloadUrl: data.downloadUrl, pathname: data.pathname, uploadedAt: uploadedAt.toISOString(), size: 0, url: data.url }));

      const visibilityKey = constants.visibilityKey;
      // we add random time just to invalidate the store visiblity last updated time
      // so as when we navigate back to the dashboard, we can refetch the latest updates (posted blogs)
      localStorage.setItem(visibilityKey, dayjs().add(10, "hour").toISOString());

      // clear editor
      dispatch(resetActiveDraft());

      onPublish();
    },
  });

  const [showGuides, setShowGudies] = useState(false);

  const editings = useAppSelector(getEditState);
  const dispatch = useAppDispatch();

  const draft = editings[draftFilename];

  const handlePublishBlog = (blogType: BlogType) => {
    try {
      const { data, content } = matter(draft?.data || "");

      const title = data?.title?.trim() || "";
      const description = data?.description?.trim() || "";
      const slug = data?.slug?.trim() || "";
      const image = data?.image?.trim() || "";
      const tags = data?.tags ? (Array.isArray(data?.tags) ? data?.tags : [data?.tags]) : [];

      // if the blog doesn't meet the guidelines
      // show the guidelines
      if (!(title && slug && image && tags.length > 0) || !content.trim()) {
        setTimeout(() => {
          toast.custom(noContentMessage, { id: "blog-guidlines-publish" });
        }, 1_000);

        setShowGudies(true);

        return;
      }

      const filename = slugify(slug, { lower: true, strict: true });

      const payload = {
        metadata: { title, slug: filename, description, image, tags },
        data: draft.data,
        lastModified: Date.now(),
        createdAt: Date.now(),
      };

      // send to the backend
      const sendBlog = async () => {
        try {
          toast.promise(
            mutateAsync(payload),
            {
              loading: <span className="text-gray-400"> Publishing your blog post</span>,

              success: (blog: PutBlobResult) => {
                const slug = blog.pathname.split("/")[1].replace(".md", "");

                return (
                  <div className="flex gap-3 text-neutral-100 dark:text-neutral-400">
                    <span>Post published</span>
                    <Link
                      href={`${config.blogBaseURL}/${slug}`}
                      onClick={() => toast.dismiss("promise")}
                      target="_blank"
                      className="text-blue-500 hover:text-blue-600 underline cursor-pointer"
                    >
                      view
                    </Link>
                  </div>
                );
              },
              error: (ex: any) => <span className="text-rose-600">{ex?.message || "Unable to publish this post. Please try again !"} </span>,
            },

            utils.toastPromiseDefaultConfig
          );
        } catch (ex: any) {
          console.error(ex?.message);
        }
      };

      // we use this delay so as to wait for the user recent updates that occured during typing.
      // so this delay is morethan the delayed editor time by 100
      const delay = 600;

      setTimeout(sendBlog, delay);
    } catch (ex) {
      console.error("Error HandlePublishBlog: ", ex);
    }
  };

  const noContentMessage = (
    <div className="flex gap-3 items-center bg-neutral-800 text-gray-100 py-2 px-5 border border-neutral-800 dark:border-neutral-700 min-w-max w-max max-w-96 rounded-md shadow-sm ">
      <p>Please review the guidelines on how to write a blog.</p>
    </div>
  );

  return (
    <div className="w-full py-5 px-4 flex gap-2 justify-between items-center">
      <h1 className="text-2xl font-semibold">New Blog Post</h1>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" className="transition-all" size="sm" disabled={isPending} onClick={() => handlePublishBlog("published")}>
          {isPending && <Loader className="animate-spin" />} <span>Publish</span>
        </Button>
      </div>
      <BlogUsageModal externalStatePassed isOpen={showGuides} setIsOpen={setShowGudies} />
    </div>
  );
};

export default AppEditorActions;
