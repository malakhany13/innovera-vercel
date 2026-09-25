import { Calendar, ExternalLink, MapPin, X } from "lucide-react";
import OptimizedImage from "@/src/components/ui/OptimizedImage";
import ModalShell from "@/src/components/ui/ModalShell";
import { FALLBACK_EVENT_IMAGE } from "@/lib/content-images";
import type { ContentEvent } from "@/src/types/content";

interface EventDetailModalProps {
  event: ContentEvent | null;
  onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  return (
    <ModalShell isOpen={!!event} onClose={onClose}>
      {event && (
        <>
          <div className="h-64 sm:h-80 relative shrink-0">
            <OptimizedImage
              src={event.image || FALLBACK_EVENT_IMAGE}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              referrerPolicy="no-referrer"
              fallbackSrc={FALLBACK_EVENT_IMAGE}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-brand-cyan text-white text-xs font-bold rounded-full shadow-sm">
                  {event.category}
                </span>
                <span className="text-sm text-slate-200 flex items-center gap-1 font-medium">
                  <Calendar className="w-4 h-4" /> {event.date}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-2">
                {event.title}
              </h2>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <MapPin className="w-4 h-4 text-brand-cyan" />
                {event.location}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 overflow-y-auto">
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
                {event.description}
              </p>
              <div className="w-12 h-1 bg-brand-cyan mb-6 rounded-full"></div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-8">
                {event.content}
              </p>

              {event.link !== "#" && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-navy text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Visit Event Website <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 flex items-center justify-end shrink-0 bg-slate-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 bg-white"
            >
              Close
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}
