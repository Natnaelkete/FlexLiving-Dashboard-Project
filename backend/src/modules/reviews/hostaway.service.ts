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
        return {
          status: "success",
          result: MOCK_REVIEWS,
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
