import { marked, Renderer } from "marked";
import DOMPurify from "dompurify";
import parse, { DOMNode, domToReact } from "html-react-parser";
import Code from "./blogCode";
import Link from "next/link";
import BlogImage from "./blogImage";

marked.use({
  async: false,
  breaks: false,
  extensions: null,
  gfm: true,
  hooks: null,
  pedantic: false,
  silent: false,
  tokenizer: null,
  walkTokens: null,
});

const renderer = new Renderer();

/**
 * Transform html to React Elements
 */

const replace = (domNode: DOMNode) => {
  if (domNode.type === "tag") {
    if (domNode.name === "code") {
      // Extract the class attribute
      const { class: className } = domNode.attribs || {};

      if (domNode.attribs["data-type"] === "inline")
        // for inline codepsan
        //@ts-ignore
        return <code className="rounded-sm px-1 py-[1px] bg-gray-200/50 font-semibold text-neutral-600"> {domToReact(domNode.childNodes)} </code>;

      //@ts-ignore
      return <Code className={className}>{domToReact(domNode.children)}</Code>;
    }

    if (domNode.name === "table")
      //@ts-ignore
      return <table className="min-w-full border-collapse border border-gray-300 text-sm">{domToReact(domNode.children, { replace })}</table>;

    if (domNode.name === "th")
      //@ts-ignore
      return <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-bold">{domToReact(domNode.children, { replace })}</th>;

    if (domNode.name === "td")
      //@ts-ignore
      return <td className="border border-gray-300 px-4 py-2">{domToReact(domNode.children, { replace })}</td>;

    if (domNode.name === "img") {
      const { src, alt } = domNode.attribs;

      return <BlogImage src={src} alt={alt} />;
    }

    if (domNode.name === "a") {
      const { href } = domNode.attribs || {};
      return (
        <Link href={href} className="hover:text-blue-500 hover:underline text-blue-400">
          {
            //@ts-ignore
            domToReact(domNode.children)
          }
        </Link>
      );
    }
  }
};
export const processHTML = (html: string) => parse(html, { replace });

renderer.heading = ({ depth, text, type }) => {
  const formatting = {
    1: "text-2xl md:text-4xl",
    2: "text-2xl md:text-3xl",
    3: "text-xl  md:text-2xl",
    4: "text-lg  md:text-xl",
    5: "text-lg  md:text-xl",
    6: "text-lg  md:text-xl",
  };

  return `<h${depth}  class="${formatting[depth as keyof typeof formatting]} mt-4 mb-2 " >${text} </h${depth}>`;
};

renderer.list = function (this, tokens) {
  const tag = tokens.ordered ? "ol" : "ul";
  const classes = {
    ol: "list-decimal",
    ul: "list-disc ",
  };
  const list_str = tokens.items.map((t) => `<li class=""> ${this.parser.parse(t.tokens).replace(/<\/li>,<li>/g, "<li></li>")}</li>`);
  return `<${tag} class="${classes[tag]} space-y-3 pl-3 [&_ul]:list-[circle] [&_p]:p-0 [&_p]:m-0 mt-3 mb-5 " start=${tokens.start} > ${list_str
    .map((list) => list)
    .join(" ")}  </${tag}>`;
};

renderer.blockquote = function (this, token) {
  return `<blockquote class="my-5">
      <div class="border-l-4 bg-gray-100 py-1 border-blue-500 pl-7 pr-2 italic text-gray-700 dark:text-gray-200">${this.parser.parse(
        token.tokens
      )}</div>
    </blockquote>`;
};

renderer.listitem = function (this, token) {
  return `<li> ${this.parser.parse(token.tokens)} </li>`;
};

renderer.codespan = function (this, token) {
  return `<code  data-type="inline" > ${token.text} </code>`;
};

renderer.paragraph = function (this, token) {
  return `<p class="mb-4 leading-6"> ${this.parser.parseInline(token.tokens)} </p>`;
};
renderer.hr = (token) => `<${token.type} class="my-12 border border-gray-200" />`;
renderer.strong = ({ text, type }) => `<${type} class="font-semibold"> ${text} </${type}>`;

marked.use({ renderer });

const renderMarkdownToHtml = async (md: string) => {
  const html = await marked.parse(md);
  return DOMPurify.sanitize(html);
};

export default renderMarkdownToHtml;
