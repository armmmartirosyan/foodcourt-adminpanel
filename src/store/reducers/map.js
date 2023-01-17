import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    branches: [],
    singleBranch: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('branches/get/all/fulfilled'), (state, action) => {
            const branchesList = action?.payload?.branches || [];
            state.branches = [...branchesList];
        })
        .addMatcher((action) => action.type.endsWith('branches/get/single/fulfilled'), (state, action) => {
            state.singleBranch = {...action.payload.singleBranch};
        })
})
