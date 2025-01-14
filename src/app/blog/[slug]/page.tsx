"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogContent from "@/components/blog/content";
import components from "@/components/blog/markdownRenderer";
import { useQuery } from "@tanstack/react-query";

import config from "@/config/default.json";
import { BlogResponse } from "@/utils/types";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";
import { useCallback, useEffect, useState } from "react";

interface Props {
  params: Promise<unknown>;
}

const remarkPlugins = [remarkGfm];

const fetchBlogs: () => Promise<{ results: BlogResponse[] }> = () => fetch(config.getPosts).then((res) => res.json());

const BlogPage: React.FC<Props> = ({ params }) => {
  const { data, error, isLoading } = useQuery({ queryKey: ["blogs"], queryFn: fetchBlogs });
  const [html, setHtml] = useState("");

  const renderHtml = useCallback(async () => {
    const _html = await renderMarkdownToHtml(data?.results[0].matter.content!);
    setHtml(_html);
  }, [data]);

  useEffect(() => {
    if (!html && data) renderHtml();
  }, [html, data]);

  if (isLoading) return <>Loading...</>;

  // renderMarkdownToHtml(data);
  return (
    <div className="">{html && processHTML(html)}</div>
    // <Markdown components={components} remarkPlugins={remarkPlugins}>
    //   {data?.results[0].matter.content}
    // </Markdown>
  );
};

export default BlogPage;
