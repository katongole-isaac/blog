import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";
import { BLOG_GUIDE_MARKDOWN } from "@/utils/constants";

interface IEditor {
  data: string;
}

const initialState: IEditor = {
  data: BLOG_GUIDE_MARKDOWN,
};

const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    editorChangesSaved: (editor, action: PayloadAction<{ data: string }>) => {
      const { data } = action.payload;
      editor.data = data;
    },
  },
});

const { editorChangesSaved } = slice.actions;
export default slice.reducer;

// commands
export const saveEditorChanges = (data: string) => editorChangesSaved({ data });

// selectors
export const getEditorData = createSelector(
  (s: RootState) => s.editor,
  (editor) => editor.data
);
