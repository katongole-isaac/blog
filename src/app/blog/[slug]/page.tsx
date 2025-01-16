"use client";

import { useQuery } from "@tanstack/react-query";

import config from "@/config/default.json";
import { BlogResponse } from "@/utils/types";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";
import { useCallback, useEffect, useState } from "react";
import BlogHeader from "@/components/blog/header";
import BlogLoading from "@/components/blog/blogLoading";

interface Props {
  params: Promise<unknown>;
}

const fetchBlogs: (blog: string) => () => Promise<BlogResponse> = (blog: string) => () =>
  fetch(config.getPost + "/" + blog).then((res) => res.json());
// const fetchBlogs: () => Promise<{ results: BlogResponse[] }> = () => fetch(config.getPosts).then((res) => res.json());

const BlogPage: React.FC<Props> = ({ params }) => {
  const { data, error, isLoading } = useQuery({ queryKey: ["blogs"], queryFn: fetchBlogs("demo") });
  const [html, setHtml] = useState("");

  const renderHtml = useCallback(async () => {
    const _html = await renderMarkdownToHtml(data?.matter.content!);
    setHtml(_html);
  }, [data]);

  useEffect(() => {
    if (!html && data) renderHtml();
  }, [html, data]);

  if (isLoading) return <BlogLoading />;

  return (
    <div className="">
      <BlogHeader blog={data!} />
      {html && processHTML(html)}
    </div>
  );
};

export default BlogPage;
