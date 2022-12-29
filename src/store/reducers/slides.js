import { createReducer } from "@reduxjs/toolkit";
import {allSlidesListRequest} from "../actions/slides";

const initialState = {
    slides: [],
}

// export default createReducer(initialState, {
//     [allSlidesListRequest.fulfilled]: (state, action) => {
//         const slidesList = action?.payload?.slides || [];
//         state.slides = [...slidesList];
//     },
// });

export default createReducer(initialState, (builder) => {
    builder.addMatcher((action) => action.type.endsWith('slides/get/all/fulfilled'), (state, action) => {
        const slidesList = action?.payload?.slides || [];
        state.slides = [...slidesList];
    })
})
