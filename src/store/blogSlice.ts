import dayjs from "dayjs";
import grayMatter from "gray-matter";
import { QueryClient } from "@tanstack/react-query";
import { ListBlobResultBlob, PutBlobResult } from "@vercel/blob";
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";
import utils from "@/utils";
import config from "@/config/default.json";
import { BlogType, ProcessedBlog } from "@/utils/types";

interface Blog<T> {
  isLoading: boolean;
  data: T | null;
  lastFetch: number;
  error: { message: string; status: number } | any;
}

type CreateDraftArgs = { filename: string; data: string };

interface ExtendedListBlobResultBlob extends Omit<ListBlobResultBlob, "lastFetch"> {
  filename: string;
}
interface BlogDraft extends Omit<Blog<ExtendedListBlobResultBlob[]>, "lastFetch"> {}
interface ActiveDraft extends Omit<Blog<Omit<PutBlobResult, "contentDisposition" | "contentType" | "size"> & { filename: string }>, "lastFetch"> {}
type AddedBlog = Omit<PutBlobResult, "contentDisposition" | "contentType" | "size"> & { uploadedAt: any; size: number };

interface InitialState {
  /**
   * Holds information for all blog posts
   */
  blogs: Blog<ListBlobResultBlob[]>;

  /**Holds information for draft blog posts */
  drafts: BlogDraft;
  /**
   * Holds information concerning the single blog post
   */
  blog: Blog<ListBlobResultBlob | {}>;

  /**Contains information of all visited blog posts */
  processedBlogs: ProcessedBlog[];

  deletingBlogs: { isLoading: boolean; error: { message: string } };

  activeDraft: ActiveDraft;
}

const initialState: InitialState = {
  blogs: { data: [], error: null, isLoading: false, lastFetch: 0 },
  blog: { data: null, error: null, isLoading: false, lastFetch: 0 },
  deletingBlogs: { error: { message: "" }, isLoading: false },
  processedBlogs: [],
  drafts: { data: [], error: null, isLoading: false },
  activeDraft: { data: { downloadUrl: "", pathname: "", url: "", filename: "" }, error: null, isLoading: false },
};

