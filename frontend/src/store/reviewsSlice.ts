import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { NormalizedReview } from "@/types";
import api from "../lib/api";

interface AnalyticsData {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
}

interface ReviewsState {
  items: NormalizedReview[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  meta: {
    total: number;
    filtersApplied: any;
  };
  analytics: AnalyticsData | null;
  analyticsStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ReviewsState = {
  items: [],
  status: "idle",
  error: null,
  meta: {
    total: 0,
    filtersApplied: {},
  },
  analytics: null,
  analyticsStatus: "idle",
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (params: any) => {
    const response = await api.get("/reviews", { params });
    return response.data;
  }
);

export const fetchAnalytics = createAsyncThunk(
  "reviews/fetchAnalytics",
  async (params: any) => {
    const response = await api.get("/reviews/analytics", { params });
    return response.data;
  }
);

export const fetchHostawayReviews = createAsyncThunk(
  "reviews/fetchHostawayReviews",
  async (params: any) => {
    const response = await api.get("/reviews/hostaway", { params });
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
      .addCase(fetchHostawayReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHostawayReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchHostawayReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch Hostaway reviews";
      })
      .addCase(fetchAnalytics.pending, (state) => {
        state.analyticsStatus = "loading";
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analyticsStatus = "succeeded";
        state.analytics = action.payload;
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
