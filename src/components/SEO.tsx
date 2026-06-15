import React from 'react'
import { Helmet } from 'react-helmet-async'

// Type for JSON-LD structured data
type StructuredData = Record<string, unknown>

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  author?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogImageAlt?: string
  ogUrl?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  canonicalUrl?: string
  structuredData?: StructuredData
  breadcrumbs?: Array<{ name: string; url: string }>
}

const SEO: React.FC<SEOProps> = ({
  title = 'Julian Diaz — Frontend Engineer',
  description = 'Case-study portfolio of Julian Diaz, Frontend Engineer in Berlin. Real-time PWAs, fleet platforms, and full-stack web applications — architecture diagrams and specs included.',
  keywords = 'frontend Engineer, Web Developer, React, TypeScript, JavaScript, Berlin, Full Stack Developer, Frontend Developer',
  author = 'Julian Diaz',
  ogTitle,
  ogDescription,
  ogImage = 'https://juliandiaz.web.app/og-image.jpg',
  ogImageAlt = 'Julian Diaz - frontend Engineer Portfolio',
  ogUrl = 'https://juliandiaz.web.app/',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  structuredData,
  breadcrumbs,
}) => {
  const finalOgTitle = ogTitle || title
  const finalOgDescription = ogDescription || description
  const finalCanonicalUrl = canonicalUrl || ogUrl

  // Default Person Schema for Julian Diaz
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Julian Diaz',
    jobTitle: 'Frontend Engineer',
    url: 'https://juliandiaz.web.app/',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'Germany',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Leeds Beckett University',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Leeds',
          addressCountry: 'UK',
        },
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Universidad Militar Nueva Granada',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bogota',
          addressCountry: 'Colombia',
        },
      },
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Konnektaro',
      url: 'https://konnektaro.com/',
    },
    knowsAbout: [
      'React',
      'TypeScript',
      'JavaScript',
      'Next.js',
      'Node.js',
      'Frontend Development',
      'Full Stack Development',
      'Web Development',
      'Mobile Development',
      'Flutter',
      'React Native',
      'CI/CD',
      'Firebase',
      'MongoDB',
    ],
    sameAs: [
      'https://github.com/Julian-Diaz01',
      'https://www.linkedin.com/in/julian-diaz-01/',
    ],
    image: ogImage,
    description: description,
  }

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Julian Diaz Portfolio',
    url: 'https://juliandiaz.web.app/',
    description: description,
    author: {
      '@type': 'Person',
      name: 'Julian Diaz',
    },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://juliandiaz.web.app/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Professional Service Schema
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Julian Diaz - Software Development Services',
    description:
      'Professional software development services specializing in React, TypeScript, Next.js, and modern web technologies',
    provider: {
      '@type': 'Person',
      name: 'Julian Diaz',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Berlin, Germany',
    },
    availableLanguage: ['English', 'Spanish', 'German'],
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }
    : null

  // Combine all schemas
  const allSchemas = [
    personSchema,
    websiteSchema,
    professionalServiceSchema,
    breadcrumbSchema,
    structuredData,
  ].filter(Boolean)

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* AI Search Engine Meta Tags */}
      <meta name="AI:title" content={finalOgTitle} />
      <meta name="AI:description" content={finalOgDescription} />
      <meta name="AI:topic" content="Software Development, Web Development" />
      <meta
        name="AI:category"
        content="Portfolio, Professional Services, Technology"
      />
      <meta name="AI:entity" content="Julian Diaz, Frontend Engineer, Berlin" />

      {/* Semantic Meta Tags for AI Comprehension */}
      <meta property="profile:first_name" content="Julian" />
      <meta property="profile:last_name" content="Diaz" />
      <meta property="profile:username" content="Julian-Diaz01" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Julian Diaz Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      <meta name="twitter:creator" content="@juliandiaz" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta
        name="googlebot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta
        name="bingbot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="geo.region" content="DE-BE" />
      <meta name="geo.placename" content="Berlin" />

      {/* JSON-LD Structured Data for AI Search Engines */}
      {allSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

export default SEO
