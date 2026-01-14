import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Star, Lightbulb, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { SEO } from "@/components/SEO";

const feedbackTypes = [
  { id: "feedback", label: "General Feedback", icon: MessageCircle, color: "bg-sdg-blue" },
  { id: "testimonial", label: "Testimonial", icon: Star, color: "bg-sdg-gold" },
  { id: "recommendation", label: "Recommendation", icon: Lightbulb, color: "bg-sdg-green" },
];

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  type: z.enum(["feedback", "testimonial", "recommendation"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const Feedback = () => {
  const [selectedType, setSelectedType] = useState<string>("feedback");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors, touchedFields }, reset, trigger } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { type: "feedback" },
    mode: "onBlur",
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    
    const { error } = await supabase.from('feedback').insert({
      name: data.name,
      email: data.email,
      type: data.type,
      message: data.message,
    });
    
    setIsSubmitting(false);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    
    setIsSuccess(true);
    toast({ title: "Thank you!", description: "Your feedback has been submitted." });
    reset();
    setSelectedType("feedback");
  };

  const InputError = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <motion.p 
        initial={{ opacity: 0, y: -5 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-sm text-destructive flex items-center gap-1 mt-1"
      >
        <AlertCircle className="h-3 w-3" />
        {error}
      </motion.p>
    );
  };

  if (isSuccess) {
    return (
      <>
        <SEO
          title="Feedback Received | AHSAC"
          description="Thank you for your feedback. We appreciate your input and will use it to improve AHSAC."
          path="/feedback"
        />
        <Layout>
          <section className="section-padding min-h-[70vh] flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">Thank You!</h1>
              <p className="text-muted-foreground mb-8">We appreciate your feedback.</p>
              <Button variant="hero" onClick={() => setIsSuccess(false)}>Submit Another</Button>
            </motion.div>
          </section>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Feedback & Testimonials | AHSAC"
        description="Share your feedback, testimonials, or recommendations with AHSAC. Your input helps us improve our SDG advocacy initiatives."
        keywords="AHSAC Feedback, SDG Testimonials, AHSAC Recommendations, Share Feedback, Student Feedback"
        path="/feedback"
      />
      <Layout>
        <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-custom max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">We Value Your Input</span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">Share Your <span className="gradient-text">Thoughts</span></h1>
              <p className="text-lg text-muted-foreground">Your feedback helps us improve.</p>
            </motion.div>

            <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-lg">
              <div className="mb-8">
                <Label className="mb-4 block">What would you like to share?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {feedbackTypes.map((type) => (
                    <button key={type.id} type="button" onClick={() => { setSelectedType(type.id); setValue("type", type.id as any); }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${selectedType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center mx-auto mb-2`}><type.icon className="h-5 w-5 text-white" /></div>
                      <p className="text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name <span className="text-destructive">*</span></Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    {...register("name")} 
                    className={errors.name && touchedFields.name ? "border-destructive focus-visible:ring-destructive" : ""} 
                    onBlur={() => trigger("name")}
                  />
                  <InputError error={touchedFields.name ? errors.name?.message : undefined} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    {...register("email")} 
                    className={errors.email && touchedFields.email ? "border-destructive focus-visible:ring-destructive" : ""} 
                    onBlur={() => trigger("email")}
                  />
                  <InputError error={touchedFields.email ? errors.email?.message : undefined} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message <span className="text-destructive">*</span></Label>
                  <Textarea 
                    id="message" 
                    placeholder="Share your thoughts (minimum 10 characters)..." 
                    rows={5} 
                    {...register("message")} 
                    className={errors.message && touchedFields.message ? "border-destructive focus-visible:ring-destructive" : ""} 
                    onBlur={() => trigger("message")}
                  />
                  <InputError error={touchedFields.message ? errors.message?.message : undefined} />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" />Submitting...</> : <><Send className="h-5 w-5" />Submit</>}
                </Button>
              </div>
            </motion.form>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Feedback;
