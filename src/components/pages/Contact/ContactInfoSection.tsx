import { Mail, Phone } from "lucide-react";

export default function ContactInfoSection() {
  return (
    <div>
      <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-brand-navy">Get in Touch</h1>
      <p className="text-brand-gray text-lg mb-10">
        Have questions about our cybersecurity solutions, training programs, or potential partnerships? Send us a message and our team will get back to you shortly.
      </p>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Email Us</h4>
            <p className="text-slate-600">info@innoveracorp.com</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Call Us</h4>
            <p className="text-slate-600">+20 10 70008672</p>
          </div>
        </div>
      </div>
    </div>
  );
}
