"use client";

import { useState } from "react";
import GalleryGrid from "./GalleryGrid";
import GalleryHeader from "./GalleryHeader";

export default function Gallery() {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <GalleryHeader showBack={!!activeAlbum} onBack={() => setActiveAlbum(null)} />
        <GalleryGrid activeAlbum={activeAlbum} onSelectAlbum={setActiveAlbum} />
      </div>
    </div>
  );
}
