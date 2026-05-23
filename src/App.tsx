import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchQueryAPI, type SearchResultItem } from "./services/api";

export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Core Search & Pagination States
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Metadata Filter States
  const [selectedTypes, setSelectedTypes] = useState<("sermon" | "book" | "article")[]>([]);
  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");

  // Helper utility to parse YYYYMMDD to a human-friendly string
  const formatSermonDate = (dateStr?: string) => {
    if (!dateStr || dateStr.length !== 8) return "";
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = parseInt(month, 10) - 1;
    return `${months[monthIndex] ?? month} ${day}, ${year}`;
  };

  // Toggle utility for checkbox filter updates
  const handleTypeToggle = (type: "sermon" | "book" | "article") => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Triggered on entirely fresh entries or parameter/filter toggles
  const handleInitialSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      const response = await searchQueryAPI({
        query: query.trim(),
        page: 1,
        page_size: 5,
        types: selectedTypes,
        start_year: startYear ? parseInt(startYear, 10) : null,
        end_year: endYear ? parseInt(endYear, 10) : null,
      });

      if (response.success && response.data) {
        setResults(response.data.results);
        setHasMore(response.data.has_more);
      } else {
        setError(response.error || "The backend returned an unexpected status failure.");
        setResults([]);
        setHasMore(false);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to connect to the backend API server. Verify it is running.");
      setResults([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Triggered specifically when the user clicks "Load More Results"
  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;

    try {
      const response = await searchQueryAPI({
        query: query.trim(),
        page: nextPage,
        page_size: 5,
        types: selectedTypes,
        start_year: startYear ? parseInt(startYear, 10) : null,
        end_year: endYear ? parseInt(endYear, 10) : null,
      });

      if (response.success && response.data) {
        setResults((prev) => [...prev, ...response.data!.results]);
        setCurrentPage(nextPage);
        setHasMore(response.data.has_more);
      } else {
        setError(response.error || "Failed to parse subsequent paginated records.");
      }
    } catch (err) {
      console.error(err);
      setError("Network timeout encountered while attempting to fetch more blocks.");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically fetch fresh elements if any core filter parameters change post-search execution
  useEffect(() => {
    if (hasSearched && query.trim()) {
      handleInitialSearch();
    }
  }, [selectedTypes, startYear, endYear]);

  return (
    /* Outer Wide Paint Canvas - This forces color to bleed all the way to the screen margins */
    <div className={`w-full min-h-screen font-sans antialiased selection:bg-neutral-200 transition-colors duration-300 ${
      isDarkMode ? "bg-neutral-950 text-neutral-100" : "bg-[#FBFBFB] text-[#1C1C1C]"
    }`}>
      
      {/* Floating Theme Utility Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium shadow-xs transition-all duration-200 active:scale-95 ${
            isDarkMode 
              ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white" 
              : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
          }`}
        >
          {isDarkMode ? (
            <>
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 17.95a1 1 0 011.414 0l.707-.707a1 1 0 01-1.414-1.414l-.707.707a1 1 0 010 1.414zm2.121-14.142a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd"/>
              </svg>
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Centered Master Modern Container */}
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Hero Branding Header - Hardcoded Fallback Overrides for Light Mode Visibility */}
        <header className="mb-12 text-center">
          <h1 
            className={`text-4xl font-bold tracking-tight transition-colors duration-200`}
            style={{ color: isDarkMode ? "#ffffff" : "#111827" }}
          >
            Sermon Search
          </h1>
          
        </header>

        {/* Perplexity-Inspired Search Bar Container */}
        <form onSubmit={handleInitialSearch} className={`relative mb-8 border shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden transition-all duration-200 ${
          isDarkMode 
            ? "bg-neutral-900 border-neutral-800 focus-within:border-neutral-700 focus-within:shadow-[0_4px_12px_rgba(0,0,0,0.2)]" 
            : "bg-white border-neutral-200 focus-within:border-neutral-400 focus-within:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
        }`}>
          <input
            type="text"
            className={`w-full px-5 py-4 text-base bg-transparent focus:outline-none pr-16 ${
              isDarkMode ? "text-white placeholder-neutral-500" : "text-neutral-900 placeholder-neutral-400"
            }`}
            placeholder="Ask anything or enter a theological query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading && currentPage === 1}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium active:scale-95 transition-all disabled:scale-100 ${
                isDarkMode 
                  ? "bg-white text-neutral-950 hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600" 
                  : "bg-neutral-950 text-white hover:bg-neutral-800 disabled:bg-neutral-300"
              }`}
            >
              {isLoading && currentPage === 1 ? "..." : "Search"}
            </button>
          </div>
        </form>

        {/* Linear/Modular Filter UI Panel */}
        <div className={`border rounded-xl p-5 mb-8 transition-colors ${
          isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Filter Group A: Checkbox Types Matrix Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Resource Constraints
              </label>
              <div className="flex flex-wrap gap-3">
                {(["sermon", "book", "article"] as const).map((type) => {
                  const isChecked = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeToggle(type)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all duration-150 ${
                        isChecked
                          ? isDarkMode 
                            ? "bg-white border-white text-neutral-950 shadow-sm" 
                            : "bg-neutral-950 border-neutral-950 text-white shadow-sm"
                          : isDarkMode 
                            ? "bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200" 
                            : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {type === "sermon" ? "Sermons Only" : type === "book" ? "Books Only" : "Articles Only"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group B: Year Inputs Segment */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Sermon Horizon Date Range
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Start Year"
                  className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:border-neutral-400 transition-colors ${
                    isDarkMode 
                      ? "bg-neutral-800 border-neutral-700 text-white" 
                      : "bg-neutral-50 border-neutral-200 focus:bg-white"
                  }`}
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                />
                <span className="text-neutral-400 text-xs">—</span>
                <input
                  type="number"
                  placeholder="End Year"
                  className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:border-neutral-400 transition-colors ${
                    isDarkMode 
                      ? "bg-neutral-800 border-neutral-700 text-white" 
                      : "bg-neutral-50 border-neutral-200 focus:bg-white"
                  }`}
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Error Handling Module */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl text-xs text-red-700 font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streamed Result Feed */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {results.map((item, idx) => (
              <motion.article
                key={`${item.chunk_id}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.04, 0.2) }}
                /* FIX 3: Changed from items-start to sm:items-center to lock left media to vertical center */
                className={`border rounded-xl p-5 flex flex-col sm:flex-row gap-5 sm:items-center transition-all duration-150 ${
                  isDarkMode 
                    ? "bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-[0_2px_8px_rgba(0,0,0,0.2)]" 
                    : "bg-white border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-neutral-300"
                }`}
              >
                
                {/* Unified Visual Sidebar Component */}
                <div className={`w-full sm:w-40 h-28 rounded-lg overflow-hidden shrink-0 relative border shadow-xs flex items-center justify-center group transition-colors ${
                  isDarkMode ? "bg-neutral-950 border-neutral-800" : "bg-neutral-50 border-neutral-200/70"
                }`}>
                  {item.source_type === "sermon" ? (
                    item.thumbnail_url && item.thumbnail_url.trim() !== "" ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.display_name}
                        loading="lazy"
                        className="w-full h-full object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col items-center justify-center p-3 text-center">
                        <svg className="w-7 h-7 text-amber-500 mb-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest">Sermon Media</span>
                      </div>
                    )
                  ) : item.source_type === "book" ? (
                    /* FIX 1: Explicitly refined clean typography string mapping */
                    <div className={`w-full h-full flex flex-col items-center justify-center p-3 text-center transition-colors ${
                      isDarkMode ? "bg-indigo-950/40" : "bg-gradient-to-br from-indigo-50 to-neutral-100"
                    }`}>
                      <svg className="w-6 h-6 text-indigo-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Book</span>
                    </div>
                  ) : (
                    /* FIX 1: Explicitly refined clean typography string mapping */
                    <div className={`w-full h-full flex flex-col items-center justify-center p-3 text-center transition-colors ${
                      isDarkMode ? "bg-emerald-950/40" : "bg-gradient-to-br from-emerald-50 to-neutral-100"
                    }`}>
                      <svg className="w-6 h-6 text-emerald-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Article</span>
                    </div>
                  )}
                </div>

                {/* CONTENT BLOCK CONTAINER */}
                <div className="flex-1 flex flex-col w-full">
                  
                  {/* SERMON RENDERING SUB-PROFILE */}
                  {item.source_type === "sermon" && (
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-amber-500 mb-1.5">
                        <span>Sermon Payload</span>
                        {item.date && <span className="text-neutral-500 font-normal">•</span>}
                        <span className="text-neutral-400 normal-case font-medium">
                          {formatSermonDate(item.date)}
                        </span>
                      </div>
                      <h3 className={`text-base font-semibold mb-2 tracking-tight leading-snug ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                        {item.display_name}
                      </h3>
                      {item.start && item.end && (
                        <div className="text-neutral-500 text-[11px] font-mono mb-2.5">
                          Timestamps: [{item.start.split(".")[0]} → {item.end.split(".")[0]}]
                        </div>
                      )}
                      <p className={`text-sm leading-relaxed font-normal p-3 rounded-lg border italic ${
                        isDarkMode ? "bg-neutral-950 border-neutral-800 text-neutral-300" : "bg-neutral-50/70 border-neutral-100/60 text-neutral-600"
                      }`}>
                        "{item.text}"
                      </p>
                    </div>
                  )}

                  {/* BOOK RENDERING SUB-PROFILE */}
                  {item.source_type === "book" && (
                    <div>
                      <div className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 mb-1.5">
                        Book Module
                      </div>
                      <h3 className={`text-base font-semibold mb-2 tracking-tight leading-snug ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                        {item.display_name}
                      </h3>
                      <p className={`text-sm leading-relaxed font-normal p-3 rounded-lg border ${
                        isDarkMode ? "bg-neutral-950 border-neutral-800 text-neutral-300" : "bg-neutral-50/70 border-neutral-100/60 text-neutral-600"
                      }`}>
                        {item.text}
                      </p>
                    </div>
                  )}

                  {/* ARTICLE RENDERING SUB-PROFILE */}
                  {item.source_type === "article" && (
                    <div>
                      <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 mb-1.5">
                        Article Entry
                      </div>
                      <h3 className={`text-base font-semibold mb-2 tracking-tight leading-snug ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                        {item.display_name}
                      </h3>
                      <p className={`text-sm leading-relaxed font-normal p-3 rounded-lg border ${
                        isDarkMode ? "bg-neutral-950 border-neutral-800 text-neutral-300" : "bg-neutral-50/70 border-neutral-100/60 text-neutral-600"
                      }`}>
                        {item.text}
                      </p>
                    </div>
                  )}

                  {/* BOTTOM ACTION FOOTER LINK ROW */}
                  <div className={`mt-4 pt-3 border-t flex justify-between items-center ${isDarkMode ? "border-neutral-800" : "border-neutral-100/80"}`}>
                    <span className="text-[11px] font-mono text-neutral-500">Score: {item.adjusted_score ?? item.cross_score}</span>
                    
                    {item.source_type === "sermon" && item.video_url && (
                      <a
                        href={item.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium shadow-2xs active:scale-95 transition-all ${
                          isDarkMode 
                            ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700 hover:text-white" 
                            : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
                        }`}
                      >
                        Watch on YouTube
                      </a>
                    )}

                    {(item.source_type === "book" || item.source_type === "article") && item.book_url && (
                      <a
                        href={item.book_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium shadow-2xs active:scale-95 transition-all ${
                          isDarkMode 
                            ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700 hover:text-white" 
                            : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
                        }`}
                      >
                        Open {item.source_type === "book" ? "Book" : "Article"}
                      </a>
                    )}
                  </div>

                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty States Fallback */}
        {hasSearched && results.length === 0 && !isLoading && (
          <div className={`text-center py-16 border rounded-xl mt-6 shadow-2xs ${isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}>
            <p className="text-sm font-medium text-neutral-500">No semantic results mapped to current constraints.</p>
            <p className="text-xs text-neutral-400 mt-1">Try widening the year parameters or enabling alternate index types.</p>
          </div>
        )}

        {/* Paginated Loader Action */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleLoadMore}
              className={`px-6 py-2.5 border rounded-xl text-xs font-medium tracking-tight shadow-3xs transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 ${
                isDarkMode 
                  ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white" 
                  : "bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800"
              }`}
            >
              {isLoading ? "Loading Next Blocks..." : "Load More Results"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}