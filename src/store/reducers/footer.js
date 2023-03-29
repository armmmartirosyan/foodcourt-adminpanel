import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    footer: {},
    footerSocialSingle: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('footer/get/fulfilled'), (state, action) => {
            state.footer = {...action.payload.footer};
        })
        .addMatcher((action) => action.type.endsWith('social/get/single/fulfilled'), (state, action) => {
            state.footerSocialSingle = {...action.payload.social};
        })
})
