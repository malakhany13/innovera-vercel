import { ArrowRight, Award as AwardIcon, CheckCircle2, Eye, Target } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";
import { useHomePageContent } from "./HomeSeedContext";
import { getCourseImage } from "@/src/lib/directus";

const FALLBACK_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200";

export default function HomeAboutSection() {
  const homePage = useHomePageContent();

  const aboutImage = useMemo(() => {
    const section = homePage?.sectionImages.find(
      (item) => item.sectionKey === "about",
    );
    return section?.image
      ? getCourseImage(section.image)
      : FALLBACK_ABOUT_IMAGE;
  }, [homePage?.sectionImages]);

  const aboutImageAlt = useMemo(() => {
    const section = homePage?.sectionImages.find(
      (item) => item.sectionKey === "about",
    );
    return section?.title ?? "Innovera Team";
  }, [homePage?.sectionImages]);

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">Who We Are</h2>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy mb-8 leading-tight">
              Empowering Talent. <br />
              <span className="text-brand-cyan">Shaping The Future.</span>
            </h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Innovera is a Pan-Arab innovator headquartered in Egypt, with a growing regional presence. We specialize in advanced digital solutions, artificial intelligence applications, transformative training, and intelligent outsourcing to drive measurable impact.
            </p>

            <div className="grid sm:grid-cols-1 gap-8 mb-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-brand-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy mb-2">Our Mission</h4>
                  <p className="text-sm text-slate-500 max-w-md">
                    Delivering innovative AI-driven digital solutions, world-class cybersecurity training, and strategic workforce services that empower individuals and organizations.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6 text-brand-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy mb-2">Our Vision</h4>
                  <p className="text-sm text-slate-500 max-w-md">
                    To be the smartest regional platform enabling organizations to lead digital transformation, AI adoption, and cybersecurity readiness confidently.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                <span className="text-sm font-medium text-slate-700">ISO 9001 Certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                <span className="text-sm font-medium text-slate-700">Global Tech Partners</span>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-navy text-white rounded-full font-medium hover:bg-slate-800 transition-colors text-sm"
            >
              Read More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-cyan/10 rounded-[3rem] transform rotate-3 -z-10" />
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src={aboutImage}
                alt={aboutImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-cyan rounded-xl flex items-center justify-center">
                      <AwardIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Excellence in Tech</p>
                      <p className="text-brand-navy font-bold">Award Winning Solutions 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
