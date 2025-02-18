"use client";
import Link from "next/link";
import hljs from "highlight.js";
import matter from "gray-matter";
import dynamic from "next/dynamic";
import MarkdownIt from "markdown-it";
import toast, { Toast } from "react-hot-toast";
import { PutBlobResult } from "@vercel/blob";
import { Loader, ChevronLeft } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import "react-markdown-editor-lite/lib/index.css";
import "highlight.js/styles/atom-one-light.css";

import utils from "@/utils";
import config from "@/config/default.json";
import { Button } from "@/components/ui/button";
import ErrorToast from "../components/errorToast";
import { useSearchParams } from "next/navigation";
import BlogUsageModal from "../create/blogUsageModal";
import NoFoundEditAlert from "./components/noFoundAlert";
import EditConfirmAlert from "./components/editConfirmAlert";
import { fetchBlogContent } from "@/components/blog/blogCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import BlogHeaderPreview from "@/components/blog/blogHeaderPreview";
import DraftContentLoader from "../components/draftContentLoader";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";
import { deleteEditEntry, getEditState, saveEditChanges } from "@/store/editorSlice";
import { getAllBlogsState, fetchBlogs, processBlogAfterAnUpdate } from "@/store/blogSlice";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), { ssr: false });

interface IChange {
  text: string;
  html: string;
}

const highlight = (str: string, lang: string) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return `<pre class="hljs"><code>${
        hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value
      }</code></pre>`;
    } catch (__) {}
  }
  return `<pre class="hljs"><code>${MarkdownIt().utils.escapeHtml(str)}</code></pre>`;
};

const mdParser = new MarkdownIt({ linkify: true, typographer: true, breaks: true, highlight });

const publishEditings = async (payload: any) => {
  const { filename, ..._payload } = payload;

  const url = `${config.blogUploads}?filename=${filename}&replace=true`;

  return utils
    .fetchWithTimeout(url, {
      method: "PUT",
      body: JSON.stringify(_payload),
      headers: { "Content-Type": "application/json" },
      timeout: 2 * 60 * 1_000,
    })
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json(); // server error;
        throw new Error(error?.message || "Something went wrong while saving changes", {
          cause: { status: res.status, statusText: res.statusText, message: error?.message || res.statusText },
        });
      }
      return await res.json();
    });
};

const noContentMessage = (
  <div className="flex gap-3 items-center bg-neutral-800 text-gray-100 py-2 px-5 border border-neutral-800 dark:border-neutral-700 min-w-max w-max max-w-96 rounded-md shadow-sm ">
    <p>Please review the guidelines on how to write a blog.</p>
  </div>
);

