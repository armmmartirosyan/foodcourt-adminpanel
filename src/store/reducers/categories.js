import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    singleCategory: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('categories/get/all/fulfilled'), (state, action) => {
            state.categories = [...action.payload.categories];
        })
        .addMatcher((action) => action.type.endsWith('categories/get/single/fulfilled'), (state, action) => {
            state.singleCategory = {...action.payload.category};
        })
})
