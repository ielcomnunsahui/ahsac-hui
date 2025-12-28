import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UpcomingEventsSection } from "@/components/sections/UpcomingEventsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ASAC - Al-Hikmah University SDG Advocacy Club</title>
        <meta
          name="description"
          content="Join ASAC, Al-Hikmah University's SDG Advocacy Club. We champion the 17 Sustainable Development Goals through education, advocacy, and community action."
        />
        <meta
          name="keywords"
          content="ASAC, SDG, Sustainable Development Goals, Al-Hikmah University, Student Club, Advocacy"
        />
      </Helmet>
      <Layout>
        <HeroSection />
        <AboutSection />

        <section className="section-padding bg-gradient-to-b from-primary/5 to-background">
                  <div className="container-custom text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="inline-block px-4 py-1.5 rounded-full bg-sdg-blue/10 text-sdg-blue text-sm font-medium mb-4">
                        UN 2030 Agenda
                      </span>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                        The <span className="gradient-text-sdg">17 Goals</span> for a Better World
                      </h1>
                      <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                        The Sustainable Development Goals are a universal call to action to end poverty, protect the planet, and ensure that all people enjoy peace and prosperity by 2030.
                      </p>
        <a
                href="/sdgs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  View The 17 SDGs - Sustainable Development Goals 
                  <ExternalLink className="h-4 w-4" />
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