import { motion } from "motion/react";
import Image from "next/image";
import { useMemo } from "react";
import { HOME_VENDORS } from "./constants";

export default function HomeVendorsSection() {
  // Use the curated brand logos directly — Directus/course logo data is unreliable
  // (duplicate Fortinet, AI CERTs slot getting the wrong logo).
  const vendors = useMemo(
    () =>
      HOME_VENDORS.map((vendor, index) => ({
        id: index,
        name: vendor.name,
        vendorKey: vendor.vendorKey,
        logo: vendor.logo,
        href: vendor.href,
      })).filter((vendor) => Boolean(vendor.logo)),
    [],
  );

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-cyan/10 text-brand-cyan font-semibold text-sm mb-4 tracking-wider uppercase">
            Certified Partners
            </span>
            <h2 className="text-4xl font-display font-bold text-brand-navy mb-4">Our Partners</h2>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
              Industry-leading partners powering our certified training catalog. Click a logo to visit their website.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {vendors.map((vendor, idx) => {
            const isFortinet = vendor.vendorKey === "Fortinet";
            const isLargePartner =
              vendor.vendorKey === "Hanwha" ||
              vendor.vendorKey === "H3C" ;
            

            return (
              <motion.a
                key={vendor.vendorKey}
                href={vendor.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                aria-label={`Visit ${vendor.name} website`}
                className="group relative bg-white border border-slate-200 rounded-2xl p-8 flex items-center justify-center h-[160px] hover:border-brand-cyan hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-2 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div
                  className={
                    isFortinet || isLargePartner
                      ? "relative h-16 w-[240px]"
                      : "relative h-12 w-[200px]"
                  }
                >
                  <Image
                    src={vendor.logo}
                    alt={vendor.name}
                    fill
                    sizes={isFortinet || isLargePartner ? "240px" : "200px"}
                    loading="lazy"
                    className={
                      isFortinet
                        ? "object-contain scale-125 group-hover:grayscale-0 transition-all duration-300 group-hover:scale-[1.35]"
                        : isLargePartner
                          ? "object-contain scale-150 group-hover:grayscale-0 transition-all duration-300 group-hover:scale-[1.6]"
                          : "object-contain group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                    }
                  />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
