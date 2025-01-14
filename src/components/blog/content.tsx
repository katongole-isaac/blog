const BlogContent: React.FC<React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }> = ({ children, ...props }) => {
  return (
    <section className="px-10 md:px-14">
      <p {...props}> {children}</p>
    </section>
  );
};

export default BlogContent;
