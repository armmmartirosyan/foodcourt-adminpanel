import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    slides: [],
    singleSlide: {}
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('slides/get/all/fulfilled'), (state, action) => {
            const slidesList = action?.payload?.slides || [];
            state.slides = [...slidesList];
        })
        .addMatcher((action) => action.type.endsWith('slides/get/single/fulfilled'), (state, action) => {
            state.singleSlide = {...action.payload.slide};
        })
})
