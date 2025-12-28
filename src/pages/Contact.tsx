import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Mail, MapPin, Phone, Clock, Send, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "info@asac-hui.org",
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
  return (
    <Layout>
      <Helmet>
        <title>Contact Us | ASAC - SDG Advocacy Club</title>
        <meta name="description" content="Get in touch with the ASAC team. Contact us for inquiries, partnerships, or to learn more about our sustainable development initiatives." />
        <meta
          name="keywords"
          content="ASAC Contact, SDG Advocacy Club, Contact ASAC, Sustainability Contact, Al-Hikmah University Contact, SDG Inquiries"
        />
        <meta property="og:title" content="Contact Us | ASAC - SDG Advocacy Club" />
        <meta property="og:description" content="Get in touch with the ASAC team. Contact us for inquiries, partnerships, or to learn more about our sustainable development initiatives." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://asac-hui.vercel.app/contact" />
      </Helmet>

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
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="name" placeholder="Enter your full name" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="Enter your email" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is this regarding?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          id="message" 
                          placeholder="Type your message here..." 
                          className="pl-10 min-h-[150px]" 
                          rows={5}
                        />
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
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