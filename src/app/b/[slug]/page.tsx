"use client";

import { useCallback, useEffect, useState } from "react";

import { BlogResponse } from "@/utils/types";
import { useParams } from "next/navigation";
import BlogHeader from "@/components/blog/header";
import { BlogError } from "@/components/common/error";
import BlogLoading from "@/components/blog/blogLoading";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBlogById, getBlogState } from "@/store/blogSlice";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";

interface Props {};

const BlogPage: React.FC<Props> = () => {
  const param: { slug: string } = useParams();

  const dispatch = useAppDispatch();
  const [html, setHtml] = useState("");
  const { data, error, isLoading } = useAppSelector(getBlogState);

  const renderHtml = useCallback(async () => {
    const _html = await renderMarkdownToHtml((data as BlogResponse).matter.content!);
    setHtml(_html);
  }, [data]);

  useEffect(() => {
    if (Object.keys(data).length <= 0) dispatch(fetchBlogById(param.slug.trim()));
  }, []);

  useEffect(() => {
    if (!html && Object.keys(data).length > 0) renderHtml();
  }, [html, data]);

  if (error) return <BlogError error={error} />;

  return (
    <div className="">
      {isLoading && <BlogLoading />}
      {Object.keys(data).length > 0 && <BlogHeader blog={data as BlogResponse} />}
      {html && processHTML(html)}
    </div>
  );
};

export default BlogPage;
