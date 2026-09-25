     import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Target, Eye, Shield, Users, Zap, Globe, Award, Briefcase, MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { offices, socialLinks } from '@/constants';
     {/* Mission & Vision - Image Cards */}
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
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000"
                alt="Our Mission"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/80 to-brand-navy/30"></div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[400px]">
                <div className="w-16 h-16 bg-brand-cyan rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-4">Our Mission</h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Delivering innovative AI-driven digital solutions, world-class cybersecurity training, and strategic workforce services that empower individuals and organizations to excel, adapt, and grow in a rapidly evolving market.
                </p>
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
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000"
                alt="Our Vision"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/80 to-brand-navy/30"></div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Eye className="w-8 h-8 text-brand-navy" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-4">Our Vision</h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  To be the smartest regional platform enabling organizations to lead digital transformation, AI adoption, and cybersecurity readiness confidently and sustainably, and a global catalyst for skills transformation and workforce evolution.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