const EditBlogPost = () => {
  const [showGuides, setShowGudies] = useState(false);
  const [editConfirm, setEditConfirm] = useState(false);
  const [postNotFound, setPostNotFound] = useState(false);
  const [editPayload, setEditPayload] = useState<{ [x: string]: any } | null>(null);

  const dispatch = useAppDispatch();
  const { data: blogs, error } = useAppSelector(getAllBlogsState);

  const editings = useAppSelector(getEditState);

  const searchParams = useSearchParams();

  const slug = searchParams.get("blogId")?.trim() + ".md" || "";

  const foundBlog = blogs?.find((blog) => blog.pathname === searchParams.get("blogId")?.trim() + ".md");

  const [editorText, setEditorText] = useState(editings[slug]?.data || "");

  const {
    data: fileContents,
    isLoading: loadingFileContents,
    error: fileContentsError,
  } = useQuery({
    queryKey: ["fetch-published-contents", foundBlog?.url!],
    queryFn: ({ queryKey }) => fetchBlogContent(queryKey[1]),
    enabled: !!foundBlog,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationKey: ["push-editings", slug],
    mutationFn: publishEditings,
    async onSuccess(data, variables, context) {
      dispatch(deleteEditEntry(foundBlog!.url));
      dispatch(processBlogAfterAnUpdate(editPayload));
    },
  });

  let timerID: NodeJS.Timeout;

  const handlePublishEditings = useCallback(() => {
    // send to the backend
    const sendBlog = async () => {
      try {
        toast.promise(
          mutateAsync(editPayload),
          {
            loading: <span className="text-gray-400"> Publishing changes</span>,

            success: (blog: PutBlobResult) => {
              const slug = blog.pathname.split("/")[1].replace(".md", "");

              return (
                <div className="flex gap-3 text-neutral-100 dark:text-neutral-400">
                  <span>Post changes saved</span>
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
  }, [editPayload]);

  const handleValidateEdtings = useCallback(() => {
    try {
      const { data, content } = matter(editorText);

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

      const filename = foundBlog!.pathname.split("/")[1].replace(".md", "");

      const payload = {
        metadata: { title, slug: filename, description, image, tags },
        data: editorText,
        lastModified: Date.now(),
        createdAt: Date.now(),
        filename,
      };

      setEditConfirm(true);
      setEditPayload(payload);
    } catch (ex) {
      console.error("Error : ", ex);
    }
  }, [editorText, foundBlog]);

  useEffect(() => {
    if (!foundBlog && blogs && blogs.length > 0) setPostNotFound(true);

    return () => {
      setPostNotFound(false);
    };
  }, [foundBlog, blogs]);

  useEffect(() => {
    if (fileContents) setEditorText(fileContents);
  }, [fileContents]);

  useEffect(() => {
    if (blogs!.length === 0) dispatch(fetchBlogs());
  }, [blogs]);

  const handleOnChange = (data: IChange, ev?: React.ChangeEvent<HTMLTextAreaElement>) => setEditorText(data.text);

  const savedEditorChangesAsDraft = useCallback(() => {
    if (foundBlog) dispatch(saveEditChanges(foundBlog.url!, editorText));
  }, [editorText, foundBlog]);

  useEffect(() => {
    timerID = setTimeout(savedEditorChangesAsDraft, 500);

    return () => {
      timerID && clearInterval(timerID);
    };
  }, [editorText]);

  useEffect(() => {
    // error encountered when fetching blogs on this page
    if (error?.message || fileContentsError)
      toast.custom((t: Toast) => <ErrorToast t={t} message={error?.message || fileContentsError?.message} />, { id: "fetch-content-error-toast" });
  }, [error]);

  const renderMd = useCallback(async (text: string) => {
    try {
      const { content, data } = matter(text);
      return (
        <>
          {Object.keys(data).length > 0 && <BlogHeaderPreview metadata={data} />}
          {processHTML(await renderMarkdownToHtml(content), true)}
        </>
      );
    } catch (ex) {
      return mdParser.render(text);
      // return processHTML(await renderMarkdownToHtml(text), true);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <DraftContentLoader open={loadingFileContents} />
      <NoFoundEditAlert open={postNotFound} onClose={() => setPostNotFound(false)} />
      <EditConfirmAlert onContinue={handlePublishEditings} open={editConfirm} onClose={() => setEditConfirm(false)} />
      <div className="max-w-screen-xl  m-auto min-h-[calc(100vh-90px)]">
        <div className="flex flex-col gap-4  min-h-[inherit]  ">
          <div className="mt-1 relative">
            <Link href="/d" className=" w-max flex items-center gap-0 top-[2px] relative  text-base">
              <ChevronLeft size={25} />
              <span className="text-blue-600- hover:underline ">Back </span>
            </Link>
          </div>

          <div className=" pl-3 flex justify-between items-center">
            <div className="flex gap-2 ">
              <div className="flex gap-2 items-center">
                <h1 className="  ">You're editing: </h1>
                {foundBlog && (
                  <Link
                    target="_blank"
                    href={`${config.blogBaseURL}/${foundBlog.pathname.split("/")[1].replace(".md", "")}`}
                    className="text-blue-600 top-[2px] relative hover:underline text-base"
                  >
                    {foundBlog.pathname.split("/")[1].replace(".md", "")}{" "}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="transition-all" size="sm" disabled={isPending} onClick={handleValidateEdtings}>
                {isPending && !isError && !isSuccess && <Loader className="animate-spin" />} <span>Publish changes</span>
              </Button>
            </div>
          </div>

          <div className="pl-3">
            <p>
              <strong>NOTE:</strong>
              <span> It may take up to 5 minutes for changes to appear on the blog due to Vercel Blob caching.</span>{" "}
              <Link href="https://vercel.com/docs/storage/vercel-blob#caching" className="text-blue-600 hover:underline" target="_blank">
                Learn more
              </Link>
            </p>
          </div>

          <div className=" h-[calc(100vh-17vh)] mb-12 ">
            <MdEditor
              id="editor"
              placeholder={""}
              value={editorText}
              onChange={handleOnChange}
              className="h-full"
              // markdownClass="dark:!bg-neutral-800 dark:!text-white"

              renderHTML={renderMd}
            />
          </div>
        </div>
      </div>
      <BlogUsageModal externalStatePassed isOpen={showGuides} setIsOpen={setShowGudies} />
    </>
  );
};

export default EditBlogPost;
