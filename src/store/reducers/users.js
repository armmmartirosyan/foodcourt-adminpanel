import { createReducer } from "@reduxjs/toolkit";
import {allUsersListRequest} from "../actions/users";

const initialState = {
    users: [],
    pages: 1,
}

// export default createReducer(initialState, {
//     [allUsersListRequest.fulfilled]: (state, action) => {
//         const data = action?.payload?.data || {};
//
//         state.users = data.users || [];
//         state.pages = data.totalPages || 1;
//     },
// });

export default createReducer(initialState, (builder) => {
    builder.addMatcher((action) => action.type.endsWith('users/get/all/fulfilled'), (state, action) => {
        const data = action?.payload?.data || {};

        state.users = data.users || [];
        state.pages = data.totalPages || 1;
    })
})
