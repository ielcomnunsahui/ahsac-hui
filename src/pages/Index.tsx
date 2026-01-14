import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UpcomingEventsSection } from "@/components/sections/UpcomingEventsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO
        title="AHSAC - Al-Hikmah University SDG Advocacy Club"
        description="Join AHSAC, Al-Hikmah University's SDG Advocacy Club. We champion the 17 Sustainable Development Goals through education, advocacy, and community action."
        keywords="AHSAC, SDG, Sustainable Development Goals, Al-Hikmah University, Student Club, Advocacy, Nigeria, sustainability"
        path="/"
      />
      <Layout>
        <HeroSection />
        <AboutSection />

        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-sdg-blue/10 text-sdg-blue text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                UN 2030 Agenda
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6">
                The <span className="gradient-text-sdg">17 Goals</span> for a Better World
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
                The Sustainable Development Goals are a universal call to action to end poverty, protect the planet, and ensure that all people enjoy peace and prosperity by 2030.
              </p>
              <a href="/sdgs">
                <Button variant="outline" size="lg" className="text-sm sm:text-base">
                  <span className="hidden sm:inline">View The 17 SDGs - Sustainable Development Goals</span>
                  <span className="sm:hidden">View The 17 SDGs</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </motion.div>
          </div>
        </section>
        
        <UpcomingEventsSection />
        <TestimonialsSection />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
