import Image from "next/image";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useAboutPageContent } from "./AboutSeedContext";
import { getCourseImage } from "@/src/lib/directus";
import { FALLBACK_HERO, FALLBACK_SOCIAL_LINKS, getAboutIcon } from "./constants";
import { Linkedin } from "lucide-react";

export default function AboutHeroSection() {
  const aboutPage = useAboutPageContent();

  const hero = aboutPage?.hero
    ? {
        ...FALLBACK_HERO,
        ...aboutPage.hero,
        primary_image: aboutPage.hero.primary_image ?? FALLBACK_HERO.primary_image,
        secondary_image: aboutPage.hero.secondary_image ?? FALLBACK_HERO.secondary_image,
      }
    : FALLBACK_HERO;
  const socialLinks = aboutPage?.socialLinks?.length ? aboutPage.socialLinks : FALLBACK_SOCIAL_LINKS;

const primaryImage = useMemo(
  () =>
    hero.primary_image
      ? getCourseImage(hero.primary_image)
      : FALLBACK_HERO.primary_image!,
  [hero.primary_image],
);
const secondaryImage = useMemo(
  () =>
    hero.secondary_image
      ? getCourseImage(hero.secondary_image)
      : FALLBACK_HERO.secondary_image!,
  [hero.secondary_image],
);

  return (
    <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-brand-navy mb-6 leading-tight">
              {hero.title} <br />
              <span className="text-brand-cyan">{hero.subtitle}</span>
            </h1>
            <div className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl space-y-4">
              {(hero.paragraphs ?? []).map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = getAboutIcon(social.icon, Linkedin);
                return (
                  <motion.a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-cyan hover:text-white hover:border-brand-cyan transition-all shadow-sm hover:shadow-md"
                    whileHover={{ y: -4 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white aspect-[4/3]">
              <Image
                src={primaryImage}
                alt={hero.title || "Innovera team"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 w-2/3 z-20 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50 aspect-[4/3]">
              <Image
                src={secondaryImage}
                alt={hero.subtitle || "Innovera collaboration"}
                fill
                sizes="(max-width: 768px) 66vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
