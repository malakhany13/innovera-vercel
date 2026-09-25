import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { heroImages } from "@/constants";
import { getCourseImage } from "@/lib/directus";
import { useHomePageContent } from "./HomeSeedContext";

export default function HomeHeroSection() {
  const homePage = useHomePageContent();
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const images = useMemo(() => {
    const slides = homePage?.heroSlides ?? [];
    const fromApi = slides.map((slide) => getCourseImage(slide.image, { width: 1920 }));
    return fromApi.length > 0 ? fromApi : heroImages;
  }, [homePage?.heroSlides]);

  useEffect(() => {
    setCurrentHeroImage(0);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  const activeSlide = homePage?.heroSlides[currentHeroImage];

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={images[currentHeroImage]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentHeroImage]}
              alt={activeSlide?.title ?? "Technology Background"}
              fill
              priority={currentHeroImage === 0}
              sizes="100vw"
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)] animate-pulse z-10 mix-blend-screen"
          style={{ animationDuration: "4s" }}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6"
          >
            Empowering Talent, <br />
            <span className="text-brand-cyan">Shaping The Future</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-200 mb-10 max-w-xl leading-relaxed"
          >
            A Pan-Arab innovator specializing in advanced digital solutions, artificial intelligence applications, transformative training, and intelligent outsourcing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-cyan text-white font-bold rounded-full hover:bg-cyan-500 transition-all shadow-lg shadow-brand-cyan/20"
            >
              Explore Academy <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
