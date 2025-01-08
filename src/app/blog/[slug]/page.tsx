import matter from "gray-matter";
import Markdown from "react-markdown";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";
import remarkGfm from "remark-gfm";
import BlogContent from "@/components/blog/content";
import components from "@/components/blog/markdown";

interface Props {
  params: Promise<unknown>;
}

const remarkPlugins = [remarkGfm];

const BlogPage: React.FC<Props> = async ({ params }) => {
  const blogs = getAllBlogPosts();
  const fileContents = getBlogPostBySlug(blogs[0]);

  const { content, data } = matter(fileContents);
  console.log(data, content);

  return (
    <Markdown components={components} remarkPlugins={remarkPlugins}>
      {content}
    </Markdown>
  );
};

export default BlogPage;
