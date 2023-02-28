import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const getAllPaymentTypesRequest = createAsyncThunk('payment/types/get/all', async (payload = {}, {rejectWithValue}) => {
    let data;

    try{
        let newData = await Api.getAllPaymentTypes();
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singlePaymentTypeRequest = createAsyncThunk('payment/types/get/single', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData = await Api.singlePaymentType(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const addPaymentTypeRequest = createAsyncThunk('payment/types/add', async (payload = {}, {rejectWithValue}) => {
    const {...props} = payload;
    let data;

    try{
        let newData = await Api.addPaymentType(props);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updatePaymentTypeRequest = createAsyncThunk('payment/types/update', async (payload = {}, {rejectWithValue}) => {
    const {id, ...props} = payload;
    let data;

    try{
        let newData = await Api.updatePaymentType(id, props);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deletePaymentTypeRequest = createAsyncThunk('payment/types/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData = await Api.deletePaymentType(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
