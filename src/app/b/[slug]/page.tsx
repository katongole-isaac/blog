"use client";

import grayMatter from "gray-matter";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import BlogHeader from "@/components/blog/header";
import { BlogError } from "@/components/common/error";
import BlogLoading from "@/components/blog/blogLoading";
import { fetchBlogContent } from "@/components/blog/blogCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBlogById, getBlogState } from "@/store/blogSlice";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";
import { ListBlobResultBlob } from "@vercel/blob";

interface Props {}

const BlogPage: React.FC<Props> = () => {
  const param: { slug: string } = useParams();

  const dispatch = useAppDispatch();
  const [html, setHtml] = useState("");
  const [blogContentURL, setBlogContentURL] = useState("");
  const [matter, setMatter] = useState<ReturnType<typeof grayMatter> | null>(null);

  const { data: blog, error, isLoading } = useAppSelector(getBlogState);

  const { refetch, data: blogContents } = useQuery({
    queryKey: ["blogs", blogContentURL],
    queryFn: ({ queryKey }) => fetchBlogContent(queryKey[1]),
    enabled: false,
  });

  const renderHtml = useCallback(async () => {
    const _html = await renderMarkdownToHtml(matter?.content!);
    setHtml(_html);
  }, [matter]);

  useEffect(() => {
    dispatch(fetchBlogById({ blogType: "published", slug: param.slug }));
  }, []);

  useEffect(() => {
    if (blog && "url" in blog) setBlogContentURL(blog.url);
  }, [blog]);

  useEffect(() => {
    if (blogContentURL) refetch();
  }, [blogContentURL]);

  useEffect(() => {
    if (!matter && blogContents) setMatter(grayMatter(blogContents));
  }, [blogContents]);

  useEffect(() => {
    if (matter) renderHtml();
  }, [matter]);

  if (error) return <BlogError error={error} />;

  return (
    <div className="">
      {isLoading && <BlogLoading />}
      {matter && <BlogHeader metadata={matter.data} uploadedAt={(blog as ListBlobResultBlob)?.uploadedAt.toString()} />}
      {html && processHTML(html)}
    </div>
  );
};

export default BlogPage;
