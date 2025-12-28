import { motion } from "framer-motion";
import { Target, Users, Lightbulb, Heart } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "SDG Advocacy",
    description:
      "We actively promote and advocate for the 17 UN Sustainable Development Goals within our university and community.",
    color: "bg-sdg-blue",
  },
  {
    icon: Users,
    title: "Community Building",
    description:
      "Building a network of passionate individuals committed to making a positive impact on society and the environment.",
    color: "bg-sdg-green",
  },
  {
    icon: Lightbulb,
    title: "Education & Awareness",
    description:
      "Organizing workshops, seminars, and campaigns to educate students about sustainable development.",
    color: "bg-sdg-gold",
  },
  {
    icon: Heart,
    title: "Social Impact",
    description:
      "Implementing projects that directly contribute to achieving the SDGs in our local community.",
    color: "bg-sdg-red",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const AboutSection = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About ASAC
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            Driving Change Through{" "}
            <span className="gradient-text">Sustainable Action</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            The Al-Hikmah University SDG Advocacy Club (ASAC) is a student-led organization dedicated to promoting awareness and action towards achieving the United Nations Sustainable Development Goals.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover-lift"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
