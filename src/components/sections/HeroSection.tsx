import { motion } from "framer-motion";
import { ArrowRight, Users, Target, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ahsacLogo from "@/assets/asac-logo.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const HeroSection = () => {
  const { user, isLoading } = useAuth();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] md:min-h-[90vh] flex items-center overflow-hidden pt-16 md:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      
      {/* Animated Background Orbs - Hidden on small screens for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-64 md:w-96 h-64 md:h-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-64 md:w-96 h-64 md:h-96 rounded-full bg-sdg-teal/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-sdg-gold/5 blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10 py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center lg:text-left"
          >
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6"
            >
              <Globe className="h-4 w-4" />
              Al-Hikmah University SDG Advocacy Club
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-4 sm:mb-6"
            >
              Championing{" "}
              <span className="gradient-text-sdg">Sustainable</span>{" "}
              Development Goals
            </motion.h1>

            {/* Motto */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-primary mb-3 sm:mb-4"
            >
              "Voices for Sustainable Future"
            </motion.p>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8"
            >
              Join AHSAC in our mission to advocate for the 17 UN Sustainable Development Goals and create meaningful impact in our community and beyond.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {!isLoading && user ? (
                <Link to="/member-dashboard">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Join AHSAC Today
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link to="/about">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50"
            >
              {[
                { icon: Users, value: "500+", label: "Members" },
                { icon: Target, value: "17", label: "SDG Goals" },
                { icon: Globe, value: "50+", label: "Projects" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto lg:mx-0 mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Logo/Visual - Hidden on very small screens, shown smaller on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center order-first lg:order-last"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-sdg-red via-sdg-gold to-sdg-green rounded-full blur-3xl opacity-20 scale-150" />
              
              {/* Main Logo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20" />
              </motion.div>
              
              <motion.img
                src={ahsacLogo}
                alt="AHSAC - SDG Advocacy Club Logo"
                className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full object-cover shadow-2xl ring-4 ring-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              
              {/* Floating SDG Icons - Fewer on mobile */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className={`absolute w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg ${i > 3 ? 'hidden sm:flex' : ''}`}
                  style={{
                    backgroundColor: `hsl(${i * 60}, 70%, 50%)`,
                    color: "white",
                    top: `${15 + Math.sin(i * 1.05) * 35}%`,
                    left: `${50 + Math.cos(i * 1.05) * 55}%`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {i + 1}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
