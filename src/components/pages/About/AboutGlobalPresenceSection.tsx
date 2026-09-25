import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useAboutPageContent } from "./AboutSeedContext";
import { FALLBACK_COURSE_IMAGE_ALT, getCourseImage } from "@/lib/directus";
import { FALLBACK_OFFICES, FALLBACK_SECTION_HEADERS } from "./constants";

export default function AboutGlobalPresenceSection() {
  const aboutPage = useAboutPageContent();
  const header =
    aboutPage?.sectionHeaders.global_presence ?? FALLBACK_SECTION_HEADERS.global_presence;
  const offices = aboutPage?.offices.length ? aboutPage.offices : FALLBACK_OFFICES;

  return (
    <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-cyan blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            {header.title}
          </h2>
          <p className="text-white max-w-2xl mx-auto text-lg">{header.description}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {offices.map((office, idx) => (
            <motion.div
              key={office.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-5 mb-8">
                <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      office.image
                        ? getCourseImage(office.image, { width: 256 })
                        : FALLBACK_COURSE_IMAGE_ALT
                    }
                    alt={office.city || office.country || "Office"}
                    className="h-full w-full rounded-full object-cover border-2 border-brand-cyan relative z-10"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_COURSE_IMAGE_ALT;
                    }}
                  />
                  <div className="absolute inset-0 bg-brand-cyan rounded-full blur animate-pulse opacity-50 z-0" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {office.country}
                  </h3>
                  <p className="text-brand-cyan font-medium text-sm tracking-wide uppercase mt-1">
                    {office.city}
                    {office.type ? (
                      <>
                        <span className="text-white/40 px-2">•</span>
                        {office.type}
                      </>
                    ) : null}
                  </p>
                </div>
              </div>

              <div className="space-y-5 text-white/90 flex-1">
                {office.address ? (
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-brand-cyan/20 transition-colors">
                      <MapPin className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <span className="leading-relaxed text-sm pt-1">{office.address}</span>
                  </div>
                ) : null}
                {office.phone ? (
                  <div className="flex items-center gap-4 group/item">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-brand-cyan/20 transition-colors">
                      <Phone className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <span className="text-sm font-medium">{office.phone}</span>
                  </div>
                ) : null}
                {office.email ? (
                  <div className="flex items-center gap-4 group/item">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-brand-cyan/20 transition-colors">
                      <Mail className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <a
                      href={`mailto:${office.email}`}
                      className="text-sm font-medium hover:text-brand-cyan transition-colors"
                    >
                      {office.email}
                    </a>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
