import { render, screen } from '@testing-library/react';
import PropertyPage from '../app/(public)/properties/[id]/page';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  })
) as jest.Mock;

describe('PropertyPage', () => {
  it('renders property details', async () => {
    const jsx = await PropertyPage({ params: { id: '1' } });
    render(jsx);
    expect(screen.getByText(/Property 1 Hero Image/i)).toBeInTheDocument();
  });

  it('fetches and displays reviews', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            id: '101',
            guestName: 'John Doe',
            submittedAt: '2023-01-01',
            overallRating: 5,
            publicText: 'Great stay!',
          }
        ]
      }),
    });

    const jsx = await PropertyPage({ params: { id: '1' } });
    render(jsx);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great stay!')).toBeInTheDocument();
  });
});
