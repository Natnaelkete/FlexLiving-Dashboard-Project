import { render, screen } from "@testing-library/react";
import { AnalyticsSummary } from "../components/AnalyticsSummary";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import reviewsReducer from "../store/reviewsSlice";

const renderWithStore = (state: any) => {
  const store = configureStore({
    reducer: {
      reviews: reviewsReducer,
    },
    preloadedState: {
      reviews: state,
    },
  });

  return render(
    <Provider store={store}>
      <AnalyticsSummary />
    </Provider>
  );
};

describe("AnalyticsSummary", () => {
  it("renders loading state", () => {
    const { container } = renderWithStore({
      analyticsStatus: "loading",
      analytics: null,
    });
    // Check for pulse class
    const pulseElement = container.querySelector(".animate-pulse");
    expect(pulseElement).toBeInTheDocument();
  });

  it("renders analytics data", () => {
    const analytics = {
      totalReviews: 100,
      averageRating: 4.5,
      ratingDistribution: { 5: 50, 4: 30, 3: 10, 2: 5, 1: 5 },
    };
    renderWithStore({ analyticsStatus: "succeeded", analytics });

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });
});
