import { combineReducers } from "@reduxjs/toolkit";

import blogReducer from "./blogSlice";
import tabsReducer from "./tabSlice";
import editorReducer from "./editorSlice";

export default combineReducers({
  blogs: blogReducer,
  editor: editorReducer,
  tabs: tabsReducer,
});
