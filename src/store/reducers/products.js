import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    products: [],
    pages: 1,
    singleProduct: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('products/get/all/fulfilled'), (state, action) => {
            const data = action?.payload?.data || {};

            state.products = data.products || [];
            state.pages = data.totalPages || 1;
        })
        .addMatcher((action) => action.type.endsWith('products/get/single/fulfilled'), (state, action) => {
            state.singleProduct = {...action.payload.product};
        })
})
