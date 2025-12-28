import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const sdgGoals = [
  { number: 1, name: "No Poverty", color: "#E5243B", description: "End poverty in all its forms everywhere.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg" },
  { number: 2, name: "Zero Hunger", color: "#DDA63A", description: "End hunger, achieve food security and improved nutrition.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg" },
  { number: 3, name: "Good Health and Well-being", color: "#4C9F38", description: "Ensure healthy lives and promote well-being for all.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg" },
  { number: 4, name: "Quality Education", color: "#C5192D", description: "Ensure inclusive and equitable quality education.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg" },
  { number: 5, name: "Gender Equality", color: "#FF3A21", description: "Achieve gender equality and empower all women and girls.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-05.jpg" },
  { number: 6, name: "Clean Water and Sanitation", color: "#26BDE2", description: "Ensure availability of water and sanitation for all.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg" },
  { number: 7, name: "Affordable and Clean Energy", color: "#FCC30B", description: "Ensure access to affordable, reliable, sustainable energy.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg" },
  { number: 8, name: "Decent Work and Economic Growth", color: "#A21942", description: "Promote sustained, inclusive economic growth.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg" },
  { number: 9, name: "Industry, Innovation and Infrastructure", color: "#FD6925", description: "Build resilient infrastructure and foster innovation.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg" },
  { number: 10, name: "Reduced Inequalities", color: "#DD1367", description: "Reduce inequality within and among countries.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-10.jpg" },
  { number: 11, name: "Sustainable Cities and Communities", color: "#FD9D24", description: "Make cities inclusive, safe, resilient and sustainable.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg" },
  { number: 12, name: "Responsible Consumption and Production", color: "#BF8B2E", description: "Ensure sustainable consumption and production patterns.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg" },
  { number: 13, name: "Climate Action", color: "#3F7E44", description: "Take urgent action to combat climate change.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg" },
  { number: 14, name: "Life Below Water", color: "#0A97D9", description: "Conserve and sustainably use oceans and marine resources.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg" },
  { number: 15, name: "Life on Land", color: "#56C02B", description: "Protect, restore and promote sustainable use of ecosystems.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg" },
  { number: 16, name: "Peace, Justice and Strong Institutions", color: "#00689D", description: "Promote peaceful and inclusive societies.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-16.jpg" },
  { number: 17, name: "Partnerships for the Goals", color: "#19486A", description: "Strengthen global partnerships for sustainable development.", icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg" },
];

const SDGs = () => {
  return (
    <>
      <Helmet>
        <title>The 17 SDGs - Sustainable Development Goals | ASAC</title>
        <meta
          name="description"
          content="Explore the 17 United Nations Sustainable Development Goals. Learn how ASAC advocates for each goal at Al-Hikmah University."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
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
                href="https://sdgs.un.org/goals"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  Visit UN SDG Portal
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </div>
        </section>

        {/* SDG Grid */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sdgGoals.map((goal, index) => (
                <motion.div
                  key={goal.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ backgroundColor: goal.color }}
                >
                  <div className="p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <img 
                        src={goal.icon} 
                        alt={`SDG ${goal.number}: ${goal.name}`}
                        className="w-16 h-16 rounded-lg object-cover bg-white/10"
                        loading="lazy"
                      />
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-lg font-bold">{goal.number}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-display font-bold mb-2">
                      {goal.name}
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Join Us in Achieving These Goals
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Every action counts. Become a member of ASAC and contribute to sustainable development at Al-Hikmah University and beyond.
              </p>
              <Button variant="hero" size="xl" asChild>
                <a href="/register">Become a Member</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default SDGs;
