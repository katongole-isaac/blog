import { combineReducers } from "@reduxjs/toolkit";
import blogReducer from "./blogSlice";

export default combineReducers({
  blogs: blogReducer,
});
