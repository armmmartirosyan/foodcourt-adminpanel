import {createReducer} from "@reduxjs/toolkit";
import {allNewsListRequest} from "../actions/news";

const initialState = {
    news: [],
    pages: 1,
}

// export default createReducer(initialState, {
//     [allNewsListRequest.fulfilled]: (state, action) => {
//         const data = action?.payload?.data || {};
//
//         state.news = data.news;
//         state.pages = data.totalPages || 1;
//     },
// });

export default createReducer(initialState, (builder) => {
    builder.addMatcher((action) => action.type.endsWith('news/get/all/fulfilled'), (state, action) => {
        const data = action?.payload?.data || {};

        state.news = data.news;
        state.pages = data.totalPages || 1;
    })
})
