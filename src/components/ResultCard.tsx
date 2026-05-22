import { motion } from "framer-motion";
import { Play, FileText, Clock, ExternalLink } from "lucide-react"; // Replaced Youtube with Play
import type { SearchResult } from "../types/search";

interface ResultCardProps {
  result: SearchResult;
  index: number;
}

export function ResultCard({ result, index }: ResultCardProps) {
  const isSermon = result.source_type === "sermon";

  // Clean up source file name for display
  const title = result.source_file.replace(/\.processed\.json$/, "").replace(/\[.*?\]/, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-xl p-6 flex flex-col gap-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${isSermon ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
            {isSermon ? 'Sermon' : 'Article'}
          </span>
          <h3 className="text-zinc-200 font-medium leading-tight">{title}</h3>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
          Score: {result.adjusted_score.toFixed(2)}
        </span>
      </div>

      <p className="text-zinc-300 leading-relaxed text-sm md:text-base font-serif">
        "{result.text}"
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50 mt-auto">
        {isSermon ? (
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="w-4 h-4" />
            <span>{result.start?.split('.')[0]} - {result.end?.split('.')[0]}</span>
          </div>
        ) : (
          <div /> // Spacer for flex alignment
        )}

        <a
          href={isSermon ? (result.video_url || '#') : (result.book_url || '#')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors"
        >
          {isSermon ? (
            <>
              <Play className="w-4 h-4 text-red-500 fill-red-500/20" /> {/* Clean, supported Play icon */}
              Watch on YouTube
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-blue-500" />
              Open Article
              <ExternalLink className="w-3 h-3 ml-1 text-zinc-400" />
            </>
          )}
        </a>
      </div>
    </motion.div>
  );
}