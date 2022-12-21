import { createReducer } from "@reduxjs/toolkit";
import {allCategoriesListRequest} from "../actions/categories";

const initialState = {
    categories: [],
}

// export default createReducer(initialState, {
//     [allCategoriesListRequest.fulfilled]: (state, action) => {
//         state.categories = [...action.payload.categories];
//     }
// });

export default createReducer(initialState, (builder) => {
    builder.addMatcher((action) => action.type.endsWith('categories/getAll/fulfilled'), (state, action) => {
        state.categories = [...action.payload.categories];
    })
})
