import {createReducer} from "@reduxjs/toolkit";

const initialState = {
    offers: [],
    singleOffer: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('offers/get/all/fulfilled'), (state, action) => {
            const offersList = action?.payload?.offers || [];
            state.offers = [...offersList];
        })
        .addMatcher((action) => action.type.endsWith('offers/get/single/fulfilled'), (state, action) => {
            state.singleOffer = {...action.payload.offer};
        })
})
