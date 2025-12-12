import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api";

interface Listing {
  id: string;
  name: string;
  slug: string;
  channel: string;
}

interface ListingsState {
  items: Listing[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ListingsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async () => {
    const response = await api.get("/reviews/listings");
    return response.data;
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch listings";
      });
  },
});

export default listingsSlice.reducer;