const slice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    blogAdded: ({ blogs }, action: PayloadAction<AddedBlog | AddedBlog[]>) => {
      if (blogs.data) {
        const { payload } = action;
        Array.isArray(payload) ? (blogs.data = blogs.data.concat(payload)) : blogs.data.push(payload);
      }
    },
    activeDraftReset: ({ activeDraft }) => {
      activeDraft.data = initialState.activeDraft.data;
    },

    activeDraftErrorsCleared: ({ activeDraft }) => {
      activeDraft.error = null;
    },

    activeDraftSet: ({ activeDraft }, action: PayloadAction<Pick<ActiveDraft, "data">>) => {
      activeDraft.data = action.payload.data;
    },

    draftAdded: ({ drafts }, action: PayloadAction<ExtendedListBlobResultBlob | ExtendedListBlobResultBlob[]>) => {
      if (drafts.data) {
        const { payload } = action;

        Array.isArray(payload) ? (drafts.data = drafts.data.concat(payload)) : drafts.data.push(payload);
      }
    },

    blogsDeleted: ({ blogs }, action: PayloadAction<string[]>) => {
      if (blogs.data) blogs.data = blogs.data.filter((blog) => action.payload.findIndex((url) => blog.url === url) === -1);
    },

    draftsDeleted: ({ drafts }, action: PayloadAction<string[]>) => {
      if (drafts.data) drafts.data = drafts.data.filter((blog) => action.payload.findIndex((url) => blog.url === url) === -1);
    },

    blogsDeleteErrorCleared: ({ deletingBlogs }) => {
      deletingBlogs.error.message = "";
    },

    blogsErrorCleared: ({ blogs, blog }) => {
      blogs.error = null;
      blog.error = null;
    },
    blogsProcessed: ({ processedBlogs }, action: PayloadAction<ProcessedBlog>): any => {
      const found = processedBlogs.filter((p) => p.pathname === action.payload.pathname);
      // replace with the updated blog

      found.forEach((f) => {
        const index = processedBlogs.findIndex((p) => p.pathname === f.pathname);

        if (index > -1) processedBlogs.splice(index, 1);
      });

      processedBlogs.push(action.payload);
    },
    blogProcessedAfterAnUpdate: ({ processedBlogs, blogs, blog }, action: PayloadAction<{ [x: string]: any }>) => {
      const { filename, data: contents, lastModified } = action.payload;

      const index = processedBlogs.findIndex((p) => {
        const _pathname = p.pathname.split("/")[1].replace(".md", "");
        return filename === _pathname;
      });

      if (blog.data && "pathname" in blog.data && blog.data?.pathname?.split("/")[1].replace(".md", "") === filename)
        //@ts-ignore
        blog.data.uploadedAt = new Date(lastModified).toISOString();

      if (index > -1) {
        const found = processedBlogs[index];

        const matter = grayMatter(contents);
        const { content, data, language, matter: parsed } = matter;
        //@ts-ignore
        found.matter = { content, data, language, matter: parsed };
        found.uploadedAt = new Date(lastModified).toISOString();
        found._lastUpdated = Date.now();

        processedBlogs.splice(index, 1);

        processedBlogs.push(found);

        const foundBlog = blogs.data?.find((d) => d.pathname === found.pathname);
        //@ts-ignore
        if (foundBlog) foundBlog.uploadedAt = new Date(lastModified).toISOString();
      }
    },
  },
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

    b.addCase(fetchDraftBlogs.pending, ({ drafts }, action) => {
      drafts.isLoading = true;
    });

    b.addCase(fetchDraftBlogs.fulfilled, ({ drafts }, action: PayloadAction<{ blogs: ExtendedListBlobResultBlob[] }>) => {
      drafts.isLoading = false;
      drafts.error = null;
      drafts.data = action.payload.blogs;
    });

    b.addCase(fetchDraftBlogs.rejected, ({ drafts }, action) => {
      drafts.isLoading = false;
      drafts.error = (action.payload as any).error;
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

    b.addCase(deleteBlogs.pending, ({ deletingBlogs }, action) => {
      deletingBlogs.isLoading = true;
    });
    b.addCase(deleteBlogs.fulfilled, ({ deletingBlogs }, action) => {
      deletingBlogs.isLoading = false;
      deletingBlogs.error.message = "";
    });

    b.addCase(deleteBlogs.rejected, ({ deletingBlogs }, action) => {
      deletingBlogs.isLoading = false;
      deletingBlogs.error = (action.payload as any).error;
    });
    b.addCase(createDraft.pending, ({ activeDraft }, action) => {
      activeDraft.isLoading = true;
    });
    b.addCase(createDraft.fulfilled, ({ activeDraft }, action) => {
      activeDraft.isLoading = false;
      activeDraft.error = null;

      const { downloadUrl, pathname, url } = action.payload;
      const regexp = /(?<=\/)(drafts\/[^\/]+\.md)/;
      const res = url.match(regexp);

      const filename = res ? res[0].split("/")[1].replace(".md", "") : "";
      activeDraft.data = { downloadUrl, pathname, url, filename };
    });
    b.addCase(createDraft.rejected, ({ activeDraft }, action) => {
      activeDraft.isLoading = false;
      activeDraft.error = (action.payload as any).error;
    });
  },
});

const {
  blogsProcessed,
  blogsErrorCleared,
  blogAdded,
  blogsDeleted,
  blogsDeleteErrorCleared,
  draftsDeleted,
  draftAdded,
  activeDraftReset,
  activeDraftSet,
  activeDraftErrorsCleared,
  blogProcessedAfterAnUpdate,
} = slice.actions;
const blogReducer = slice.reducer;
export default blogReducer;

const getBlogsEndpoint = `${config.getPosts}?type=published`;
const draftBlogsApiEndpoint = `${config.getPosts}?type=drafts`;

