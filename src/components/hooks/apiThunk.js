import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosPrivate,axiosPublic } from "./axiosProvider";

const createApiThunk = (axiosInstance) => {
    return (name, url, method = "POST") => {
        return createAsyncThunk(name, async (payload, { rejectWithValue }) => {
            try {
                const config = { method, url };
                if (method !== "GET") {
                    config.data = payload;
                } else {
                    config.params = payload; 
                }

                const response = await axiosInstance(config);
                return response?.data ? response?.data : response;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong!";
                return rejectWithValue(errorMessage);
            }
        });
    };
};

export const createApiThunkPublic = createApiThunk(axiosPublic);
export const createApiThunkPrivate = createApiThunk(axiosPrivate);

export const createExtraReducersForThunk = (builder, thunkAction, sliceName) => {
    builder
        .addCase(thunkAction.pending, (state) => {
            state.loading = true;
            state.error = null;
            if (!state[sliceName]) {
                state[sliceName] = {};
            }
        })
        .addCase(thunkAction.fulfilled, (state, action) => {
            state.loading = false;
            if (!state[sliceName]) {
                state[sliceName] = {};
            }
            state[sliceName].data = action?.payload || {};
        })
        .addCase(thunkAction.rejected, (state, action) => {
            state.loading = false;
            if (!state[sliceName]) {
                state[sliceName] = {};
            }
            state[sliceName].error = action?.payload || `Something went wrong while fetching ${sliceName} details.`;
        });
};