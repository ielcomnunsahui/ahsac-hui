import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Joining ASAC has been one of the best decisions of my university life. I've learned so much about sustainable development and made lifelong friends.",
    author: "Aisha Mohammed",
    role: "Member since 2022",
    faculty: "Faculty of Sciences",
  },
  {
    quote: "The club's dedication to the SDGs inspired me to start my own environmental initiative on campus. The support from fellow members has been incredible.",
    author: "Ibrahim Yusuf",
    role: "Member since 2021",
    faculty: "Faculty of Engineering",
  },
  {
    quote: "ASAC taught me that small actions can lead to big changes. Every workshop and event has equipped me with knowledge to make a real difference.",
    author: "Fatima Bakare",
    role: "Member since 2023",
    faculty: "Faculty of Management Sciences",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            What Our Members Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from students who have been part of our journey towards sustainable development.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors duration-300"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-display font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-xs text-primary mt-1">{testimonial.faculty}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
