import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SDGSection } from "@/components/sections/SDGSection";
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
        <SDGSection />
        <TestimonialsSection />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
