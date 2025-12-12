import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async () => {
    const response = await axios.get(`${API_URL}/reviews/listings`);
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
