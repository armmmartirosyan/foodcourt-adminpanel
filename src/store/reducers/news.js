import { createReducer } from "@reduxjs/toolkit";
import {allNewsListRequest} from "../actions/news";

const initialState = {
    news: [],
    pages: 1,
}

export default createReducer(initialState, {
    [allNewsListRequest.fulfilled]: (state, action) => {
        const data = action?.payload?.data || {};

        state.news = data.news;
        state.pages = data.totalPages || 1;
    },
});
