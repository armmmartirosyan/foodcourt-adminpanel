import {createReducer} from "@reduxjs/toolkit";

import {SOCKET_NEW_ORDER} from "../actions/socket";

const initialState = {
    productOrders: [],
    notReceivedOrders: [],
    singleNotReceivedOrder: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('orders/statistics/fulfilled'), (state, action) => {
            state.productOrders = [...action.payload.productOrders];
        })
        .addMatcher((action) => action.type.endsWith('orders/not/received/list/fulfilled'), (state, action) => {
            state.notReceivedOrders = [...action.payload.notReceivedOrders];
        })
        .addMatcher((action) => action.type.endsWith('orders/not/received/single/fulfilled'), (state, action) => {
            state.singleNotReceivedOrder = {...action.payload.singleNotReceivedOrder};
        })
        .addMatcher((action) => action.type.endsWith(SOCKET_NEW_ORDER), (state, action) => {
            const newOrder = action?.payload?.data?.order;
            state.notReceivedOrders = [...state.notReceivedOrders, newOrder];
        })
})
