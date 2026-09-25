import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Target, Eye, Shield, Users, Zap, Globe, Award, Briefcase, MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { offices, socialLinks } from '@/constants';
      {/* Global Presence & Contact */}
      <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-cyan blur-[120px]"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">Our Global Presence</h2>
            <p className="text-white max-w-2xl mx-auto text-lg">Find us in key locations across the Middle East. We are always ready to connect and collaborate.</p>
          </div>

          {/* Offices Selection Row */}
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative h-16 w-16 shrink-0">
                    <Image src={office.image} alt={office.city} fill sizes="64px" className="rounded-full object-cover border-2 border-brand-cyan relative z-10" />
                    <div className="absolute inset-0 bg-brand-cyan rounded-full blur animate-pulse opacity-50 z-0"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white">{office.country}</h3>
                    <p className="text-brand-cyan font-medium text-sm tracking-wide uppercase mt-1">
                      {office.city} <span className="text-white/40 px-2">•</span> {office.type}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-5 text-white/90 flex-1">
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-brand-cyan/20 transition-colors">
                      <MapPin className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <span className="leading-relaxed text-sm pt-1">{office.address}</span>
                  </div>
                  <div className="flex items-center gap-4 group/item">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-brand-cyan/20 transition-colors">
                      <Phone className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <span className="text-sm font-medium">{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-4 group/item">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-brand-cyan/20 transition-colors">
                      <Mail className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <a href={`mailto:${office.email}`} className="text-sm font-medium hover:text-brand-cyan transition-colors">{office.email}</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>