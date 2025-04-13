import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import userReducer from "./userSlice"; // 

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    user: userReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
