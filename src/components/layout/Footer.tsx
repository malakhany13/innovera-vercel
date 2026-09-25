import Link from "next/link";
import Image from "next/image";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import FooterNewsletterForm from "./FooterNewsletterForm";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <Image
                src="https://lh3.googleusercontent.com/d/1KNhxT_yREjhYuFPBHxRyBj8GQXerj5bB"
                alt="Innovera Logo"
                width={180}
                height={64}
                className="h-12 sm:h-16 w-auto object-contain"
                style={{ width: "auto", height: "auto" }}
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Empowering talent and shaping the future through world-class training and intelligent outsourcing solutions.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com/company/innoveracorp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-brand-cyan hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
              <a href="https://tiktok.com/@innoveracorp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-brand-cyan hover:text-white transition-all"><TikTokIcon className="w-5 h-5" /></a>
              <a href="https://facebook.com/innoveracorp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-brand-cyan hover:text-white transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="https://instagram.com/innoveracorp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-brand-cyan hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-8">Quick Links</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li><Link href="/" className="hover:text-brand-cyan transition-colors">Home</Link></li>
              <li><Link href="/courses" className="hover:text-brand-cyan transition-colors">Courses</Link></li>
              <li><Link href="/internship" className="hover:text-brand-cyan transition-colors">Internship</Link></li>
              <li><Link href="/news" className="hover:text-brand-cyan transition-colors">News</Link></li>
              <li><Link href="/events" className="hover:text-brand-cyan transition-colors">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-brand-cyan transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-8">Services</h4>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-8">Newsletter</h4>
            <p className="text-slate-300 text-sm mb-6">Stay updated with our latest programs and news.</p>
            <FooterNewsletterForm />
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-xs">© 2026 Innovera Corp. All rights reserved.</div>
          <div className="flex gap-8 text-slate-400 text-xs">
            <Link href="/privacy" className="hover:text-brand-cyan transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-cyan transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-brand-cyan transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
