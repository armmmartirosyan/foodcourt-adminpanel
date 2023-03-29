import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    comments: [],
    singleComment: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('comment/get/all/fulfilled'), (state, action) => {
            state.comments = action?.payload?.comments || [];
        })
        .addMatcher((action) => action.type.endsWith('comment/get/single/fulfilled'), (state, action) => {
            state.singleComment = action?.payload?.comment || {};
        })
})
