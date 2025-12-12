import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { NormalizedReview } from "@flex-living/types";
import api from "../lib/api";

interface ReviewsState {
  items: NormalizedReview[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  meta: {
    total: number;
    filtersApplied: any;
  };
}

const initialState: ReviewsState = {
  items: [],
  status: "idle",
  error: null,
  meta: {
    total: 0,
    filtersApplied: {},
  },
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (params: any) => {
    const response = await api.get("/reviews", { params });
    return response.data;
  }
);

export const toggleReviewSelection = createAsyncThunk(
  "reviews/toggleSelection",
  async ({
    id,
    selectedForPublic,
  }: {
    id: string;
    selectedForPublic: boolean;
  }) => {
    const response = await api.patch(`/reviews/${id}/selection`, {
      selectedForPublic,
    });
    return response.data.data;
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch reviews";
      })
      .addCase(
        toggleReviewSelection.fulfilled,
        (state, action: PayloadAction<NormalizedReview>) => {
          const index = state.items.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      );
  },
});

export default reviewsSlice.reducer;
