import { BlogResponse } from "@/utils/types";
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

import config from "@/config/default.json";
import { QueryClient } from "@tanstack/react-query";

interface Blog<T> {
  isLoading: boolean;
  data: T;
  lastFetch: number;
  error: any;
}

interface InitialState {
  /**
   * Holds information for all blog posts
   */
  blogs: Blog<BlogResponse[]>;
  /**
   * Holds information concerning the single blog post
   */
  blog: Blog<BlogResponse | {}>;
}

const initialState: InitialState = {
  blogs: { data: [], error: null, isLoading: false, lastFetch: 0 },
  blog: { data: {}, error: null, isLoading: false, lastFetch: 0 },
};

const slice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    blogsAdded: (blogs, payload) => {},
  },
  extraReducers(b) {
    b.addCase(fetchBlogs.pending, ({ blogs }, action) => {
      blogs.isLoading = true;
    });
    //@ts-ignore
    b.addCase(fetchBlogs.fulfilled, ({ blogs }, action: PayloadAction<{ blogs: BlogResponse[] }>) => {
      const { payload } = action;

      blogs.data = payload.blogs;
      blogs.isLoading = false;
    });
    b.addCase(fetchBlogs.rejected, ({ blogs }, action) => {
      blogs.isLoading = false;
      blogs.error = (action.payload as any).error;
    });

    // for single blog post
    b.addCase(fetchBlogById.pending, ({ blog }, action) => {
      blog.isLoading = true;
    });
    //@ts-ignore
    b.addCase(fetchBlogById.fulfilled, ({ blog }, action: PayloadAction<BlogResponse>) => {
      const { payload } = action;

      blog.data = payload;
      blog.isLoading = false;
    });
    b.addCase(fetchBlogById.rejected, ({ blog }, action) => {
      blog.isLoading = false;
      blog.error = (action.payload as any).error;
    });
  },
});

const { blogsAdded } = slice.actions;

const blogReducer = slice.reducer;
export default blogReducer;

const fetchAllBlogs = () =>
  fetch(config.getPosts).then((res) => {
    if (!res.ok)
      return Promise.reject(new Error(res.statusText ?? "Unexpected something has occured while fetching blogs", { cause: { status: res.status } }));

    return res.json();
  });

/**
 * Fetch function for a single blog post
 * @param params - The value of the `params` is passed by the `fetchQuery` method
 * @returns
 */
const fetchSingleBlogPost = async (params: any) => {
  const [_, blogId] = params["queryKey"];

  const url = `${config.getPost}/${blogId}`;

  return fetch(url).then((res) => {
    if (!res.ok)
      return Promise.reject(new Error(res.statusText ?? "Unexpected something has occured while fetching blogs", { cause: { status: res.status } }));
    return res.json();
  });
};

// commands
export const addBlogs = (payload: any) => blogsAdded(payload);

/**
 * Gets the blog by the given id.
 * @param blogId - Slug can be used as a blog id
 * @returns  Thunk function
 */
export const fetchBlogById = createAsyncThunk<BlogResponse, string>("blogs/blogRequestedById", async (blogId, t) => {
  try {
    const { blogs: oldBlogs } = t.getState() as RootState;

    // Fetch only if the blogs are not there
    if (oldBlogs.blogs.data.length <= 0) await t.dispatch(fetchBlogs());

    // here we have the latest update
    const { blogs } = t.getState() as RootState;

    const blog = blogs.blogs.data.find((blog) => blog._slug === blogId);

    if (blog) return await Promise.resolve(blog);

    const error = new Error(" Oops! We couldn't find the blog post you're looking for. It might not exist or has been moved. Please check the URL and try again.");
    error.cause = { status: 404 };

    throw error;
    
  } catch (ex: unknown) {
    return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
  }
});

/**
 * Fetch all blog posts
 */
export const fetchBlogs = createAsyncThunk("blogs/blogsRequested", async (undefined, t) => {
  try {
    const { blogs } = t.getState() as RootState;

    if (blogs.blogs.data.length > 0) return Promise.resolve({ blogs });

    const queryClient = new QueryClient();

    return await queryClient.fetchQuery({ queryKey: ["blogs"], queryFn: fetchAllBlogs });
  } catch (ex: unknown) {
    return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
  }
});

// selectors
export const getAllBlogsState = createSelector(
  (s: RootState) => s,
  (s) => s.blogs.blogs
);

export const getBlogState = createSelector(
  (s: RootState) => s,
  (s) => s.blogs.blog
);
