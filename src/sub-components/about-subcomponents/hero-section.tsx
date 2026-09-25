     
     import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Target, Eye, Shield, Users, Zap, Globe, Award, Briefcase, MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { offices, socialLinks } from '@/constants';
import { useAboutPage, getDirectusAssetUrl } from '@/hooks/useAboutPage';
export default function HeroSection() {
  const { getHeroContent, getHeroImages, loading } = useAboutPage();
  const heroContent = getHeroContent();
  const heroImages = getHeroImages();

  // Get primary and secondary images
  const primaryImage = heroImages[0]?.image 
    ? getDirectusAssetUrl(heroImages[0].image)
    : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000";
    
  const secondaryImage = heroImages[1]?.image 
    ? getDirectusAssetUrl(heroImages[1].image)
    : "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800";

  return (
    <>
      {/* Hero Section - Unique Split Design */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-slate-50">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-brand-navy mb-6 leading-tight">
                {heroContent?.title} <br/><span className="text-brand-cyan">{heroContent?.subtitle}</span>
              </h1>
              <div className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl space-y-4">
                <p>{heroContent?.description}</p>
                <p>{heroContent?.content}</p>
                <p>{heroContent?.excerpt}</p>
              </div>
              
              <div className="flex items-center gap-4">
                {socialLinks.map((social, idx) => (
                  <motion.a 
                    key={idx} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-cyan hover:text-white hover:border-brand-cyan transition-all shadow-sm hover:shadow-md"
                    whileHover={{ y: -4 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white aspect-[4/3]">
                <Image 
                  src={primaryImage}
                  alt={heroImages[0]?.title || "Innovera Team Collaboration"} 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 w-2/3 z-20 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50 aspect-[4/3]">
                <Image 
                  src={secondaryImage}
                  alt={heroImages[1]?.title || "Strategic Meeting"} 
                  fill
                  sizes="(max-width: 768px) 66vw, 33vw"
                  className="object-cover"
                />
              </div>
              {/* Decorative blob */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}