import matter from "gray-matter";
import fs from 'node:fs/promises';
import path from 'node:path';

const file = `---
title: Hello
slug: home
Socials:
    x: u
    facebook: 0

Hobbies:
    - swimming
    - Football
---
<h1>Hello world!</h1>
`;

// const readBlog = async () => {
//   const filePath = path.join(__dirname, "../blogs", "demo.md");
//   const res =  await fs.readFile(filePath);
//   console.log("Markdown: ", res);
// }
export default function Test() {
  // readBlog();
  const res = matter(file);
  console.log(res);
  return <></>;
}
