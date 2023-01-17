import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const ordersStatisticsRequest = createAsyncThunk('orders/statistics', async (payload = {}, {rejectWithValue}) => {
    const {productId, year} = payload;
    let data;

    try {
        const newData = await Api.ordersStatistics(productId, year);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const notReceivedOrdersListRequest = createAsyncThunk('orders/not/received/list', async (payload = {}, {rejectWithValue}) => {
    const {branchId} = payload;
    let data;

    try {
        const newData = await Api.notReceivedOrdersList(branchId);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singleNotReceivedOrderRequest = createAsyncThunk('orders/not/received/single', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try {
        const newData = await Api.singleNotReceivedOrder(id);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const modifyOrderRequest = createAsyncThunk('orders/modify', async (payload = {}, {rejectWithValue}) => {
    const {status, id} = payload;
    let data;

    try {
        const newData = await Api.modifyOrder(status, id);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
