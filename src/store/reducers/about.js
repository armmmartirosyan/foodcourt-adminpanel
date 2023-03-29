import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    about: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('about/get/fulfilled'), (state, action) => {
            state.about = {...action.payload.about};
        })
})
