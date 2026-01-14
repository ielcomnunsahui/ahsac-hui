import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Mail, MapPin, Phone, Clock, Send, User, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { SEO } from "@/components/SEO";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
});

type FormErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "sdgadvocacyclubhui@gmail.com",
    description: "Send us a message and we'll respond as soon as possible"
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+234 800 000 0000",
    description: "Mon-Fri from 8am to 5pm (WAT)"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Al-Hikmah University, Ilorin, Kwara State, Nigeria",
    description: "Come meet us at our campus office"
  },
  {
    icon: Clock,
    title: "Office Hours",
    value: "Monday - Friday",
    description: "8:00 AM - 5:00 PM (West Africa Time)"
  }
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof typeof formData, value: string) => {
    const fieldSchema = contactSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    if (!result.success) {
      return result.error.errors[0]?.message || "Invalid input";
    }
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Validate on change if field has been touched
    if (touched[id]) {
      const error = validateField(id as keyof typeof formData, value);
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    const error = validateField(id as keyof typeof formData, value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      setTouched({ name: true, email: true, subject: true, message: true });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: result.data,
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      setTouched({});
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Layout>
      <SEO
        title="Contact Us | AHSAC - SDG Advocacy Club"
        description="Get in touch with the AHSAC team. Contact us for inquiries, partnerships, or to learn more about our sustainable development initiatives at Al-Hikmah University."
        keywords="AHSAC Contact, SDG Advocacy Club, Contact AHSAC, Sustainability Contact, Al-Hikmah University Contact, SDG Inquiries"
        path="/contact"
      />

      <div className="section-padding pt-24 min-h-screen">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our initiatives or want to get involved? Reach out to us using any of the methods below.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{info.title}</h3>
                        <p className="text-primary font-medium">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="name" 
                            placeholder="Enter your full name" 
                            className={`pl-10 ${errors.name && touched.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            value={formData.name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <InputError error={touched.name ? errors.name : undefined} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Enter your email" 
                            className={`pl-10 ${errors.email && touched.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <InputError error={touched.email ? errors.email : undefined} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                      <Input 
                        id="subject" 
                        placeholder="What is this regarding?" 
                        className={errors.subject && touched.subject ? "border-destructive focus-visible:ring-destructive" : ""}
                        value={formData.subject}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      />
                      <InputError error={touched.subject ? errors.subject : undefined} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          id="message" 
                          placeholder="Type your message here (minimum 10 characters)..." 
                          className={`pl-10 min-h-[150px] ${errors.message && touched.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      <InputError error={touched.message ? errors.message : undefined} />
                    </div>
                    <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
