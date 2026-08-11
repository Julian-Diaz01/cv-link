import { useRef, useMemo, useState } from 'react'
import {
  Download,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Globe,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeader, ContactItem, CornerBrackets } from '../components/cv'
import profileDataRaw from '../data/profile.json'
import jobsDataRaw from '../data/experienceCV.json'
import jobsDataRaw2 from '../data/jobs.json'
import educationDataRaw from '../data/education.json'
import servicesDataRaw from '../data/services.json'
import type { Profile, Education, Service, Job } from '../types'

// Type for CV experience jobs
interface CVJob {
  monthYearRange: string
  title: string
  subTitle: string
  description: string
}

// Type assertions for JSON imports
const profileData = profileDataRaw as Profile
const jobsData = jobsDataRaw as CVJob[]
const jobsData2 = jobsDataRaw2 as Job[]
const educationData = educationDataRaw as Education[]
const servicesData = servicesDataRaw as Service[]

// Contact item configuration type
interface ContactConfig {
  icon: LucideIcon
  value: string
  href?: string
  displayValue?: string
}

// Transform JSON data to CV format
const useCVData = () => {
  return useMemo(() => {
    const getSocialUrl = (name: string) =>
      profileData.socialLinks.find((link) => link.name === name)?.url || ''

    // Transform jobs to experience format
    const experience = jobsData.map((job) => ({
      position: job.title,
      company: `${job.subTitle}, ${job.monthYearRange}`,
      responsibilities: job.description
        .split('.')
        .filter((s) => s.trim().length > 0)
        .map((s) => s.trim() + '.'),
    }))

    // Transform education data
    const education = educationData.map((edu) => ({
      degree: edu.title.toUpperCase(),
      institution: edu.subTitle,
      date: edu.monthYearRange,
    }))

    // Collect all unique skills
    const allSkills = new Set<string>()
    ;[...servicesData, ...educationData, ...jobsData2].forEach((item) =>
      item.chips.forEach((chip) => allSkills.add(chip)),
    )

    const linkedinUrl = getSocialUrl('LinkedIn')
    const githubUrl = getSocialUrl('Github')

    return {
      name: `${profileData.firstName.toUpperCase()} ${profileData.lastName.toUpperCase()}`,
      title: profileData.title.toUpperCase(),
      summary: profileData.bioImpersonal,
      contact: {
        email: profileData.email,
        location: profileData.location,
        website: profileData.website || '',
        linkedin: linkedinUrl,
        github: githubUrl,
      },
      experience,
      education,
      skills: Array.from(allSkills),
    }
  }, [])
}

// Build contact items config from data
const buildContactItems = (contact: {
  phone?: string
  email: string
  location: string
  website: string
  github: string
  linkedin: string
}): ContactConfig[] => {
  const formatUrl = (url: string) =>
    url.replace('https://', '').replace('https://www.', '').replace(/\/$/, '')

  const items: (ContactConfig | null)[] = [
    contact.phone ? { icon: Phone, value: contact.phone } : null,
    { icon: Mail, value: contact.email },
    { icon: MapPin, value: contact.location },
    contact.website
      ? {
          icon: Globe,
          value: contact.website,
          href: contact.website,
          displayValue: formatUrl(contact.website),
        }
      : null,
    contact.github
      ? {
          icon: Github,
          value: contact.github,
          href: contact.github,
          displayValue: formatUrl(contact.github),
        }
      : null,
    contact.linkedin
      ? {
          icon: Linkedin,
          value: contact.linkedin,
          href: contact.linkedin,
          displayValue: formatUrl(contact.linkedin),
        }
      : null,
  ]

  return items.filter((item): item is ContactConfig => item !== null)
}

