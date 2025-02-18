import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IEditor {
  /**Hash that contains all documents that are being edited */
  edit: { [blogId: string]: { data: string } };
}

const initialState: IEditor = {
  edit: {},
};

const blogIdFromBlogURL = (url: string | string[]) => {
  const regexpForId = /https?:\/\/[^\/]+\/(.+)/;

  if (typeof url === "string") return url.match(regexpForId)![1];

  return url.map((u) => u.match(regexpForId)![1]);
};

const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    editChangesSaved: (editor, action: PayloadAction<{ blogId: string; data: string }>) => {
      editor.edit[action.payload.blogId] = { data: action.payload.data };
    },
    editEntryDeleted: (editor, action: PayloadAction<{ blogId: string | string[] }>) => {
      const { blogId } = action.payload;

      if (Array.isArray(blogId)) blogId.forEach((entry) => delete editor.edit[entry]);
      else delete editor.edit[blogId];
    },
  },
});

const { editChangesSaved, editEntryDeleted } = slice.actions;
export default slice.reducer;

// commands
export const saveEditChanges = (blogURL: string, data: string) => {
  const blogId = blogIdFromBlogURL(blogURL) as string;

  return editChangesSaved({ blogId, data });
};

export const saveDraftChanges = (draftFilename: string, data: string) => editChangesSaved({ blogId: draftFilename, data });
/**Delete a particular draft from the `editor.edit` */
export const deleteDraftEntry = (draftFilename: string | string[]) => editEntryDeleted({ blogId: draftFilename });
/**Deletes the current edits */
export const deleteEditEntry = (blogURL: string | string[]) => {
  const blogId = blogIdFromBlogURL(blogURL)!;
  return editEntryDeleted({ blogId });
};

//selectors

/**A hash of blog pathnames as key for all the blog posts that are currently being editing */
export const getEditState = createSelector(
  (s: RootState) => s.editor,
  (editor) => editor.edit
);
