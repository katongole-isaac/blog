"use client";

import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import BlogHeader from "@/components/blog/header";
import { BlogError } from "@/components/common/error";
import BlogLoading from "@/components/blog/blogLoading";
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
  }, [blog]);

  useEffect(() => {
    if (blog) renderHtml();
  }, [blog]);

  useEffect(() => {
    if (processedBlogs.length == 0 || !blog) dispatch(fetchBlogById({ blogType: "published", slug }));
  }, [blog]);

  if (error && error?.cause?.status === 404) return notFound();
  
  if (error) return <BlogError error={error} />;

  return (
    <div className="">
      {isLoading && <BlogLoading />}
      {blog && <BlogHeader metadata={blog.matter.data} uploadedAt={blog.uploadedAt as string} />}
      {html && processHTML(html)}
    </div>
  );
};

export default BlogPage;