/**
 * Process the blog into the desired format to work.
 *
 */
const _processBlog = async (blog: ListBlobResultBlob): Promise<ProcessedBlog> => {
  const result = {} as ProcessedBlog;

  const { pathname, uploadedAt, url } = blog;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error((error as Error).message ?? "Something went wrong while fetching Blog content");
  }

  const md = await (await response.blob()).text();
  const matter = grayMatter(md);

  const { content, data, language, matter: parsed } = matter;

  //@ts-ignore
  result.matter = { content, data, language, matter: parsed };
  result.pathname = pathname;
  result.uploadedAt = uploadedAt ? uploadedAt.toString() : new Date().toISOString();
  result._lastUpdated = Date.now();

  return result;
};

const fetchAllBlogs = (url: string) =>
  utils.fetchWithTimeout(url).then(async (res) => {
    if (!res.ok) {
      if (res.status === 404) {
        const notFoundError = await res.json();
        return Promise.reject(new Error(notFoundError?.message || "The request resource doesn't exist", { cause: { status: 404 } }));
      }

      return Promise.reject(
        new Error("Unexpected something has occured while fetching blogs", { cause: { status: res.status, statusText: res.statusText } })
      );
    }

    return res.json();
  });

const deleteBlogOperation = (url: string) =>
  utils.fetchWithTimeout(url, { method: "DELETE" }).then(async (res) => {
    if (!res.ok) {
      if (res.status === 404) {
        const notFoundError = await res.json();
        return Promise.reject(new Error(notFoundError?.message || "The request resource doesn't exist", { cause: { status: 404 } }));
      }

      return Promise.reject(
        new Error("Unexpected something has occured while deleting blogs", { cause: { status: res.status, statusText: res.statusText } })
      );
    }

    return res.json();
  });

/**Send a request to create a draft blog post on vercel blob */
const createDraftBlob = async (url: string) => {
  const initialDraftContent = " ";

  return fetch(url, { method: "POST", body: JSON.stringify({ data: initialDraftContent }), headers: { "Content-Type": "application/json" } }).then(
    async (res) => {
      if (!res.ok)
        return Promise.reject(
          new Error("An error occurred while creating the draft.", { cause: { status: res.status, statusText: res.statusText } })
        );

      return await res.json();
    }
  );
};

// commands
export const resetActiveDraft = () => activeDraftReset();
export const clearAllBlogError = () => blogsErrorCleared();
export const clearActiveDraftError = () => activeDraftErrorsCleared();
export const clearBlogDeletingError = () => blogsDeleteErrorCleared();
export const addBlog = (blog: AddedBlog | AddedBlog[]) => blogAdded(blog);
export const processBlogAfterAnUpdate = (payload: any) => blogProcessedAfterAnUpdate(payload);
export const saveActiveDraft = (payload: Pick<ActiveDraft, "data">) => activeDraftSet(payload);
export const processBlog = async (blog: ListBlobResultBlob) => blogsProcessed(await _processBlog(blog));
export const addDraft = (blog: ExtendedListBlobResultBlob | ExtendedListBlobResultBlob[]) => draftAdded(blog);

/**Send a request to update a draft blog post on vercel blob */
const updateDraftBlob = async (url: string, data: CreateDraftArgs) => {
  return fetch(url, { method: "PUT", body: JSON.stringify({ ...data }), headers: { "Content-Type": "application/json" } }).then(async (res) => {
    if (!res.ok)
      return Promise.reject(new Error("An error occurred while creating the draft.", { cause: { status: res.status, statusText: res.statusText } }));

    return await res.json();
  });
};

export const updateDraft = createAsyncThunk<void, CreateDraftArgs>("blogs/draftUpdated", async (arg, t) => {
  try {
    const queryClient = new QueryClient();

    const updateDraftEndpoint = `${config.blogUploads}?filename=${arg.filename}&replace=true&type=drafts`;

    return await queryClient.fetchQuery({
      queryKey: ["update-draft", updateDraftEndpoint, arg],
      queryFn: ({ queryKey }) => updateDraftBlob(queryKey[1] as string, queryKey[2] as CreateDraftArgs),
    });
  } catch (ex: unknown) {
    return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
  }
});

