    import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Shield, Users, Zap, Globe, Award, Briefcase, MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

    {/* Our Ecosystem Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">Strategic Integration</h2>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy mb-6">Our Ecosystem</h3>
            <p className="text-lg text-slate-500">Innovera combines integrated digital solutions, transformative learning, and innovation-driven investment to accelerate secure growth across Egypt and the MENA region.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl hover:bg-white hover:border-brand-cyan/30 transition-all group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-brand-navy" />
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-4">Innovera Company</h4>
              <p className="text-slate-500 leading-relaxed">We position Innovera as a regional leader in AI, cybersecurity, and integrated digital solutions, backed by strategic partnerships and a strong focus on measurable transformation.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-brand-navy rounded-[2rem] p-8 shadow-xl text-white group"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform hidden-border">
                <Users className="w-8 h-8 text-brand-cyan" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Innovera Academy</h4>
              <p className="text-slate-300 leading-relaxed">We build future-ready talent through structured AI, software, and cybersecurity training, capacity-building programs, and digital learning solutions for individuals, institutions, and workforces.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl hover:bg-white hover:border-brand-cyan/30 transition-all group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-brand-navy" />
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-4">Innovera Investment</h4>
              <p className="text-slate-500 leading-relaxed">Our venture and innovation arm supports high-potential startups in AI, cybersecurity, analytics, automation, cloud, and digital transformation through early-stage funding, technical guidance, and market access.</p>
            </motion.div>
          </div>
        </div>
      </section>