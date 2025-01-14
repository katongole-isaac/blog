import { Check, Copy } from "lucide-react";
import { Components, ExtraProps } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { ClassAttributes, ComponentProps, ElementType, HTMLAttributes, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import BlogImage from "./blogImage";
import BlogContent from "./content";
import { Button } from "../ui/button";

interface GeneralBlogFormattingProps<T extends ElementType = "div"> {
  as?: T; // The dynamic element type
  children: React.ReactNode; // The children to be rendered inside the element
}

const iconSize = 18;

const Code: React.FC<ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps> = (props) => {
  const [isCopied, setIsCopied] = useState(false);
  const { children, className, ...rest } = props;
  const match = /language-(\w+)/.exec(className || "");

  let timerId: NodeJS.Timeout;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(String(props.children as string)).then(() => setIsCopied(true));
  };

  useEffect(() => {
    if (isCopied) timerId = setTimeout(() => setIsCopied(false), 2_000);

    return () => {
      timerId && clearTimeout(timerId);
    };
  }, [isCopied]);
  
  if (!className)
    // for isline code snippets
    return (
      <code {...rest} className="bg-gray-100 rounded-sm font-extralight px-2 py-[1px]">
        {children}
      </code>
    );

  return (
    <div className=" relative rounded-md my-2">
      <div className="sticky top-0 z-30 flex justify-end pr-3">
        <div className="absolute top-3 ">
          <Button onClick={handleCopyToClipboard} size="icon" type="button" variant="outline" className={cn("p-0")}>
            {!isCopied ? <Copy size={iconSize} className="text-gray-700" /> : <Check size={iconSize} className="text-gray-700" />}
          </Button>
        </div>
      </div>
      {match && className ? (
        <div className="">
          {
            //@ts-ignore
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              wrapLines
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
              style={oneLight}
              wrapLongLines
              // If you want to hide scrollbar on the code snippet component
              // customStyle={{
              //   overflow: "auto",
              //   scrollbarWidth: "none",
              //   msOverflowStyle: "none",
              //   WebkitOverflowScrolling: "touch",
              // }}
            />
          }
        </div>
      ) : (
        <code {...rest} className={className}>
          {children}
        </code>
      )}
    </div>
  );
};

const GeneralBlogFormatting = <T extends ElementType = "div">({
  as: Ele = "div",
  children,
  ...props
}: GeneralBlogFormattingProps<T> & ComponentProps<T>) => <Ele {...props}>{children}</Ele>;

const BlockQuote: React.FC<React.BlockquoteHTMLAttributes<HTMLQuoteElement> & ExtraProps> = ({ children, ...props }) => {
  return (
    <blockquote className="my-7" {...props}>
      <div className="border-l-4 bg-gray-100 py-1 border-blue-500 pl-7 pr-2 italic text-gray-700 dark:text-gray-200">{children}</div>
    </blockquote>
  );
};

const components: Components = {
  code: (props) => <Code {...props} />,
  // img: (props) => <BlogImage {...props} />,
  p: ({ node, children, ...props }) => {
    // Check if the child is an <img>. If so, render without <p>.
    //@ts-ignore
    if (node!.children[0]?.tagName === "img") return <>{children}</>;

    return (
      <p className="my-2 leading-" {...props}>
        {children}
      </p>
    );
  },
  blockquote: (props) => <BlockQuote {...props} />,
  ul: (props) => (
    <GeneralBlogFormatting
      as="ul"
      className="list-disc mb-5 list-inside [&>li]:pl-3 [&>li]:my-2 [&_ul]:mt-3 [&_ul>li]:pl-3 [&_ul]:list-[circle]"
      {...props}
    />
  ),
  ol: (props) => (
    <GeneralBlogFormatting as="ol" className="list-decimal mb-5 [&>li]:ml-7 [&>li]:my-2 [&_ul>li]:pl-3 [&_ul]:list-[circle]" {...props} />
  ),
  h1: (props) => <GeneralBlogFormatting as="h1" className="text-4xl mt-4 mb-2 " {...props} />,
  h2: (props) => <GeneralBlogFormatting as="h2" className="text-3xl mt-4 mb-2 " {...props} />,
  h3: (props) => <GeneralBlogFormatting as="h2" className="text-2xl mt-4 mb-2 " {...props} />,
  h4: (props) => <GeneralBlogFormatting as="h4" className="text-xl mt-4 mb-2 " {...props} />,
  h5: (props) => <GeneralBlogFormatting as="h5" className="text-lg mt-4 mb-2 " {...props} />,
  h6: (props) => <GeneralBlogFormatting as="h6" className="text-lg mt-4 mb-2" {...props} />,
  hr: ({ node, className, ...props }) => <hr className={` border border-gray-100 my-12 ${className}`} {...props} />,
  table: ({ children, node, ...props }) => (
    <table className="min-w-full border-collapse border border-gray-300 text-sm" {...props}>
      {children}
    </table>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-bold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-gray-300 px-4 py-2" {...props}>
      {children}
    </td>
  ),
};

export default components;
