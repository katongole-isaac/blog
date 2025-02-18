/**
 * This file contains utils functions to interact with Vercel Blob storage
 */

import { type BlogType } from "@/utils/types";
import { list, ListBlobResult, put, PutBlobResult, del, head, HeadBlobResult, BlobNotFoundError } from "@vercel/blob";

interface UploadOptions {
  blogType: BlogType;
  /**Used to tell whether you're replace the entire stored blog post.  This may be set to `true` in the `PUT` method */
  replace: boolean;
  /**This is used to tell whether the draft is being modified so as not to add randomSuffix to the blog filename instead to use the filename as is */
  modified: boolean;
}

/**
 * Directory structure for the blogs uploaded to the vercel Blob
 */
const blogDirectories = {
  published: "published",
  drafts: "drafts",
};

/**
 * Uploads or updates blog posts to vercel Blob store
 * @param blogFileName Name of the filename to upload
 * @param fileContents Contents of the file
 * @param opts Options - By default `blogType` is set to `published`
 * @returns `data` or an `error` depending of the overcomes of the upload function
 */
const uploadBlogPost = async (blogFileName: string, fileContents: any, opts?: Partial<UploadOptions>) => {
  let data: PutBlobResult | null, error: null;

  const options: UploadOptions = { blogType: "published", replace: false, modified: false, ...opts };

  if (!(options.blogType.toLowerCase().trim() in blogDirectories))
    throw new Error("Cannot upload this file to unsupported path. Make sure that the directory you're trying to upload to is supported");

  const directoryPath = blogDirectories[options.blogType as keyof typeof blogDirectories];

  const filename = `${directoryPath}/${blogFileName}.md`;

  try {
    if (!options.replace) {
      const blogs = await list({ prefix: directoryPath });
      const found = blogs.blobs.find((blob) => blob.pathname === filename);

      if (found) throw new Error("A blog with this slug or URL already exists. Please choose a different one.");
    }

    data = await put(filename, fileContents, {
      access: "public",
      addRandomSuffix: options.replace && !options.modified ? true : false,
      cacheControlMaxAge: 0,
    });

    return { data, error: null };
  } catch (ex) {
    console.log("Error when uploading Blob file: ", (ex as Error).message);
    return { data: null, error: (ex as Error).message };
  }
};

/**
 * Fetches blog posts based on their types
 * @param {BlogType} blogType The types of blog posts to retrieve
 * @returns List of blog posts
 */
const getAllBlogs = async (blogType: BlogType = "published") => {
  let data: ListBlobResult, error: null;

  if (!(blogType.toLowerCase().trim() in blogDirectories))
    throw new Error("Unknown directory to lookup blogs. Please ensure that the directory type exists");

  const directoryPath = blogDirectories[blogType as keyof typeof blogDirectories];

  try {
    data = await list({ prefix: directoryPath });
    return { data, error: null };
  } catch (error) {
    console.log(`Error when getting blogs from ${directoryPath} directory`, error);
    return { data: null, error: (error as Error)?.message };
  }
};

/**
 * Gets metadata for the blog post. You can get `url` for the blog post from the response
 * @param url The `url` or `pathname` of the blog post as stored in the vercel blog store
 * @returns Metadata for the blog post
 */
const getBlogByUrl = async (url: string) => {
  let data: HeadBlobResult, error: null;

  try {
    data = await head(url);
    return { data, error: null };
  } catch (error) {
    console.error(`Error occured when getting metadata for blog post at ${url}: `, (error as Error)?.message);
    if (error instanceof BlobNotFoundError) return { data: null, error: "The blog you are looking for does not exist.", status: 404 };
    return { data: null, error: (error as Error)?.message };
  }
};

/**
 * Deletes one or more blog posts
 * @param blogUrl Blog URL can be a string or an array of string
 * @returns
 */
const deleteBlogPost = async (blogUrl: string | string[]) => {
  let error: unknown;
  try {
    del(blogUrl);
    return { error };
  } catch (error) {
    console.error(`Error occured when deleting ${blogUrl} post: `, error);
    return { error: (error as Error)?.message };
  }
};

export default {
  getBlogByUrl,
  getAllBlogs,
  deleteBlogPost,
  uploadBlogPost,
};
