import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Shield, Users, Zap, Globe, Award, Briefcase, MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';


     {/* Core Values - Bento Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">What Drives Us</h2>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy">Our Core Values</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Integrity", desc: "Building trust through transparency and accountability" },
              { icon: Zap, title: "Innovation", desc: "Turning emerging technologies into measurable impact" },
              { icon: Briefcase, title: "Collaboration", desc: "Building lasting partnerships for shared success" },
              { icon: Award, title: "Excellence", desc: "Delivering with agility, precision, and exceptional quality" }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-cyan/30 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-cyan group-hover:text-white transition-colors">
                  <value.icon className="w-8 h-8 text-brand-cyan group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-brand-navy mb-3">{value.title}</h4>
                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
