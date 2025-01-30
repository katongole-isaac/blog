import { BlogType } from "@/utils/types";
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

import config from "@/config/default.json";
import { QueryClient } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import dayjs from "dayjs";
import utils from "@/utils";

interface Blog<T> {
  isLoading: boolean;
  data: T | null;
  lastFetch: number;
  error: any;
}

interface InitialState {
  /**
   * Holds information for all blog posts
   */
  blogs: Blog<ListBlobResultBlob[]>;
  /**
   * Holds information concerning the single blog post
   */
  blog: Blog<ListBlobResultBlob | {}>;
}

const initialState: InitialState = {
  blogs: { data: [], error: null, isLoading: false, lastFetch: 0 },
  blog: { data: null, error: null, isLoading: false, lastFetch: 0 },
};

const slice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers(b) {
    b.addCase(fetchBlogs.pending, ({ blogs }, action) => {
      blogs.isLoading = true;
    });
    //@ts-ignore
    b.addCase(fetchBlogs.fulfilled, ({ blogs }, action: PayloadAction<{ blogs: ListBlobResultBlob[] }>) => {
      const { payload } = action;

      blogs.data = payload.blogs;
      blogs.isLoading = false;
      blogs.lastFetch = Date.now();
      blogs.error = null;
    });
    b.addCase(fetchBlogs.rejected, ({ blogs }, action) => {
      blogs.isLoading = false;
      blogs.error = (action.payload as any).error;
      blogs.lastFetch = 0;
    });

    // for single blog post
    b.addCase(fetchBlogById.pending, ({ blog }, action) => {
      blog.isLoading = true;
    });
    //@ts-ignore
    b.addCase(fetchBlogById.fulfilled, ({ blog }, action: PayloadAction<ListBlobResultBlob>) => {
      const { payload } = action;

      blog.data = payload;
      blog.isLoading = false;
      blog.lastFetch = Date.now();
      blog.error = null;
    });
    b.addCase(fetchBlogById.rejected, ({ blog }, action) => {
      blog.isLoading = false;
      blog.lastFetch = 0;
      blog.error = (action.payload as any).error;
    });
  },
});

const blogReducer = slice.reducer;
export default blogReducer;

const publishedBlogURL = `${config.getPosts}?type=published`;

const fetchAllBlogs = (url: string) =>
  utils.fetchWithTimeout(url).then(async (res) => {
    if (!res.ok) {
      if (res.status === 404) {
        const notFoundError = await res.json();
        return Promise.reject(new Error(notFoundError?.message || "The request resource doesn't exist"));
      }

      return Promise.reject(
        new Error("Unexpected something has occured while fetching blogs", { cause: { status: res.status, statusText: res.statusText } })
      );
    }

    return res.json();
  });

// commands

/**
 * Gets the blog by the given id.
 * @param blogId - Slug can be used as a blog id
 * @returns  Thunk function
 */
export const fetchBlogById = createAsyncThunk<ListBlobResultBlob, { blogType: BlogType; slug: string }>(
  "blogs/blogRequestedById",
  async ({ blogType, slug }, t) => {
    try {
      /**URL format for the blog as is stored in vercel blog store */
      const url = `${config.blogUploads}?type=${blogType}&blogUrl=${slug}`;

      const {
        blogs: { blogs, blog: oldBlog },
      } = t.getState() as RootState;

      if (oldBlog.data)
        if ((oldBlog.data as ListBlobResultBlob).pathname.split("/")[1].replace(".md", "") === slug)
          return await Promise.resolve(oldBlog.data as ListBlobResultBlob);

      if (blogs.data && blogs.data?.length > 0) {
        const blog = blogs.data.find((blog) => blog.pathname.split("/")[1].replace(".md", "") === slug);

        if (blog) return await Promise.resolve(blog);
      }

      const queryClient = new QueryClient();

      return await queryClient.fetchQuery({ queryKey: ["blog-metadata", url], queryFn: ({ queryKey }) => fetchAllBlogs(queryKey[1]) });
    } catch (ex: unknown) {
      return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
    }
  }
);

/**
 * Fetch all blog posts
 */
export const fetchBlogs = createAsyncThunk("blogs/blogsRequested", async (undefined, t) => {
  try {
    const { blogs } = t.getState() as RootState;

    const queryClient = new QueryClient();

    if (blogs.blogs.lastFetch === 0)
      return await queryClient.fetchQuery({ queryKey: ["blogs", publishedBlogURL], queryFn: ({ queryKey }) => fetchAllBlogs(queryKey[1]) });

    const diffInMinutes = dayjs().diff(dayjs(blogs.blogs.lastFetch), "minutes");

    // Use the previous fetched blogs for only 5 mins
    // Implements a simple cache mechanism
    const CacheTime = 50; // mins

    if (diffInMinutes <= CacheTime) return Promise.resolve({ blogs: blogs.blogs.data });

    return await queryClient.fetchQuery({ queryKey: ["blogs", publishedBlogURL], queryFn: ({ queryKey }) => fetchAllBlogs(queryKey[1]) });
  } catch (ex: unknown) {
    return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
  }
});

// selectors
export const getAllBlogsState = createSelector(
  (s: RootState) => s.blogs,
  (blogs) => blogs.blogs
);

export const getBlogState = createSelector(
  (s: RootState) => s,
  (s) => s.blogs.blog
);
