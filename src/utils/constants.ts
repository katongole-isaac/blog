const DEFAULT_IMAGE = "/images/default.png";
/**Default category for uncategorized blogs */
const DEFAULT_CATEGORY = "Uncategory";

const SITE_NAME = "Isaac Codes";
const SITE_CREATOR = "Katongole Isaac";

/**Key used in storing when the visibility change was last updated */
const visibilityKey = "visibilityLastUpdate";

const BLOG_GUIDE_MARKDOWN = `

> Every blog post **must** have a [front-matter](https://www.google.com/search?client=ubuntu&channel=fs&q=front-matter) section as shown above.
>
> * \`---\`: The first three dashes indicate the start of front-matter section and **must** be the first to appear at the start of the document.
> * **title**: This is the title of the blog post (**required**).
> * **slug**: This is the url for this blog post. It will be formatted in this form "how-to-use-markdown-file" and the final url for this blog will be https://domain.com/b/how-to-use-markdown-file (**required**).
> * **image**: A url of the image to serve as a featured image for your blog (**required**).
> * **description**: A brief introduction describing what the blog is all about (**required**).
> * **tags**: These are used in filtering and organizing blog posts by tags (**required**). Tags must follow the [YAML](https://yaml.org/) syntax.
> * **author**: A link to your socials. For example [Isaac](https://github.com/katongole-isaac, "Github") (**optional**).
>
> * \`---\`: The last three dashes indicate the end of front-matter section and **must** have space up and down.
>
>
> Example usage:
> \`\`\`md
> ---
>
> title: My latest blog post  
> slug: how-to-use-this-blog-template-site  
> image: https://raw.githubusercontent.com/katongole-isaac/blogImages/master/blog-overview.png  
> description: This demo shows how to write the front-matter section when using this blog site.  
> tags:
>   - blogging
>   - programming
>   - add more tags
>
> ---  
>
> Write your content here
> \`\`\`
`;

export default {
  DEFAULT_CATEGORY,
  DEFAULT_IMAGE,
  SITE_NAME,
  SITE_CREATOR,
  visibilityKey,
  BLOG_GUIDE_MARKDOWN
};