export const createDraft = createAsyncThunk<Omit<PutBlobResult, "contentDisposition" | "contentType" | "size"> & { filename: string }>(
  "blogs/draftCreated",
  async (undefined, t) => {
    try {
      const queryClient = new QueryClient();

      const createDraftEndpoint = `${config.blogUploads}?filename=draft&type=drafts`;

      return await queryClient.fetchQuery({
        queryKey: ["create-draft", createDraftEndpoint],
        queryFn: ({ queryKey }) => createDraftBlob(queryKey[1]),
      });
    } catch (ex: unknown) {
      return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
    }
  }
);

export const deleteBlogs = createAsyncThunk<string[], string[]>("blogs/blogDeleted", async (blogURLs, t) => {
  const {
    blogs: { blogs },
  } = t.getState() as RootState;

  const originalBlogs = blogs;

  // Here, we can first remove them from the store (i.e from UI)
  // then we perform the delete action; if successful, do nothing otherwise
  // we revert back to the oldstate (this is done in the catch block below).
  t.dispatch(blogsDeleted(blogURLs));

  try {
    const queryClient = new QueryClient();

    const deleteBlogURL = `${config.blogUploads}?urls=${blogURLs.join(",")}`;

    await queryClient.fetchQuery({ queryKey: ["delete-blogs", deleteBlogURL], queryFn: ({ queryKey }) => deleteBlogOperation(queryKey[1]) });

    return blogURLs;
  } catch (ex: unknown) {
    // reverting back the blog posts incase of any error when deleting blog posts.
    const restoredBlogs = blogURLs.map((url) => originalBlogs.data?.find((blog) => blog.url === url)!);

    t.dispatch(addBlog(restoredBlogs));

    return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
  }
});

