import axios from "axios";
import { HostawayResponse, HostawayReview } from "./hostaway.types";
import { MOCK_REVIEWS } from "./hostaway.mock";

export class HostawayService {
  private accountId: string;
  private apiKey: string;
  private baseUrl = "https://api.hostaway.com/v1";
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.accountId = process.env.HOSTAWAY_ACCOUNT_ID || "";
    this.apiKey = process.env.HOSTAWAY_API_KEY || "";
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", this.accountId);
      params.append("client_secret", this.apiKey);
      params.append("scope", "general");

      const response = await axios.post(
        `${this.baseUrl}/accessTokens`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.token = response.data.access_token;
      // Set expiry to slightly less than actual expiry (usually 3600s)
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
      return this.token!;
    } catch (error) {
      console.error("Failed to authenticate with Hostaway:", error);
      throw new Error("Hostaway authentication failed");
    }
  }

  private filterMockReviews(
    reviews: HostawayReview[],
    params: any
  ): HostawayReview[] {
    let filtered = reviews.filter((review) => {
      // Search Filter
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        const matchesSearch =
          review.guestName?.toLowerCase().includes(searchLower) ||
          review.listingName?.toLowerCase().includes(searchLower) ||
          review.publicReview?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Rating Filter
      if (
        params.minRating &&
        (review.rating === null || review.rating < Number(params.minRating))
      )
        return false;
      if (
        params.maxRating &&
        (review.rating === null || review.rating > Number(params.maxRating))
      )
        return false;

      // Date Filter
      if (params.startDate) {
        const reviewDate = new Date(review.submittedAt);
        const startDate = new Date(params.startDate);
        if (reviewDate < startDate) return false;
      }
      if (params.endDate) {
        const reviewDate = new Date(review.submittedAt);
        const endDate = new Date(params.endDate);
        if (reviewDate > endDate) return false;
      }

      return true;
    });

    // Sorting
    if (params.sortBy) {
      filtered.sort((a, b) => {
        let valA: any = a[params.sortBy as keyof HostawayReview];
        let valB: any = b[params.sortBy as keyof HostawayReview];

        if (params.sortBy === "date") {
          valA = new Date(a.submittedAt).getTime();
          valB = new Date(b.submittedAt).getTime();
        } else if (params.sortBy === "rating") {
          valA = a.rating || 0;
          valB = b.rating || 0;
        }

        if (valA < valB) return params.sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return params.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  async fetchReviews(params: any): Promise<HostawayResponse> {
    try {
      const token = await this.getAccessToken();

      // Build query parameters
      const queryParams: any = {};
      if (params.listingId) queryParams.listingId = params.listingId;
      // Add limit/offset if needed
      queryParams.limit = params.limit || 100;

      const response = await axios.get<HostawayResponse>(
        `${this.baseUrl}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
          params: queryParams,
        }
      );

      // Fallback to mock data if API returns empty (Sandbox environment)
      if (!response.data.result || response.data.result.length === 0) {
        console.log("Hostaway API returned no reviews. Using mock data.");
        const filteredMock = this.filterMockReviews(MOCK_REVIEWS, params);
        return {
          status: "success",
          result: filteredMock,
        };
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching Hostaway reviews:", error);
      // Return empty result on error to prevent crash
      return {
        status: "error",
        result: [],
      };
    }
  }

  async fetchListings(): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${this.baseUrl}/listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Hostaway listings:", error);
      return { status: "error", result: [] };
    }
  }
}
