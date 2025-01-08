import fs from "node:fs";
import path from "node:path";

const postDirectory = path.join(process.cwd(), "blogs");
const getAllBlogPosts = () => {
  const fileNames = fs.readdirSync(postDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
};

const getBlogPostBySlug = (slug: string) => {
  const filePath = path.join(postDirectory, `${slug}.md`);
  return fs.readFileSync(filePath, "utf-8");
};

export { getAllBlogPosts, getBlogPostBySlug };
