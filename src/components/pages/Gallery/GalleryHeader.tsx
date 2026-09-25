import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface GalleryHeaderProps {
  showBack: boolean;
  onBack: () => void;
}

export default function GalleryHeader({ showBack, onBack }: GalleryHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-brand-navy">Gallery</h1>
      <p className="text-brand-gray max-w-2xl mx-auto text-lg mb-10">
        A glimpse into our workspaces, events, and technological infrastructure.
      </p>

      {showBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="inline-flex items-center gap-2 text-brand-cyan font-medium hover:text-brand-navy transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Albums
        </motion.button>
      )}
    </div>
  );
}
