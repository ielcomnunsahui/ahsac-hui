import { motion } from "framer-motion";
import { ArrowRight, UserPlus, Award, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Fill out our simple registration form with your details",
  },
  {
    icon: Award,
    title: "Get Approved",
    description: "Your application will be reviewed by our team",
  },
  {
    icon: MessageCircle,
    title: "Join Community",
    description: "Connect with fellow advocates via our WhatsApp group",
  },
];

export const CTASection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join hundreds of students committed to creating positive change. Become a member of ASAC today and be part of the movement towards a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90"
                >
                  Register Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="xl"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 shrink-0">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-70">Step {index + 1}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm opacity-80">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
