import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export type TabType = "published" | "drafts";

const initialState: { activeTab: TabType } = {
  activeTab: "published",
};

const slice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    tabChanged: (tab, action: PayloadAction<TabType>) => {
      tab.activeTab = action.payload;
    },
  },
});

const { tabChanged } = slice.actions;
export default slice.reducer;

// commands
export const changeTab = (tab: TabType) => tabChanged(tab);

// selectors
export const getActiveTab = createSelector((s: RootState) => s, (s) => s.tabs);
