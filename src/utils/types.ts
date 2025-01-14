import matter from "gray-matter";

export interface BlogResponse {
  matter: ReturnType<typeof matter>;
  createdAt: number;
  lastModified: number;
  isModified: boolean;
}
