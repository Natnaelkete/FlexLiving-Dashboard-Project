import { z } from "zod";

export const getReviewsSchema = z.object({
  query: z.object({
    listingId: z.string().optional(),
    type: z.enum(["guest-to-host", "host-to-guest"]).optional(),
    status: z.enum(["published", "pending", "rejected"]).optional(),
    minRating: z.coerce.number().min(1).max(5).optional(),
    maxRating: z.coerce.number().min(1).max(5).optional(),
    startDate: z.string().datetime().optional(), // Expect ISO string
    endDate: z.string().datetime().optional(),
    channel: z.string().optional(),
    selectedForPublic: z.enum(["true", "false"]).optional(), // Query params are strings
    search: z.string().optional(),
    sortBy: z.enum(["submittedAt", "overallRating"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const getAnalyticsSchema = z.object({
  query: z.object({
    listingId: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const toggleSelectionSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    selectedForPublic: z.boolean(),
  }),
});

export type GetReviewsQuery = z.infer<typeof getReviewsSchema>["query"];
export type GetAnalyticsQuery = z.infer<typeof getAnalyticsSchema>["query"];
export type ToggleSelectionBody = z.infer<typeof toggleSelectionSchema>["body"];
