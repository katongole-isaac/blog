import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { ClassAttributes, HTMLAttributes, useState, useEffect } from "react";
import { ExtraProps } from "react-markdown";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const iconSize = 18;

const Code: React.FC<ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps> = (props) => {
  const [isCopied, setIsCopied] = useState(false);
  const { children, className, ...rest } = props;
  const match = /language-(\w+)/.exec(className || "");

  const defaultLangStyles = "bash";

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
            />
          }
        </div>
      ) : (
        <div className="mb-3">
          {
            //@ts-ignore
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              wrapLines
              children={String(children).replace(/\n$/, "")}
              language={defaultLangStyles}
              style={oneLight}
              wrapLongLines
            />
          }
        </div>
      )}
    </div>
  );
};

export default Code;
