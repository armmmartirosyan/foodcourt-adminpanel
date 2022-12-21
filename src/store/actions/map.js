import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allBranchesListRequest = createAsyncThunk('branches/get/all', async (payload = {}) => {
    const { data } = await Api.getAllBranchesList();

    return data;
});

export const addBranchRequest = createAsyncThunk('branch/add', async (payload = {}) => {
    const {onUploadProcess, ...params} = payload;
    const {data} = await Api.addBranch(onUploadProcess, params);

    return data;
});

export const updateBranchRequest = createAsyncThunk('branch/update', async (payload = {}) => {
    const {slugName, onUploadProcess, ...params} = payload;
    const {data} = await Api.updateBranch(slugName, onUploadProcess, params);

    return data;
});

export const deleteBranchRequest = createAsyncThunk('branch/delete', async (payload = {}) => {
    const {slugName} = payload;
    const {data} = await Api.deleteBranch(slugName);

    return data;
});
