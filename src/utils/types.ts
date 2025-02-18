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

  description: string;
  /**Featured Image for the blog post */
  image: string;
}
export interface ProcessedBlog {
  /** The results of parsing markdown of the blog post */
  matter: ReturnType<typeof matter> & { data: BlogMetaData };
  /** The date (in milliseconds) at which the blog post was created */
  uploadedAt: number | string;
  /** The date (in milliseconds) at which the blog post was last modified */
  // lastModified: number;
  /** Checks whether the blog post was modified  */
  // isModified: boolean;
  /** The pathname of the blog post */
  pathname: string;
  /**This is used in redux only for caching mechanism */
  _lastUpdated: number;
}

/**
 * This is used for blog metadata
 */

export type BlogMetadata = Pick<BlogMetaData, "title" | "description" | "tags" | "image" | "slug"> & { lastModified?: number; createdAt?: number };

/**
 * Types of blog post to be posted.
 *
 * `draft` - Means saving the blog psot as draft .
 *
 * `published` -Blog post is ready and is live
 *
 */
export type BlogType = "draft" | "published" | "drafts";
