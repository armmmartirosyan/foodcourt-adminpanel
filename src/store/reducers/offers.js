import { createReducer } from "@reduxjs/toolkit";
import {allOffersListRequest} from "../actions/offers";

const initialState = {
    offers: [],
}

// export default createReducer(initialState, {
//     [allOffersListRequest.fulfilled]: (state, action) => {
//         const offersList = action?.payload?.offers || [];
//         state.offers = [...offersList];
//     },
// });

export default createReducer(initialState, (builder) => {
    builder.addMatcher((action) => action.type.endsWith('offers/get/all/fulfilled'), (state, action) => {
        const offersList = action?.payload?.offers || [];
        state.offers = [...offersList];
    })
})
