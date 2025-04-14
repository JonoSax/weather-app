import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const initialState: ExactLocation = {
  latitude: 51.04,
  longitude: -114.07,
};

export const exactLocationSlice = createSlice({
  name: "exactLocation",
  initialState,
  reducers: {
    setExactLocation: (state, action: PayloadAction<ExactLocation>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

const exactLocationSliceReducer = exactLocationSlice.reducer;

export const { setExactLocation } = exactLocationSlice.actions;
export default exactLocationSliceReducer;

export const store = configureStore({
  reducer: {
    exactLocation: exactLocationSliceReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
