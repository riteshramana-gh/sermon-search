export interface SearchResult {
  start_idx: number;
  end_idx: number;
  indices: number[];
  source_type: "sermon" | "book";
  source_file: string;
  chunk_id: string;
  text: string;
  start: string | null;
  end: string | null;
  video_url: string | null;
  book_url: string | null;
  cross_score: number;
  adjusted_score: number;
}

export interface SearchResponse {
  success: boolean;
  data: {
    query: string;
    results: SearchResult[];
  };
}