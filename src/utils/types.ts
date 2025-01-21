import matter from "gray-matter";

interface BlogMetaData {
  /**A string the can be used as url for the blog post */
  slug: string;
  /** Blog title */
  title: string;
  /** A string array containing all the tags for a given blog post */
  tags: string[];
  /**Author of the blog post */
  author?: string;
  /** The date(in milliseconds) at which the blog post was created or last modified */
  date?: string;
  /** Description of the blog post */
  description?: string;
}
export interface BlogResponse {
  /** The results of parsing markdown of the blog post */
  matter: ReturnType<typeof matter> & { data: BlogMetaData };
  /** The date (in milliseconds) at which the blog post was created */
  createdAt: number;
  /** The date (in milliseconds) at which the blog post was last modified */
  lastModified: number;
  /** Checks whether the blog post was modified  */
  isModified: boolean;
  /** The filename of the blog post */
  fileName: string;
  /**A string that can act as the url for the blog post */
  _slug:string
}
