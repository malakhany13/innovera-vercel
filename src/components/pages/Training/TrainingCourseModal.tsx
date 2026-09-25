import {
  Award,
  Check,
  Clock,
  Code,
  Globe,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import CoursePoweredBy from "@/components/CoursePoweredBy";
import CourseOutlinePdfLink from "@/components/courses/CourseOutlinePdfLink";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { FALLBACK_COURSE_IMAGE_ALT } from "@/lib/directus";
import type { Course } from "./types";

interface TrainingCourseModalProps {
  course: Course | null;
  onClose: () => void;
}

export default function TrainingCourseModal({ course, onClose }: TrainingCourseModalProps) {
  const router = useRouter();

  const closeModal = () => {
    onClose();
  };

  const handleEnroll = () => {
    if (!course) return;
    onClose();
    router.push(`/courses/enroll/${course.id}`);
  };

  return (
    <AnimatePresence>
      {course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100"
          >
            <div className="relative h-44 sm:h-52 shrink-0 overflow-hidden">
              <OptimizedImage
                src={course.image || FALLBACK_COURSE_IMAGE_ALT}
                alt={course.title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                fallbackSrc={FALLBACK_COURSE_IMAGE_ALT}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/30" />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2.5 text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors backdrop-blur-sm"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-brand-cyan text-white text-xs font-bold rounded-full shadow-lg">
                    {course.track}
                  </span>
                  <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                    {course.level}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight pr-12">
                  {course.title}
                </h2>
              </div>
            </div>

            {course.vendor && (
              <div className="px-6 md:px-8 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
                <CoursePoweredBy
                  vendor={course.vendor}
                  logoClassName="h-10 max-w-[120px] object-contain"
                />
              </div>
            )}

            <div className="overflow-y-auto flex-1 p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: Clock, label: "Duration", value: `${course.hours} Hours`, color: "bg-blue-50 text-blue-600" },
                  { icon: Globe, label: "Format", value: course.format, color: "bg-emerald-50 text-emerald-600" },
                  { icon: Award, label: "Credential", value: "Certificate / Badge", color: "bg-purple-50 text-purple-600" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-brand-cyan/30 transition-colors"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                      <p className="font-semibold text-slate-900 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {(course.features?.length ?? 0) > 0 ? (
                <section
                  aria-labelledby="modal-course-features-heading"
                  className="mb-10 rounded-2xl border border-brand-cyan/20 bg-gradient-to-br from-brand-cyan/10 via-white to-white p-6"
                >
                  <h3
                    id="modal-course-features-heading"
                    className="text-lg font-display font-bold text-brand-navy mb-5 flex items-center gap-2"
                  >
                    <Award className="w-5 h-5 text-brand-cyan" />
                    Features
                  </h3>
                  <ul className="space-y-3">
                    {course.features!.map((item, idx) => (
                      <li key={`feature-${idx}`} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand-cyan/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-brand-cyan" />
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {course.whatYouWillCover.length > 0 ? (
                <section
                  aria-labelledby="modal-course-cover-heading"
                  className="mb-10 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6"
                >
                  <h3
                    id="modal-course-cover-heading"
                    className="text-lg font-display font-bold text-brand-navy mb-5 flex items-center gap-2"
                  >
                    <Check className="w-5 h-5 text-brand-cyan" />
                    What you will cover
                  </h3>
                  <ul className="space-y-3">
                    {course.whatYouWillCover.map((item, idx) => (
                      <li key={`cover-${idx}`} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand-cyan/15 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {course.prerequisites.length > 0 ? (
                <section
                  aria-labelledby="modal-course-prerequisites-heading"
                  className="mb-10 rounded-2xl border border-slate-100 bg-slate-50 p-6"
                >
                  <h3
                    id="modal-course-prerequisites-heading"
                    className="text-lg font-display font-bold text-brand-navy mb-4"
                  >
                    Prerequisites
                  </h3>
                  <ul className="space-y-3">
                    {course.prerequisites.map((item, idx) => (
                      <li key={`prereq-${idx}`} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {course.handsOn.length > 0 ? (
                <section
                  aria-labelledby="modal-course-hands-on-heading"
                  className="mb-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <h3
                    id="modal-course-hands-on-heading"
                    className="text-lg font-display font-bold text-brand-navy mb-4 flex items-center gap-2"
                  >
                    <Code className="w-5 h-5 text-brand-cyan" />
                    Hands-on Elements
                  </h3>
                  <ul className="space-y-3">
                    {course.handsOn.map((item, idx) => (
                      <li
                        key={`hands-${idx}`}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/80"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center shrink-0">
                          <Code className="w-4 h-4 text-brand-cyan" />
                        </div>
                        <span className="text-slate-700 text-sm mt-1 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 shrink-0 bg-white">
              <button
                onClick={closeModal}
                className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors order-3 sm:order-1"
              >
                Close Details
              </button>
              <CourseOutlinePdfLink
                attachment={course.attachment ?? course.syllabusPdf ?? null}
                className="order-2"
              />
              <button
                onClick={handleEnroll}
                className="px-8 py-3 text-sm font-bold text-white bg-brand-cyan hover:bg-cyan-500 shadow-lg shadow-brand-cyan/20 rounded-full transition-all hover:-translate-y-0.5 order-1 sm:order-3"
              >
                Enroll Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
