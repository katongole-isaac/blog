import { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const components: Components = {
  code(props) {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      //@ts-ignore
      <SyntaxHighlighter {...rest} PreTag="div" wrapLines children={String(children).replace(/\n$/, "")} language={match[1]} style={oneLight} />
    ) : (
      <code {...rest} className={className}>
        {children}
      </code>
    );
  },
};

export default components;
