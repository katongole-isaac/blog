import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { ClassAttributes, HTMLAttributes, useState, useEffect } from "react";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useTheme } from "next-themes";
import { copyToClipboard } from "@/utils";

const iconSize = 18;

const Code: React.FC<ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement>> = (props) => {
  const { theme, systemTheme } = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const { children, className, ...rest } = props;
  const match = /language-(\w+)/.exec(className || "");

  const defaultLangStyles = "bash";

  let codeTheme, timerId: NodeJS.Timeout;

  if (theme === "system") codeTheme = systemTheme === "dark" ? oneDark : oneLight;
  else codeTheme = theme === "dark" ? oneDark : oneLight;

  const handleCopyToClipboard = () => {
    copyToClipboard(props.children as string, () => {
      setIsCopied(true);
    });
  };

  useEffect(() => {
    if (isCopied) timerId = setTimeout(() => setIsCopied(false), 2_000);

    return () => {
      timerId && clearTimeout(timerId);
    };
  }, [isCopied]);

  return (
    <div className=" relative rounded-md my-2 dark:border-0 border border-neutral-200 shadow-sm">
      <div className="sticky top-0 z-30 flex justify-end pr-3">
        <div className="absolute top-1 md:top-3 ">
          <Button
            onClick={handleCopyToClipboard}
            size="icon"
            type="button"
            variant="outline"
            className={cn("p-0 dark:bg-[#14171C]/50 text-gray-700  dark:text-gray-400")}
          >
            {!isCopied ? <Copy size={iconSize} /> : <Check size={iconSize} />}
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
              style={codeTheme}
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
              style={codeTheme}
              wrapLongLines
            />
          }
        </div>
      )}
    </div>
  );
};

export default Code;
