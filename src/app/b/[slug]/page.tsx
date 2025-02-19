"use client";

import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

import BlogHeader from "@/components/blog/header";
import NextBlogButton from "./components/blogNav";
import { BlogError } from "@/components/common/error";
import BlogLoading from "@/components/blog/blogLoading";
import ProgressBar from "@/components/common/progressBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBlogById, getBlogState, getProcessedBlogs } from "@/store/blogSlice";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";

const BlogPage = () => {
  const { slug }: { slug: string } = useParams();

  const dispatch = useAppDispatch();
  const [html, setHtml] = useState("");

  const { error, isLoading } = useAppSelector(getBlogState);

  const processedBlogs = useAppSelector(getProcessedBlogs);

  const blog = processedBlogs.find((p) => p.pathname.split("/")[1]?.replace(".md", "") === slug);

  const renderHtml = useCallback(async () => {
    const _html = await renderMarkdownToHtml(blog?.matter?.content!);
    setHtml(_html);
  }, [blog, processedBlogs]);

  useEffect(() => {
    if (blog) renderHtml();
  }, [blog]);

  useEffect(() => {
    // do some refresh in case the blog post is modified
    dispatch(fetchBlogById({ blogType: "published", slug }));
  }, []);

  if (error && error?.cause?.status === 404) return notFound();

  if (error) return <BlogError error={error} />;

  const googleTagID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  return (
    <div className="">
      {googleTagID && <GoogleTagManager gtmId={googleTagID} />}
      {isLoading && blog && <ProgressBar />}
      {isLoading && !blog && <BlogLoading />}
      {blog && <BlogHeader metadata={blog.matter.data} uploadedAt={blog.uploadedAt as string} />}
      {html && processHTML(html)}
      <NextBlogButton slug={slug} />
    </div>
  );
};

export default BlogPage;