// Main CV Component
const CVPage = () => {
  const cvRef = useRef<HTMLDivElement>(null)
  const cvData = useCVData()
  const [isGenerating, setIsGenerating] = useState(false)

  const contactItems = buildContactItems({ ...cvData.contact, phone: '' })

  const nameParts = cvData.name.split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const handleDownloadPDF = () => {
    if (!cvRef.current || isGenerating) return
    setIsGenerating(true)

    const newWindow = window.open('', '_blank')
    if (!newWindow) {
      alert('Please allow popups to open PDF')
      setIsGenerating(false)
      return
    }

    const element = cvRef.current.cloneNode(true) as HTMLElement
    let allCSS = ''
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        Array.from(sheet.cssRules).forEach((rule) => {
          allCSS += rule.cssText + '\n'
        })
      } catch {
        // Cross-origin stylesheets might throw errors
      }
    })

    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${cvData.name} - CV</title>
          <style>
            ${allCSS}
            html, body { background: #1d293d !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @media print {
              @page { 
                size: letter; 
                margin: 0; 
                background: #1d293d; 
              }
              html, body { 
                margin: 0; 
                padding: 0; 
                background: #1d293d !important; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
              }
              /* Blue margins: 2rem top, 1rem sides, 1rem bottom on all pages */
              /* White content fills remaining space with blank white space on every page */
              body > div.bg-white { 
                margin-top: 2rem; 
                margin-left: 1rem; 
                margin-right: 1rem; 
                margin-bottom: 1rem; 
                background: white !important;
                padding-top: 0;
                padding-bottom: 0;
                /* Explicit dimensions: Letter size (8.5in x 11in) minus margins */
                width: calc(8.5in - 2rem); /* Page width minus left and right margins */
                min-height: calc(11in - 3rem); /* Page height minus top (2rem) and bottom (1rem) margins */
                box-sizing: border-box;
                /* Ensure white background appears on every page when content flows */
                page-break-inside: auto;
                /* Force background to appear on each page */
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              /* Ensure inner content extends to fill the white area with blank space on each page */
              body > div.bg-white > div {
                min-height: calc(11in - 3rem); /* Fill the white area on each page */
                background: white !important;
                /* Ensure content flows properly across pages */
                page-break-inside: auto;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              /* When content breaks to a new page, ensure white background continues */
              body > div.bg-white > div > div {
                page-break-inside: avoid;
                background: white;
              }
            }
            @media screen { 
              html, body { margin: 0; padding: 20px; background: #1d293d !important; }
            }
          </style>
        </head>
        <body>${element.outerHTML}</body>
      </html>
    `)
    newWindow.document.close()
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-[#1d293d] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Download Button */}
        <div className="mb-4 flex justify-end print:hidden">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 border-2 dark:border-accent dark:text-accent px-6 sm:px-8 py-2.5 sm:py-3 font-medium dark:hover:bg-accent-soft transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={18} />
            {isGenerating ? 'Opening...' : 'Open PDF'}
          </button>
        </div>

        {/* CV Content */}
        <div ref={cvRef} className="bg-white shadow-xl">
          <div className="flex">
            {/* Left Sidebar */}
            <div className="w-[280px] flex-shrink-0 bg-gray-50 p-8 border-r border-gray-200">
              {/* Header with Name + Photo */}
              <div className="mb-8">
                <div className="mb-1">
                  <h1
                    className="text-4xl tracking-[0.2em] text-gray-600 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {firstName}
                  </h1>
                  <h1
                    className="text-4xl tracking-[0.2em] text-gray-600 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {lastName}
                  </h1>
                </div>
                <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mt-2 mb-6">
                  {cvData.title}
                </p>
                <div className="w-full h-px bg-gray-300 mb-6" />
                <CornerBrackets>
                  <img
                    src="/julian5.png"
                    alt={cvData.name}
                    className="w-full h-full object-cover"
                  />
                </CornerBrackets>
              </div>

              {/* Contact */}
              <div className="mt-8">
                <SectionHeader title="CONTACT" />
                <div className="space-y-3">
                  {contactItems.map((item, i) => (
                    <ContactItem key={i} {...item} />
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mt-8">
                <SectionHeader title="EDUCATION" />
                {cvData.education.map((edu, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase leading-tight">
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-gray-400">{edu.date}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mt-8">
                <SectionHeader title="SKILLS" />
                <div className="flex flex-wrap gap-1.5">
                  {cvData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-gray-600 bg-gray-200 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10">
              {/* Summary */}
              <div className="mb-10">
                <SectionHeader title="SUMMARY" variant="main" />
                <p className="text-gray-600 leading-relaxed text-sm">
                  {cvData.summary}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <SectionHeader title="EXPERIENCE" variant="main" />
                {cvData.experience.map((job, i) => (
                  <div key={i} className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
                      {job.position}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2 italic">
                      {job.company}
                    </p>
                    <ul className="space-y-1">
                      {job.responsibilities.map((resp, j) => (
                        <li
                          key={j}
                          className="text-gray-600 text-xs flex leading-relaxed"
                        >
                          <span className="mr-2 text-gray-400">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="h-[550px]"> </div>
            </div>
          </div>
        </div>

        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: cvData.name,
              jobTitle: cvData.title,
              email: cvData.contact.email,
              address: {
                '@type': 'PostalAddress',
                addressLocality: cvData.contact.location,
              },
              sameAs: [cvData.contact.linkedin],
              description: cvData.summary,
              hasOccupation: cvData.experience.map((exp) => ({
                '@type': 'Occupation',
                name: exp.position,
                description: exp.responsibilities.join(' '),
              })),
              alumniOf: cvData.education.map((edu) => ({
                '@type': 'EducationalOrganization',
                name: edu.institution,
              })),
              knowsAbout: cvData.skills,
            }),
          }}
        />
      </div>
    </div>
  )
}

export default CVPage
