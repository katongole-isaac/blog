import matter from "gray-matter";

interface BlogMetaData {
  title: string;
  tags: string[];
  author?: string;
  date?: string;
  description?: string;
}
export interface BlogResponse {
  matter: ReturnType<typeof matter> & { data: BlogMetaData };
  createdAt: number;
  lastModified: number;
  isModified: boolean;
}
