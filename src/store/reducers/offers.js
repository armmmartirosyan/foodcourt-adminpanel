import { createReducer } from "@reduxjs/toolkit";
import {allOffersListRequest} from "../actions/offers";

const initialState = {
    offers: [],
}

export default createReducer(initialState, {
    [allOffersListRequest.fulfilled]: (state, action) => {
        const offersList = action?.payload?.offers || [];
        state.offers = [...offersList];
    },
});
