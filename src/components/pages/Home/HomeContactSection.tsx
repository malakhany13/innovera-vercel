import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import { CONTACT_PHOTOS } from "./constants";

export default function HomeContactSection() {
  return (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">Get In Touch</h2>
            <h3 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-brand-navy">
              Let's Shape The Future Together
            </h3>
            <p className="text-slate-600 mb-10 text-lg">
              Whether you're looking for advanced digital solutions, cybersecurity, or professional training, our team is ready to help.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-brand-cyan" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                <p className="text-sm text-slate-500">info@innoveracorp.com</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-brand-cyan" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                <p className="text-sm text-slate-500">+20 10 70008672</p>
              </motion.div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div
              className="absolute -inset-8 bg-brand-cyan/5 rounded-[3rem] -z-10 transform rotate-3 animate-pulse"
              style={{ animationDuration: "4s" }}
            />
            <div
              className="absolute -inset-8 bg-brand-navy/5 rounded-[3rem] -z-10 transform -rotate-3 animate-pulse"
              style={{ animationDuration: "5s" }}
            />
            <div className="space-y-4 mt-8">
              {CONTACT_PHOTOS.slice(0, 2).map((photo, idx) => (
                <motion.div
                  key={photo.alt}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative w-full ${photo.className} rounded-[2rem] shadow-lg overflow-hidden`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
            <div className="space-y-4">
              {CONTACT_PHOTOS.slice(2).map((photo, idx) => (
                <motion.div
                  key={photo.alt}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx + 2) * 0.1 }}
                  className={`relative w-full ${photo.className} rounded-[2rem] shadow-lg overflow-hidden`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
