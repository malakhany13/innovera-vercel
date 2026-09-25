import { Calendar, X } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import ModalShell from "./ModalShell";
import { FALLBACK_NEWS_IMAGE } from "@/lib/content-images";
import type { ContentArticle } from "@/src/types/content";

interface ArticleDetailModalProps {
  article: ContentArticle | null;
  onClose: () => void;
  closeLabel?: string;
}

export default function ArticleDetailModal({
  article,
  onClose,
  closeLabel = "Close Article",
}: ArticleDetailModalProps) {
  return (
    <ModalShell isOpen={!!article} onClose={onClose}>
      {article && (
        <>
          <div className="h-64 sm:h-80 relative shrink-0">
            <OptimizedImage
              src={article.image || FALLBACK_NEWS_IMAGE}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              referrerPolicy="no-referrer"
              fallbackSrc={FALLBACK_NEWS_IMAGE}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-brand-cyan text-white text-xs font-bold rounded-full shadow-sm">
                  {article.category}
                </span>
                <span className="text-sm text-slate-200 flex items-center gap-1 font-medium">
                  <Calendar className="w-4 h-4" /> {article.date}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                {article.title}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-10 overflow-y-auto">
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">{article.excerpt}</p>
              <div className="w-12 h-1 bg-brand-cyan mb-6 rounded-full"></div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{article.content}</p>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 flex items-center justify-end shrink-0 bg-slate-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 bg-white"
            >
              {closeLabel}
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}