/**Deleting draft blog posts */
export const deleteDrafts = createAsyncThunk<string[], string[]>("blogs/draftDeleted", async (blogURLs, t) => {
  const {
    blogs: { drafts },
  } = t.getState() as RootState;

  const originalBlogs = drafts;

  // Here, we can first remove them from the store (i.e from UI)
  // then we perform the delete action; if successful, do nothing otherwise
  // we revert back to the oldstate (this is done in the catch block below).
  t.dispatch(draftsDeleted(blogURLs));

  try {
    const queryClient = new QueryClient();

    const deleteBlogURL = `${config.blogUploads}?urls=${blogURLs.join(",")}`;

    await queryClient.fetchQuery({ queryKey: ["delete-drafts", deleteBlogURL], queryFn: ({ queryKey }) => deleteBlogOperation(queryKey[1]) });

    return blogURLs;
  } catch (ex: unknown) {
    // reverting back the blog posts incase of any error when deleting blog posts.
    const restoredBlogs = blogURLs.map((url) => originalBlogs.data?.find((blog) => blog.url === url)!);

    t.dispatch(addDraft(restoredBlogs));

    return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
  }
});

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
        blogs: { blogs, blog: oldBlog, processedBlogs },
      } = t.getState() as RootState;

      if (oldBlog.data && "pathname" in oldBlog.data && oldBlog.data.pathname?.split("/")[1]?.replace(".md", "") === slug) {
        const _blogData = oldBlog.data as ListBlobResultBlob;

        const found = processedBlogs.find((p) => p.pathname === _blogData.pathname);

        if (found) {
          const diffInMinutes = dayjs().diff(dayjs(found._lastUpdated), "minutes");

          // Use the previous processed blog for only 5 mins
          // Implements a simple cache mechanism
          const CacheTime = 5; // mins

          if (!(diffInMinutes <= CacheTime)) t.dispatch(blogsProcessed(await _processBlog(_blogData)));
        } else t.dispatch(blogsProcessed(await _processBlog(oldBlog.data)));

        t.dispatch(blogsProcessed(await _processBlog(_blogData)));

        return await Promise.resolve(_blogData);
      }

      if (blogs.data && blogs.data?.length > 0) {
        const blog = blogs.data.find((blog) => blog.pathname.split("/")[1].replace(".md", "") === slug);

        if (blog) {
          const found = processedBlogs.find((p) => p.pathname === blog.pathname);

          if (found) {
            const diffInMinutes = dayjs().diff(dayjs(found._lastUpdated), "minutes");

            // Use the previous processed blogs for only 5 mins
            // Implements a simple cache mechanism
            const CacheTime = 5; // mins

            if (!(diffInMinutes <= CacheTime)) t.dispatch(blogsProcessed(await _processBlog(blog)));
          } else t.dispatch(blogsProcessed(await _processBlog(blog)));

          return await Promise.resolve(blog);
        }
      }

      const queryClient = new QueryClient();

      const blogMetadata = (await queryClient.fetchQuery({
        queryKey: ["blog-metadata", url],
        queryFn: ({ queryKey }) => fetchAllBlogs(queryKey[1]),
        staleTime: 0,
      })) as ListBlobResultBlob;

      t.dispatch(blogsProcessed(await _processBlog(blogMetadata)));

      return Promise.resolve(blogMetadata);
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
    const {
      blogs: { blogs },
    } = t.getState() as RootState;

    const queryClient = new QueryClient();

    if (blogs.lastFetch === 0 || blogs.data?.length === 0)
      return await queryClient.fetchQuery({ queryKey: ["blogs", getBlogsEndpoint], queryFn: ({ queryKey }) => fetchAllBlogs(queryKey[1]) });

    const diffInMinutes = dayjs().diff(dayjs(blogs.lastFetch), "minutes");

    // Use the previous fetched blogs for only 5 mins
    // Implements a simple cache mechanism
    const CacheTime = 5; // mins

    if (diffInMinutes <= CacheTime) return Promise.resolve({ blogs: blogs.data });

    return await queryClient.fetchQuery({ queryKey: ["blogs", getBlogsEndpoint], queryFn: ({ queryKey }) => fetchAllBlogs(queryKey[1]) });
  } catch (ex: unknown) {
    return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
  }
});

/**Fetch Draft blog posts */
export const fetchDraftBlogs = createAsyncThunk<{ blogs: ExtendedListBlobResultBlob[] }>("blogs/draftsRequested", async (undefined, t) => {
  try {
    const queryClient = new QueryClient();

    const { blogs: _blogs } = await queryClient.fetchQuery({
      queryKey: ["drafts", draftBlogsApiEndpoint],
      queryFn: ({ queryKey }) => fetchAllBlogs(queryKey[1]),
    });

    const blogs = _blogs.map((blog: ExtendedListBlobResultBlob) => {
      const filenameRegexp = /(?<=\/)(drafts\/[^\/]+\.md)/;
      const match = blog.url.match(filenameRegexp);

      const filename = match ? match[0].split("/")[1].replace(".md", "") : "";
      return {
        ...blog,
        filename,
      };
    });

    return { blogs };
  } catch (ex: unknown) {
    return t.rejectWithValue({ error: { message: (ex as Error).message, cause: (ex as Error).cause } });
  }
});

// selectors
export const getAllBlogsState = createSelector(
  (s: RootState) => s.blogs,
  (blogs) => blogs.blogs
);

export const getDraftBlogState = createSelector(
  (s: RootState) => s.blogs,
  (blogs) => blogs.drafts
);

export const getBlogState = createSelector(
  (s: RootState) => s,
  (s) => s.blogs.blog
);

export const getProcessedBlogs = createSelector(
  (s: RootState) => s.blogs,
  (blogs) => blogs.processedBlogs
);

export const getBlogDeletingState = createSelector(
  (s: RootState) => s.blogs,
  (blogs) => blogs.deletingBlogs
);

export const getActiveDraftState = createSelector(
  (s: RootState) => s.blogs,
  (blogs) => blogs.activeDraft
);
