import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { ResultCard } from "./components/ResultCard";
import { searchQuery } from "./services/api";
import type { SearchResult } from "./types/search";
import { BookOpen } from "lucide-react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const response = await searchQuery(query);
      setResults(response.data.results);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

// Inside src/App.tsx - Replace your return statement's structural containers:

  return (
  <div className="min-h-screen bg-[#09090b] text-zinc-100 pt-16 pb-24 px-4 sm:px-6 flex flex-col items-center">
    
    {/* Header Section with high contrast */}
    <div className={`transition-all duration-500 w-full max-w-3xl flex flex-col items-center ${hasSearched ? 'mb-8' : 'mt-32 mb-12'}`}>
      <div className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-2xl mb-6 shadow-xl shadow-black/40">
        <BookOpen className="w-7 h-7 text-emerald-400" /> {/* Added a clean accent touch */}
      </div>
      <h1 className="text-4xl font-extrabold text-zinc-50 mb-3 tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
        Sermon Search
      </h1>
      <p className="text-zinc-400 text-center text-base font-medium max-w-md leading-relaxed">
        Search Zac Poonen sermons and writings semantically.
      </p>
    </div>

    <SearchBar 
      query={query} 
      setQuery={setQuery} 
      onSearch={handleSearch} 
      isLoading={isLoading} 
    />

    {/* Main Results Area */}
    <main className="w-full max-w-3xl mt-10 flex flex-col gap-4">
      {isLoading ? (
        <p className="text-zinc-300">Loading...</p>
      ) : error ? (
        <p className="text-rose-400">{error}</p>
      ) : results.length > 0 ? (
        results.map((result, index) => (
          <ResultCard key={index} result={result} index={index} />
        ))
      ) : hasSearched ? (
        <p className="text-zinc-400">No results found.</p>
      ) : null}
    </main>
  </div>
  );
}

export default App;