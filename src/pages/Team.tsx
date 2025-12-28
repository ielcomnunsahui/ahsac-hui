import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Users, GraduationCap, Award, Mail, Linkedin, Twitter, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FoundingMember {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  bio: string | null;
  display_order: number;
}

const Team = () => {
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['founding-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('founding_members')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as FoundingMember[];
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="section-padding pt-24 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Meet Our Team | ASAC - SDG Advocacy Club</title>
        <meta name="description" content="Get to know the dedicated team behind the ASAC SDG Advocacy Club. Meet our passionate students working towards sustainable development goals." />
        <meta
          name="keywords"
          content="ASAC Team, SDG Advocacy Club Team, Sustainability Team, Al-Hikmah University Students, SDG Leaders, Environmental Advocates"
        />
        <meta property="og:title" content="Meet Our Team | ASAC - SDG Advocacy Club" />
        <meta property="og:description" content="Get to know the dedicated team behind the ASAC SDG Advocacy Club. Meet our passionate students working towards sustainable development goals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://asac-hui.vercel.app/team" />
      </Helmet>

      <div className="section-padding pt-24 min-h-screen">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Our Leadership</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Meet Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dedicated students from Al-Hikmah University passionate about advancing the UN Sustainable Development Goals.
            </p>
          </motion.div>

          {/* Team Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">{teamMembers.length}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">17</div>
                <div className="text-sm text-muted-foreground">SDGs Focused</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Years Active</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover-lift flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <p className="text-primary font-medium">{member.role}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      {member.image_url && (
                        <div className="flex justify-center">
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-32 h-32 rounded-full object-cover mx-auto"
                          />
                        </div>
                      )}
                      
                      {member.bio && (
                        <p className="text-sm text-muted-foreground text-center">
                          {member.bio}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Role
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 pt-2 justify-center">
                        <a 
                          href={`mailto:${member.name.replace(/\s+/g, '.').toLowerCase()}@asac-hui.org`}
                          className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                          title="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        <a 
                          href={`https://linkedin.com/in/${member.name.replace(/\s+/g, '-').toLowerCase()}`}
                          className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                          title="LinkedIn"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                        <a 
                          href={`https://twitter.com/${member.name.replace(/\s+/g, '_').toLowerCase()}`}
                          className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                          title="Twitter"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-16"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Users className="h-5 w-5 text-primary" />
                  Join Our Team
                </CardTitle>
                <CardDescription>
                  Interested in making a difference? We're always looking for passionate students to join our mission.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/register">Join Our Team</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Team;