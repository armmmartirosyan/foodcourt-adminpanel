import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    news: [],
    singleNews: {},
    pages: 1,
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('news/get/all/fulfilled'), (state, action) => {
            const data = action?.payload?.data || {};

            state.news = data.news;
            state.pages = data.totalPages || 1;
        })
        .addMatcher((action) => action.type.endsWith('news/get/single/fulfilled'), (state, action) => {
            state.singleNews = action.payload.singleNews;
        })
})
