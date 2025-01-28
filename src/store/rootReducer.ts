import { combineReducers } from "@reduxjs/toolkit";
import blogReducer from "./blogSlice";
import editorReducer from "./editorSlice";

export default combineReducers({
  blogs: blogReducer,
  editor: editorReducer,
});
