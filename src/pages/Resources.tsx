import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { BookOpen, Download, ExternalLink, Globe, Users, Target, Lightbulb, FileText, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  {
    title: "SDG Action Guide",
    description: "Comprehensive guide on taking action for the Sustainable Development Goals",
    category: "Guide",
    icon: BookOpen,
    url: "https://sdgs.un.org/partnerships",
    color: "bg-sdg-blue"
  },
  {
    title: "SDG Knowledge Platform",
    description: "Official UN platform for SDG knowledge sharing and resources",
    category: "Platform",
    icon: Globe,
    url: "https://www.un.org/sustainabledevelopment/sdg-fast-facts/",
    color: "bg-sdg-green"
  },
  {
    title: "SDG Indicators",
    description: "Official indicators for tracking SDG progress",
    category: "Data",
    icon: Target,
    url: "https://unstats.un.org/sdgs",
    color: "bg-sdg-gold"
  },
  {
    title: "SDG Case Studies",
    description: "Real-world examples of SDG implementation",
    category: "Case Study",
    icon: FileText,
    url: "https://sdgs.un.org/gsdr",
    color: "bg-sdg-red"
  },
  {
    title: "SDG Action Community",
    description: "Connect with other SDG advocates and practitioners",
    category: "Community",
    icon: Users,
    url: "https://unpartnerships.un.org/un-sdg-advocates?_gl=1*1jdn1jr*_ga*MTg1ODg0OTE1LjE3NjY5MjUzNzk.*_ga_TK9BQL5X7Z*czE3NjY5MjUzNzkkbzEkZzEkdDE3NjY5MjYxMzYkajYwJGwwJGgw",
    color: "bg-sdg-teal"
  },
  {
    title: "SDGs Circle of Supporters",
    description: "Organizations supporting the SDGs",
    category: "Supporters",
    icon: Lightbulb,
    url: "https://www.un.org/sustainabledevelopment/sdg-circle-of-supporters",
    color: "bg-sdg-purple"
  }
];

const additionalResources = [
  {
    title: "UN SDG Reports",
    description: "Annual progress reports on SDG implementation",
    url: "https://unstats.un.org/sdgs/reports/"
  },
  {
    title: "SDG Media Zone",
    description: "Multimedia resources and materials for SDG advocacy",
    url: "https://www.un.org/sustainabledevelopment/sdg-media-zone/"
  },
  {
    title: "SDG Action Awards",
    description: "Recognition for outstanding SDG initiatives",
    url: "https://www.un.org/sustainabledevelopment/sdg-action-awards/"
  },
  {
    title: "SDG Action Materials",
    description: "Downloadable materials for SDG campaigns",
    url: "https://www.un.org/sustainabledevelopment/news/communications-material/"
  }
];

const Resources = () => {
  return (
    <Layout>
      <Helmet>
        <title>Resources | ASAC - SDG Advocacy Club</title>
        <meta name="description" content="Access valuable resources for learning about and advocating for the UN Sustainable Development Goals. Find guides, reports, and tools to support your SDG journey." />
        <meta
          name="keywords"
          content="SDG Resources, Sustainable Development Goals, UN Resources, SDG Guides, SDG Reports, SDG Tools, Sustainability Resources, Climate Action Resources, Al-Hikmah University"
        />
        <meta property="og:title" content="Resources | ASAC - SDG Advocacy Club" />
        <meta property="og:description" content="Access valuable resources for learning about and advocating for the UN Sustainable Development Goals. Find guides, reports, and tools to support your SDG journey." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://asac-hui.vercel.app/resources" />
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
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Knowledge Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              SDG <span className="gradient-text">Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access valuable resources to deepen your understanding of the Sustainable Development Goals and find tools to support your advocacy efforts.
            </p>
          </motion.div>

          {/* Featured Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">
              Featured Resources
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover-lift flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{resource.category}</Badge>
                        <div className={`p-2 rounded-lg ${resource.color} text-white`}>
                          <resource.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <CardTitle>{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow">
                      <CardDescription className="flex-grow mb-4">
                        {resource.description}
                      </CardDescription>
                      <Button variant="outline" asChild className="mt-auto">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Access Resource
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">
              Additional Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {additionalResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {resource.title}
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {resource.description}
                      </CardDescription>
                      <Button variant="outline" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Resource
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Contribute Resources</CardTitle>
                <CardDescription>
                  Have valuable resources to share with our community? Contact us to contribute to our knowledge hub.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/contact">Contact Us</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;