import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carsList: [
    { id: 1, name: "BMW X5" },
    { id: 2, name: "Audi A6" },
    { id: 3, name: "Mercedes GLE" },
  ],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addCar: (state, action) => {
      state.carsList.push(action.payload);
    },
    removeCar: (state, action) => {
      state.carsList = state.carsList.filter((car) => car.id !== action.payload);
    },
  },
});

export const { addCar, removeCar } = uiSlice.actions;
export default uiSlice.reducer;
