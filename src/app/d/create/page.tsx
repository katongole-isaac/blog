//@refresh

"use client";

import Link from "next/link";
import hljs from "highlight.js";
import matter from "gray-matter";
import dynamic from "next/dynamic";
import MarkdownIt from "markdown-it";
import { ChevronLeft } from "lucide-react";
import toast, { Toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import "highlight.js/styles/atom-one-light.css";
import "react-markdown-editor-lite/lib/index.css";

import {
  clearActiveDraftError,
  createDraft,
  deleteDrafts,
  fetchDraftBlogs,
  getActiveDraftState,
  getDraftBlogState,
  resetActiveDraft,
  saveActiveDraft,
  updateDraft,
} from "@/store/blogSlice";
import AppEditorActions from "./controls";
import BlogUsageModal from "./blogUsageModal";
import ErrorToast from "../components/errorToast";
import ReactQueryProvider from "@/lib/reactQuery";
import { fetchBlogContent } from "@/components/blog/blogCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DraftContentLoader from "../components/draftContentLoader";
import BlogHeaderPreview from "@/components/blog/blogHeaderPreview";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";
import { deleteDraftEntry, getEditState, saveDraftChanges } from "@/store/editorSlice";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

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

interface IChange {
  text: string;
  html: string;
}

const placeholder = `
---

title: My latest blog post  
slug: how-to-use-this-blog-template-site  
image: https://raw.githubusercontent.com/katongole-isaac/blogImages/master/blog-overview.png  
description: This demo shows how to write the front-matter section when using this blog site.  
tags:
  - blogging
  - programming
  - add more tags

---  

Write your content here
`;

export default function CreateBlogPage() {
  const searchParams = useSearchParams();

  const draftFilename = searchParams.get("draft");

  const editings = useAppSelector(getEditState);

  const { data: drafts } = useAppSelector(getDraftBlogState);

  const draftFound = draftFilename ? editings[draftFilename] : null;

  const [fetchedDraftContents, setFetchedDraftContents] = useState(false);

  const { data: activeDraft, error } = useAppSelector(getActiveDraftState);

  const [editorText, setEditorText] = useState(activeDraft?.pathname === draftFilename ? draftFound?.data! : "");

  const {
    isFetching,
    data: draftContents,
    isLoading: loadingDraftContents,
    error: draftContentError,
    refetch,
  } = useQuery({
    queryKey: ["fetch-draft-contents", activeDraft?.url!],
    queryFn: ({ queryKey }) => fetchBlogContent(queryKey[1]),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  const dispatch = useAppDispatch();

  let updateTimerID: NodeJS.Timeout;
  let timerID: NodeJS.Timeout;

  const handlePublishBlog = useCallback(() => {
    setEditorText("");
    if (activeDraft) {
      dispatch(resetActiveDraft());
      dispatch(deleteDraftEntry(activeDraft.filename));
      dispatch(deleteDrafts([activeDraft.url]));
      setFetchedDraftContents(false);
    }
  }, [activeDraft]);

  const handleOnChange = (data: IChange, ev?: React.ChangeEvent<HTMLTextAreaElement>) => setEditorText(data.text);

  useEffect(() => {
    // saving the changes to vercel drafts
    updateTimerID = setTimeout(() => {
      if (activeDraft?.filename && editorText.trim()) {
        dispatch(updateDraft({ data: editorText, filename: activeDraft.filename }));
        dispatch(saveDraftChanges(activeDraft.filename, editorText));
      }
    }, 1_000);

    return () => {
      updateTimerID && clearInterval(updateTimerID);
    };
  }, [editorText, activeDraft]);

  useEffect(() => {
    if (error || draftContentError)
      toast.custom((t: Toast) => <ErrorToast t={t} message={error?.message || draftContentError} />, { id: "fetch-content-error" });
  }, [error, draftContentError]);

  useEffect(() => {
    if (drafts && drafts.length === 0 && activeDraft?.filename) dispatch(fetchDraftBlogs());

    dispatch(clearActiveDraftError());
  }, []);

  useEffect(() => {
    if (drafts && drafts.length > 0) {
      const found = drafts.find((d) => d.filename === draftFilename);

      if (found && !activeDraft?.filename) {
        const { downloadUrl, filename, pathname, url } = found;
        dispatch(saveActiveDraft({ data: { downloadUrl, filename, pathname, url } }));
      }
    }
  }, [drafts, draftFound, activeDraft, draftFilename]);

  useEffect(() => {
    if (activeDraft?.url && !fetchedDraftContents) refetch();

    if (draftContents) {
      setEditorText(draftContents);
      setFetchedDraftContents(true);
    }
  }, [draftContents]);

  useEffect(() => {
    timerID = setTimeout(() => {
      if (!activeDraft?.filename && editorText.trim()) dispatch(createDraft());
    }, 2_000);

    return () => {
      timerID && clearTimeout(timerID);
    };
  }, [activeDraft, editorText]);

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
      setFetchedDraftContents(false);
      if (activeDraft) dispatch(deleteDraftEntry(activeDraft.filename));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  return (
    <ReactQueryProvider>
      <DraftContentLoader open={loadingDraftContents || isFetching} />
      {/* <DraftContentLoader open={loading} /> */}
      <div className="mt-1 relative">
        <Link href="/d" className=" w-max flex items-center gap-0 top-[2px] relative  text-base">
          <ChevronLeft size={25} />
          <span className="text-blue-600- hover:underline ">Back </span>
        </Link>
      </div>
      <AppEditorActions onPublish={handlePublishBlog} draftFilename={activeDraft?.filename!} />

      <div data-color-mode="" className="mb-12 h-[calc(100vh-18vh)] dark:bg-neutral-800">
        <MdEditor
          id="editor"
          placeholder={placeholder}
          value={editorText}
          onChange={handleOnChange}
          className="h-full"
          // markdownClass="dark:!bg-neutral-800 dark:!text-white"

          renderHTML={renderMd}
        />
      </div>
      <BlogUsageModal />
    </ReactQueryProvider>
  );
}
