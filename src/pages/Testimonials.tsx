import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Star, Lightbulb, Loader2, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const typeConfig = {
  feedback: { icon: MessageCircle, label: "Feedback", color: "bg-sdg-blue" },
  testimonial: { icon: Star, label: "Testimonial", color: "bg-sdg-gold" },
  recommendation: { icon: Lightbulb, label: "Recommendation", color: "bg-sdg-green" },
};

const Testimonials = () => {
  const { data: feedback = [], isLoading } = useQuery({
    queryKey: ["public-feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const testimonials = feedback.filter((f) => f.type === "testimonial");
  const recommendations = feedback.filter((f) => f.type === "recommendation");
  const generalFeedback = feedback.filter((f) => f.type === "feedback");

  return (
    <>
      <Helmet>
        <title>Testimonials & Feedback | ASAC</title>
        <meta name="description" content="Read what members and supporters say about ASAC - Al-Hikmah University SDG Advocacy Club." />
      </Helmet>
      <Layout>
        <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Community Voices
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                What People Are <span className="gradient-text">Saying</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from our members, partners, and supporters about their experiences with ASAC.
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : feedback.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Quote className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
                <h2 className="text-2xl font-display font-bold mb-4">No Testimonials Yet</h2>
                <p className="text-muted-foreground mb-8">Be the first to share your experience with ASAC!</p>
                <Button variant="hero" asChild>
                  <Link to="/feedback">Share Your Feedback</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {/* Testimonials Section */}
                {testimonials.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                      <Star className="h-6 w-6 text-sdg-gold" />
                      Testimonials
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonials.map((item, index) => (
                        <FeedbackCard key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations Section */}
                {recommendations.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-sdg-green" />
                      Recommendations
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations.map((item, index) => (
                        <FeedbackCard key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* General Feedback Section */}
                {generalFeedback.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-sdg-blue" />
                      General Feedback
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generalFeedback.map((item, index) => (
                        <FeedbackCard key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center pt-8"
                >
                  <p className="text-muted-foreground mb-4">Want to share your experience?</p>
                  <Button variant="hero" asChild>
                    <Link to="/feedback">Submit Feedback</Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

const FeedbackCard = ({ item, index }: { item: any; index: number }) => {
  const config = typeConfig[item.type as keyof typeof typeConfig] || typeConfig.feedback;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.name}</p>
              <Badge variant="secondary" className="text-xs">
                {config.label}
              </Badge>
            </div>
          </div>
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 h-8 w-8 text-muted-foreground/10" />
            <p className="text-muted-foreground pl-4 italic leading-relaxed">
              "{item.message}"
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {new Date(item.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Testimonials;
