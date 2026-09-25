import NavyPageHero from "@/src/components/ui/NavyPageHero";

export default function TrainingHeroSection() {
  return (
    <NavyPageHero
      backgroundImage="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070"
      backgroundAlt="Training Background"
      badge="Innovera Academy"
      title={
        <>
          Build the skills that <br />
          <span className="text-brand-cyan">power the future.</span>
        </>
      }
      description="Industry-aligned learning tracks, global certifications, strategic partnerships, and practical development pathways empowering individuals to thrive in the future of work."
    />
  );
}
