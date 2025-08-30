import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoadingSaveResult: false,
  },
  reducers: {
    toggleLoadingSaveResult(state, action) {
      state.isLoadingSaveResult = action.payload;
    },
  },
});

export const { toggleLoadingSaveResult } = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;
