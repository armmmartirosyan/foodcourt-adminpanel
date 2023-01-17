import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    users: [],
    pages: 1,
    singleUser: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('users/get/all/fulfilled'), (state, action) => {
            const data = action?.payload?.data || {};

            state.users = data.users || [];
            state.pages = data.totalPages || 1;
        })
        .addMatcher((action) => action.type.endsWith('users/get/single/fulfilled'), (state, action) => {
            state.singleUser = {...action.payload.user};
        })
})
