import { ArrowRight, Clock, Monitor } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";
import type { Course } from "@/src/api/types";
import CoursePoweredBy from "@/components/CoursePoweredBy";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { FALLBACK_COURSE_IMAGE_ALT } from "@/lib/directus";

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  showArrow?: boolean;
  showDescription?: boolean;
  animationDelay?: number;
  layout?: boolean;
  priority?: boolean;
}

function CourseCard({
  course,
  onClick,
  showArrow = false,
  showDescription = false,
  animationDelay = 0,
  layout = false,
  priority = false,
}: CourseCardProps) {
  return (
    <motion.div
      layout={layout}
      initial={layout ? { opacity: 0, scale: 0.9 } : { opacity: 0, y: 30 }}
      animate={layout ? { opacity: 1, scale: 1 } : undefined}
      whileInView={layout ? undefined : { opacity: 1, y: 0 }}
      exit={layout ? { opacity: 0, scale: 0.9 } : undefined}
      viewport={layout ? undefined : { once: true, margin: "-50px" }}
      transition={{ duration: layout ? 0.3 : 0.5, delay: layout ? 0 : animationDelay }}
      onClick={onClick}
      className={`bg-white rounded-[1.5rem] overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 hover:border-brand-cyan/30 hover:shadow-xl transition-all flex flex-col h-full ${
        onClick ? "cursor-pointer group" : ""
      }`}
    >
      <div className="w-full overflow-hidden h-48 relative shadow-sm bg-slate-100 shrink-0">
        <OptimizedImage
          src={course.image || FALLBACK_COURSE_IMAGE_ALT}
          alt={course.title}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 768px) 100vw, 33vw"
          fallbackSrc={FALLBACK_COURSE_IMAGE_ALT}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {course.isNew ? (
            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow w-fit">
              New
            </span>
          ) : null}
          {course.track && (
            <span className="px-3 py-1 bg-white/95 text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
              {course.track}
            </span>
          )}
          {course.level && (
            <span className="px-3 py-1 bg-brand-cyan text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow w-fit">
              {course.level}
            </span>
          )}
        </div>
        {course.handsOnFlag && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
              Hands-On
            </span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-lg font-display font-bold text-brand-navy mb-2 leading-snug line-clamp-2 group-hover:text-brand-cyan transition-colors">
          {course.title}
        </h3>

        {showDescription && course.whatYouWillCover.length > 0 && (
          <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
            {course.whatYouWillCover.join(", ")}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {course.hours != null && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="text-xs font-medium">{course.hours}h</span>
              </div>
            )}
            {course.format && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Monitor className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="text-xs font-medium">{course.format}</span>
              </div>
            )}
          </div>

          <div className={`flex items-end gap-3 ${showArrow ? "justify-between" : ""}`}>
            <CoursePoweredBy vendor={course.vendor} className="min-w-0 flex-1" />
            {showArrow && (
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-cyan transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(CourseCard);
