import { createReducer } from "@reduxjs/toolkit";
import {allSlidesListRequest} from "../actions/slides";

const initialState = {
    slides: [],
}

export default createReducer(initialState, {
    [allSlidesListRequest.fulfilled]: (state, action) => {
        const slidesList = action?.payload?.slides || [];
        state.slides = [...slidesList];
    },
});
