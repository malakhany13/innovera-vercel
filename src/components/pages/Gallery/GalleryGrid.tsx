import { Folder } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { albums } from "@/src/constants";

const GALLERY_FALLBACK =
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800";

interface GalleryGridProps {
  activeAlbum: string | null;
  onSelectAlbum: (albumId: string) => void;
}

export default function GalleryGrid({ activeAlbum, onSelectAlbum }: GalleryGridProps) {
  const selectedAlbum = activeAlbum ? albums.find((a) => a.id === activeAlbum) : null;

  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="wait">
        {!selectedAlbum
          ? albums.map((album, idx) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                onClick={() => onSelectAlbum(album.id)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] bg-slate-200 shadow-sm"
              >
                <OptimizedImage
                  src={album.cover}
                  alt={album.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading={idx === 0 ? undefined : "lazy"}
                  referrerPolicy="no-referrer"
                  fallbackSrc={GALLERY_FALLBACK}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Folder className="w-6 h-6 text-brand-cyan" />
                    <span className="text-brand-cyan font-bold text-sm tracking-widest uppercase">{album.images.length} Photos</span>
                  </div>
                  <h3 className="text-white font-display font-medium text-2xl">{album.title}</h3>
                </div>
              </motion.div>
            ))
          : selectedAlbum.images.map((image, idx) => (
              <motion.div
                key={image.url + idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="relative group overflow-hidden rounded-2xl aspect-[4/3] bg-slate-200 shadow-sm"
              >
                <OptimizedImage
                  src={image.url}
                  alt={image.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  referrerPolicy="no-referrer"
                  fallbackSrc={GALLERY_FALLBACK}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                  <h3 className="text-white font-display font-medium text-lg">{image.title}</h3>
                </div>
              </motion.div>
            ))}
      </AnimatePresence>
    </motion.div>
  );
}
