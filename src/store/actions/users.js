import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allUsersListRequest = createAsyncThunk('users/get/all', async (payload = {}) => {
    const {page, name} = payload;
    const { data } = await Api.getAllUsersList(page, name);

    return data;
});
