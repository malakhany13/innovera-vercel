import NavyPageHero from "@/src/components/ui/NavyPageHero";
import { getCourseImage } from "@/lib/directus";
import type { PartnersPageHero } from "@/features/directus/types";

const FALLBACK_BACKGROUND =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070";

interface PartnersHeroSectionProps {
  hero?: PartnersPageHero | null;
}

export default function PartnersHeroSection({ hero = null }: PartnersHeroSectionProps) {
  const backgroundImage = hero?.backgroundImage
    ? getCourseImage(hero.backgroundImage)
    : FALLBACK_BACKGROUND;

  return (
    <NavyPageHero
      backgroundImage={backgroundImage}
      backgroundAlt={hero?.title || "Partners Background"}
      badge={hero?.badge || "Our Ecosystem"}
      title={
        hero?.title ? (
          <>
            {hero.title}
            {hero.subtitle ? (
              <>
                <br />
                <span className="text-brand-cyan">{hero.subtitle}</span>
              </>
            ) : null}
          </>
        ) : (
          <>
            Partners & <br />
            <span className="text-brand-cyan">Clients.</span>
          </>
        )
      }
      description={
        hero?.description ||
        "Building strong ecosystems through strategic alliances, academic collaborations, and trusted client relationships across the region."
      }
    />
  );
}
