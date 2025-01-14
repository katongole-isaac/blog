"use client";

import { useQuery } from "@tanstack/react-query";

import config from "@/config/default.json";
import { BlogResponse } from "@/utils/types";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";
import { useCallback, useEffect, useState } from "react";

interface Props {
  params: Promise<unknown>;
}

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

  return <div className="">{html && processHTML(html)}</div>;
};

export default BlogPage;
