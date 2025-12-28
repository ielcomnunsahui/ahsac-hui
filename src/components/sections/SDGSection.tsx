import { motion } from "framer-motion";

const sdgGoals = [
  { number: 1, name: "No Poverty", color: "#E5243B" },
  { number: 2, name: "Zero Hunger", color: "#DDA63A" },
  { number: 3, name: "Good Health", color: "#4C9F38" },
  { number: 4, name: "Quality Education", color: "#C5192D" },
  { number: 5, name: "Gender Equality", color: "#FF3A21" },
  { number: 6, name: "Clean Water", color: "#26BDE2" },
  { number: 7, name: "Clean Energy", color: "#FCC30B" },
  { number: 8, name: "Decent Work", color: "#A21942" },
  { number: 9, name: "Innovation", color: "#FD6925" },
  { number: 10, name: "Reduced Inequalities", color: "#DD1367" },
  { number: 11, name: "Sustainable Cities", color: "#FD9D24" },
  { number: 12, name: "Responsible Consumption", color: "#BF8B2E" },
  { number: 13, name: "Climate Action", color: "#3F7E44" },
  { number: 14, name: "Life Below Water", color: "#0A97D9" },
  { number: 15, name: "Life on Land", color: "#56C02B" },
  { number: 16, name: "Peace & Justice", color: "#00689D" },
  { number: 17, name: "Partnerships", color: "#19486A" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

export const SDGSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sdg-teal/10 text-sdg-teal text-sm font-medium mb-4">
            The 17 Goals
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            Sustainable Development{" "}
            <span className="gradient-text-sdg">Goals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            The Sustainable Development Goals are a universal call to action to end poverty, protect the planet, and ensure that all people enjoy peace and prosperity by 2030.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {sdgGoals.map((goal) => (
            <motion.div
              key={goal.number}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
              style={{ backgroundColor: goal.color }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-white">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-1">
                  {goal.number}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-center leading-tight opacity-90">
                  {goal.name}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Adopted by all UN Member States in 2015 as part of the 2030 Agenda for Sustainable Development
          </p>
        </motion.div>
      </div>
    </section>
  );
};