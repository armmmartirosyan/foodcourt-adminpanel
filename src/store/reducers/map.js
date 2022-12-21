import { createReducer } from "@reduxjs/toolkit";
import {allBranchesListRequest} from "../actions/map";

const initialState = {
    branches: [],
}

export default createReducer(initialState, {
    [allBranchesListRequest.fulfilled]: (state, action) => {
        const branchesList = action?.payload?.branches || [];
        state.branches = [...branchesList];
    },
});
