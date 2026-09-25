import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

      {/* Why Choose Innovera? Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">Our Differentiator</h2>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy">Why Choose Innovera?</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Integrated Tech Leadership",
                desc: "Unmatched expertise in AI, cybersecurity, and digital transformation to navigate today's complex tech landscape.",
                image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Global Strategic Alliances",
                desc: "Strong partnerships with industry giants like NVIDIA and Palo Alto Networks, bringing world-class innovation to your doorstep.",
                image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Security-First Innovation",
                desc: "A future-ready approach that places cybersecurity at the core of every digital solution we build.",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Result-Oriented Partnership",
                desc: "We act as your dedicated growth partner, turning visionary ideas into scalable solutions with measurable business impact.",
                image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group flex flex-col sm:flex-row hover:shadow-xl hover:border-brand-cyan/20 transition-all"
              >
                <div className="sm:w-2/5 md:w-1/3 shrink-0 overflow-hidden relative min-h-[200px]">
                  <Image src={feature.image} alt={feature.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center font-bold text-brand-navy shadow-sm border border-slate-100">
                    0{idx + 1}
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h4 className="text-xl font-bold text-brand-navy mb-3">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>