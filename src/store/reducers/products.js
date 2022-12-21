import { createReducer } from "@reduxjs/toolkit";
import {allProductsListRequest} from "../actions/products";

const initialState = {
    products: [],
    pages: 1,
}

export default createReducer(initialState, {
    [allProductsListRequest.fulfilled]: (state, action) => {
        const data = action?.payload?.data || {};

        state.products = data.products || [];
        state.pages = data.totalPages || 1;
    },
});
