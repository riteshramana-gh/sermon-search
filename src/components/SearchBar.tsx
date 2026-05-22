import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchBar({ query, setQuery, onSearch, isLoading }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() !== "") {
      onSearch();
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-center w-full group">
        <Search className="absolute left-4 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-200 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How is the new covenant better than the old covenant?"
          disabled={isLoading}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-14 text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all disabled:opacity-50 shadow-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 w-5 h-5 text-zinc-400 animate-spin" />
        )}
      </div>
    </div>
  );
}