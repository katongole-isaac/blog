"use client";

import dynamic from "next/dynamic";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";

import MdEditor, { Plugins } from "react-markdown-editor-lite";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";


import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getEditorData, saveEditorChanges } from "@/store/editorSlice";
import BlogUsageModal from "./blogUsageModal";
import AppEditorActions from "./controls";
import { BLOG_GUIDE_MARKDOWN } from "@/utils/constants";
import matter from "gray-matter";
import BlogHeaderPreview from "@/components/blog/blogHeaderPreview";

// const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
//   ssr: false,
// });


const highlight = (str: string, lang: string) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return `<pre class="hljs"><code>${
        hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value
      }</code></pre>`;
    } catch (__) {}
  }
  return `<pre class="hljs"><code>${MarkdownIt().utils.escapeHtml(str)}</code></pre>`;
};
const mdParser = new MarkdownIt({ linkify: true, typographer: true, breaks: true, highlight });

interface IChange {
  text: string;
  html: string;
}

MdEditor.use(Plugins.FontUnderline);

const placeholder = `
---

title: My latest blog post  
slug: how-to-use-this-blog-template-site  
image: https://raw.githubusercontent.com/katongole-isaac/blogImages/master/blog-overview.png  
description: This demo shows how to write the front-matter section when using this blog site.  
tags:
  - blogging
  - programming
  - add more tags

---  

Write your content here
`;

export default function () {
  const [editorText, setEditorText] = useState(useAppSelector(getEditorData));

  const dispatch = useAppDispatch();

  let timerID: NodeJS.Timeout;

  const handleOnChange = (data: IChange, ev?: React.ChangeEvent<HTMLTextAreaElement>) => setEditorText(data.text);

  const savedEditoChangesAsDraft = useCallback(() => {
    dispatch(saveEditorChanges(editorText));
  }, [editorText]);

  useEffect(() => {
    timerID = setTimeout(savedEditoChangesAsDraft, 5_000);

    return () => {
      timerID && clearInterval(timerID);
    };
  }, [editorText]);

  const renderMd = useCallback(async (text: string) => {
    try {
      const { content, data } = matter(text);
      return (
        <>
          {Object.keys(data).length > 0 && <BlogHeaderPreview metadata={data} />}
          {processHTML(mdParser.render(content), true)}
        </>
      );
    } catch (ex) {
      return mdParser.render(text);
    }
  }, []);

  return (
    <>
      <AppEditorActions />

      <div className=""></div>
      <MdEditor
        id="editor"
        theme="dark"
        placeholder={placeholder}
        value={editorText}
        onChange={handleOnChange}
        defaultValue={BLOG_GUIDE_MARKDOWN}
        style={{ height: "500px" }}
        renderHTML={renderMd}
      />
      <BlogUsageModal />
    </>
  );
}
