import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Body Interface matching backend contract exactly
export interface SearchRequestParams {
  query: string;
  start_year?: number | null;
  end_year?: number | null;
  types?: ("sermon" | "book" | "article")[];
  page?: number;
  page_size?: number;
}

// Single Result Payload Item Interface
export interface SearchResultItem {
  start_idx: number;
  end_idx: number;
  indices: number[];
  source_type: "sermon" | "book" | "article";
  source_file: string;
  display_name: string; // Used strictly for UI titles now
  date?: string;         // Format: YYYYMMDD
  chunk_id: number;
  text: string;
  start?: string;        // HH:MM:SS.mmm
  end?: string;          // HH:MM:SS.mmm
  video_url?: string | null;
  thumbnail_url?: string | null;
  book_url?: string | null;
  cross_score: number;
  adjusted_score: number;
}

// Full Response Envelope Interface
export interface SearchResponseEnvelope {
  success: boolean;
  error?: string;
  data?: {
    query: string;
    filters: {
      start_year: number | null;
      end_year: number | null;
      allowed_types: ("sermon" | "book" | "article")[];
    };
    page: number;
    page_size: number;
    total_results: number;
    has_more: boolean;
    results: SearchResultItem[];
  };
}

/**
 * Execute the updated POST search request to the backend
 */
export const searchQueryAPI = async (payload: SearchRequestParams): Promise<SearchResponseEnvelope> => {
  // Completely strip out any empty or null filters so the minimal allowed payload is sent cleanly
  const cleanPayload: Record<string, any> = { 
    query: payload.query,
    page: payload.page ?? 1,
    page_size: payload.page_size ?? 5
  };

  if (payload.types && payload.types.length > 0) cleanPayload.types = payload.types;
  if (payload.start_year) cleanPayload.start_year = payload.start_year;
  if (payload.end_year) cleanPayload.end_year = payload.end_year;

  const response = await api.post<SearchResponseEnvelope>("/search", cleanPayload);
  return response.data;
};

export default api;