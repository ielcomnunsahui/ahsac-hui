import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Target, Eye, Users, BookOpen, Megaphone, Heart, Loader2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import asacLogo from "@/assets/asac-logo.jpg";

interface FoundingMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  display_order: number;
}

interface OrganizationSettings {
  name: string;
  about: string | null;
  mission: string | null;
  vision: string | null;
  aims: string[] | null;
  objectives: string[] | null;
}

const defaultObjectives = [
  {
    icon: BookOpen,
    title: "Educate",
    description: "Raise awareness about the 17 SDGs among students and the university community.",
  },
  {
    icon: Megaphone,
    title: "Advocate",
    description: "Promote policies and practices that align with sustainable development principles.",
  },
  {
    icon: Users,
    title: "Collaborate",
    description: "Partner with organizations and stakeholders to amplify our impact.",
  },
  {
    icon: Heart,
    title: "Implement",
    description: "Execute projects that directly contribute to achieving the SDGs locally.",
  },
];

const About = () => {
  const [foundingMembers, setFoundingMembers] = useState<FoundingMember[]>([]);
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [membersRes, settingsRes] = await Promise.all([
        supabase.from('founding_members').select('*').order('display_order'),
        supabase.from('organization_settings').select('*').limit(1).maybeSingle(),
      ]);

      setFoundingMembers(membersRes.data || []);
      setSettings(settingsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>About ASAC - Our Mission, Vision & Objectives</title>
        <meta
          name="description"
          content="Learn about ASAC's mission to champion the UN Sustainable Development Goals at Al-Hikmah University. Discover our vision, objectives, and founding members."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  About Us
                </span>
                <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                  Championing <span className="gradient-text">Sustainable</span> Futures
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {settings?.about || "The Al-Hikmah University SDG Advocacy Club (ASAC) was founded with a clear purpose: to mobilize students towards understanding and contributing to the United Nations' 2030 Agenda for Sustainable Development."}
                </p>
                <p className="text-muted-foreground">
                  Since our establishment, we have grown into a vibrant community of passionate advocates working together to create meaningful change in our university and beyond.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative flex justify-center"
              >
                <img
                  src={asacLogo}
                  alt="ASAC Logo"
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-card">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-8 rounded-2xl bg-primary text-primary-foreground"
              >
                <Target className="h-10 w-10 mb-4" />
                <h2 className="text-2xl font-display font-bold mb-4">Our Mission</h2>
                <p className="opacity-90 leading-relaxed">
                  {settings?.mission || "To educate, inspire, and mobilize Al-Hikmah University students to become active advocates for the Sustainable Development Goals, fostering a culture of sustainability, equity, and global citizenship."}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-8 rounded-2xl bg-secondary"
              >
                <Eye className="h-10 w-10 mb-4 text-secondary-foreground" />
                <h2 className="text-2xl font-display font-bold mb-4 text-secondary-foreground">Our Vision</h2>
                <p className="text-secondary-foreground/80 leading-relaxed">
                  {settings?.vision || "A university community where every student understands, embraces, and actively contributes to achieving the Sustainable Development Goals, creating lasting positive impact for generations to come."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Objectives */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Our Objectives</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We pursue our mission through key strategic objectives.
              </p>
            </motion.div>

            {settings?.objectives && settings.objectives.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {settings.objectives.slice(0, 4).map((obj, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center p-6 rounded-2xl border border-border hover:border-primary/30 transition-colors"
                  >
                    {(() => {
                      const IconComponent = defaultObjectives[index % 4].icon;
                      return (
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                          <IconComponent className="h-7 w-7" />
                        </div>
                      );
                    })()}
                    <p className="text-sm text-muted-foreground">{obj}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {defaultObjectives.map((obj, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center p-6 rounded-2xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                      <obj.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2">{obj.title}</h3>
                    <p className="text-sm text-muted-foreground">{obj.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Founding Members */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Founding Members</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet the visionaries who established ASAC and continue to guide our mission.
              </p>
            </motion.div>

            {foundingMembers.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {foundingMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center p-6 rounded-2xl bg-card border border-border"
                  >
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-sdg-teal mx-auto mb-4 flex items-center justify-center text-2xl font-display font-bold text-white">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                    <h3 className="font-display font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    {member.bio && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Founding members will be displayed here once added.</p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
