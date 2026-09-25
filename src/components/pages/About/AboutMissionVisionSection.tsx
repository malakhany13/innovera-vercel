import { Eye, Target } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useAboutPageContent } from "./AboutSeedContext";
import { getCourseImage } from "@/src/lib/directus";
import { FALLBACK_MISSION, FALLBACK_VISION, getAboutIcon } from "./constants";

export default function AboutMissionVisionSection() {
  const aboutPage = useAboutPageContent();
  const mission = aboutPage?.mission ?? FALLBACK_MISSION;
  const vision = aboutPage?.vision ?? FALLBACK_VISION;

  const MissionIcon = getAboutIcon(mission.icon, Target);
  const VisionIcon = getAboutIcon(vision.icon, Eye);

  const missionImage = useMemo(
    () => getCourseImage(mission.image) ?? FALLBACK_MISSION.image!,
    [mission.image],
  );
  const visionImage = useMemo(
    () => getCourseImage(vision.image) ?? FALLBACK_VISION.image!,
    [vision.image],
  );

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-3xl overflow-hidden shadow-xl min-h-[400px]"
          >
            <Image
              src={missionImage}
              alt={mission.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/80 to-brand-navy/30" />
            <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[400px]">
              <div className="w-16 h-16 bg-brand-cyan rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <MissionIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">{mission.title}</h2>
              <p className="text-white/90 text-lg leading-relaxed">{mission.description}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative rounded-3xl overflow-hidden shadow-xl min-h-[400px]"
          >
            <Image
              src={visionImage}
              alt={vision.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/80 to-brand-navy/30" />
            <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[400px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <VisionIcon className="w-8 h-8 text-brand-navy" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">{vision.title}</h2>
              <p className="text-white/90 text-lg leading-relaxed">{vision.description}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
