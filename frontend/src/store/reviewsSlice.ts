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
  publicReviews: NormalizedReview[];
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
  publicReviews: [],
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

export const fetchPublicReviews = createAsyncThunk(
  "reviews/fetchPublicReviews",
  async () => {
    const response = await api.get("/reviews", {
      params: { selectedForPublic: true },
    });
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

export const fetchGoogleReviews = createAsyncThunk(
  "reviews/fetchGoogleReviews",
  async (params: any) => {
    const response = await api.get("/reviews/google", { params });
    return response.data;
  }
);

export const toggleReviewSelection = createAsyncThunk(
  "reviews/toggleSelection",
  async ({
    id,
    selectedForPublic,
    review,
  }: {
    id: string;
    selectedForPublic: boolean;
    review?: NormalizedReview;
  }) => {
    const allowedFields = [
      "source",
      "listingId",
      "type",
      "status",
      "overallRating",
      "publicText",
      "submittedAt",
      "guestName",
      "channel",
      "listingName",
    ];

    const filteredReview: any = { selectedForPublic };
    if (review) {
      allowedFields.forEach((field) => {
        if (field in review) {
          filteredReview[field] = (review as any)[field];
        }
      });
    }

    const response = await api.patch(
      `/reviews/${id}/selection`,
      filteredReview
    );
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
        state.error =
          action.error.message || "Failed to fetch Hostaway reviews";
      })
      .addCase(fetchGoogleReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGoogleReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchGoogleReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Failed to fetch Google reviews";
      })
      .addCase(fetchPublicReviews.fulfilled, (state, action) => {
        state.publicReviews = action.payload.data;
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
          const updatedReview = action.payload;

          // Update items list
          const index = state.items.findIndex((r) => r.id === updatedReview.id);
          if (index !== -1) {
            state.items[index] = updatedReview;
          }

          // Update publicReviews list
          if (updatedReview.selectedForPublic) {
            const exists = state.publicReviews.find(
              (r) => r.id === updatedReview.id
            );
            if (!exists) {
              state.publicReviews.push(updatedReview);
            }
          } else {
            state.publicReviews = state.publicReviews.filter(
              (r) => r.id !== updatedReview.id
            );
          }
        }
      )
      .addCase(toggleReviewSelection.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to toggle review selection";
      });
  },
});

export default reviewsSlice.reducer;
