import axios from "axios";
import type { SearchResponse } from "../types/search";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000" // Connects to local FastAPI
});

export async function searchQuery(query: string, top_n: number = 10): Promise<SearchResponse> {
  const response = await api.get<SearchResponse>("/search", {
    params: {
      query,
      top_n
    }
  });
  return response.data;
}