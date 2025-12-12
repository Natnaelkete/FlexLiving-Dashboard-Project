import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reviewsReducer from '../store/reviewsSlice';
import filtersReducer from '../store/filtersSlice';
import { ReviewsTable } from '../components/ReviewsTable';

// Mock API
jest.mock('../lib/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: { data: [], meta: { total: 0 } } })),
  patch: jest.fn(() => Promise.resolve({ data: { data: {} } })),
}));

const renderWithProviders = (component: React.ReactNode) => {
  const store = configureStore({
    reducer: {
      reviews: reviewsReducer,
      filters: filtersReducer,
    },
  });
  return render(<Provider store={store}>{component}</Provider>);
};

describe('ReviewsTable', () => {
  it('renders loading state initially', () => {
    renderWithProviders(<ReviewsTable />);
    expect(screen.getByText(/Loading reviews/i)).toBeInTheDocument();
  });

  // More tests would go here, mocking the store state to show data
});
