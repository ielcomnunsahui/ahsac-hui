import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const SITE_URL = "https://ahsachui.org";
const DEFAULT_IMAGE = "/favicon.jpg";
const SITE_NAME = "AHSAC - Al-Hikmah University SDG Advocacy Club";

// Organization JSON-LD structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Al-Hikmah University SDG Advocacy Club",
  "alternateName": "AHSAC",
  "url": SITE_URL,
  "logo": `${SITE_URL}/favicon.jpg`,
  "description": "A student-led organization at Al-Hikmah University dedicated to promoting and implementing the United Nations Sustainable Development Goals.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ilorin",
    "addressRegion": "Kwara State",
    "addressCountry": "Nigeria"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "sdgadvocacyclubhui@gmail.com",
    "contactType": "general"
  },
  "sameAs": [
    "https://www.instagram.com/ahsac_hui",
    "https://twitter.com/ahsac_hui"
  ],
  "foundingDate": "2023",
  "parentOrganization": {
    "@type": "EducationalOrganization",
    "name": "Al-Hikmah University",
    "url": "https://alhikmah.edu.ng"
  }
};

export const SEO = ({
  title,
  description,
  keywords,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}: SEOProps) => {
  const fullUrl = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* WhatsApp specific */}
      <meta property="og:image:alt" content={`${title} - AHSAC Logo`} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
