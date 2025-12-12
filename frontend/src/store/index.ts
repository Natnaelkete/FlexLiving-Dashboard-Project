import { configureStore } from "@reduxjs/toolkit";
import reviewsReducer from "./reviewsSlice";
import filtersReducer from "./filtersSlice";
import listingsReducer from "./listingsSlice";

export const store = configureStore({
  reducer: {
    reviews: reviewsReducer,
    filters: filtersReducer,
    listings: listingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
