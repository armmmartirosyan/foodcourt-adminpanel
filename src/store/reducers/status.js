import {createReducer} from "@reduxjs/toolkit";
import _ from 'lodash'

const initialState = {}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('/pending'), (state, action) => {
            const key = _.camelCase(action.type.replace('/pending', '/status'));
            state[key] = 'pending';
        })
        .addMatcher((action) => action.type.endsWith('/fulfilled'), (state, action) => {
            const key = _.camelCase(action.type.replace('/fulfilled', '/status'));
            state[key] = 'success';
        })
        .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
            const key = _.camelCase(action.type.replace('/rejected', '/status'));
            state[key] = 'error';
        })
});
