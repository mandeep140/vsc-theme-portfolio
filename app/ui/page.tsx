'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Phone,
  Linkedin,
  Github,
  MapPin,
  Terminal,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Code2,
  ChevronRight,
  Send,
  SlidersHorizontal,
  Compass,
  FileCode,
  Download,
  CheckCircle2,
  Sparkles,
  Laptop,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  X,
  Eye,
} from 'lucide-react';

const developer = {
  name: 'Mandeep Nagar',
  role: 'Full Stack Developer & Systems Builder',
  tagline: 'CTO-experienced developer building high-impact production SaaS applications, offline-first systems, and scalable backend architectures.',
  location: 'Patna, Bihar, India',
  email: 'mandeep.pc2006@gmail.com',
  phone: '+91 99204 80615',
  website: 'https://mandeepiitp.tech',
  linkedin: 'https://linkedin.com/in/mandeepnagar',
  github: 'https://github.com/mandeep140',
  resumeUrl: '/files/mandeep_resume.pdf',
  avatarUrl: '/images/my.png',
  bio:
    'Full Stack Developer and former CTO with a proven track record of architecting, building, and deploying production SaaS applications, CRM platforms, and desktop software end-to-end. Currently pursuing a Bachelor of Science in Computer Science and Data Analytics at IIT Patna (8.9 CPI). Active contributor to the campus technical ecosystem through the Student Technical Council (STC IIT Patna) and trusted freelance engineer for client deliverables.',
  corePillars: [
    { title: 'Full Stack Web', desc: 'Next.js 15/16 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui' },
    { title: 'Scalable Backend', desc: 'Express.js, Node.js, REST APIs, JWT Auth, NextAuth, Zod, Mongoose' },
    { title: 'Offline-First & Desktop', desc: 'Electron Desktop Apps, SQLite, Local Area Network (LAN) synchronization' },
    { title: 'Databases & Cloud', desc: 'MongoDB, SQLite, PostgreSQL, Redis Upstash, Docker, Vercel, ImageKit' },
  ],
};

type ProjectCategory = 'all' | 'client' | 'desktop' | 'personal';

interface ProjectItem {
  id: string;
  name: string;
  category: ProjectCategory;
  categoryLabel: string;
  duration: string;
  status: string;
  statusColor: string;
  summary: string;
  architecture: string[];
  tech: string[];
  link?: string;
  github?: string;
}

const projects: ProjectItem[] = [
  {
    id: 'adjmd',
    name: 'AdJmd',
    category: 'client',
    categoryLabel: 'Client SaaS Platform',
    duration: 'Jun 2025 – Jul 2025',
    status: 'Delivered to Production',
    statusColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    summary:
      'Full-stack advertisement management platform engineered to automate media inventory lifecycle, client agreements, and agency operations with rapid 1-month time-to-market.',
    architecture: [
      'Multi-tenant role-based access control with granular permission schemas',
      'Media asset processing and CDN delivery pipeline via ImageKit integration',
      'Optimized MongoDB schemas handling dense inventory allocation matrices',
      'Production REST API suite with comprehensive input validation',
    ],
    tech: ['Next.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'ImageKit'],
  },
  {
    id: 'showa-track',
    name: 'Showa Track',
    category: 'client',
    categoryLabel: 'Enterprise OOH CRM',
    duration: 'Oct 2025 – Feb 2026',
    status: 'Production Deployed',
    statusColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    summary:
      'Purpose-built CRM platform for Out of Home (OOH) advertising agencies to coordinate media inventory, automated proposal generation, and client booking contracts.',
    architecture: [
      'Real-time booking conflict detection engine eliminating double-booking',
      'Automated PDF quotation and proposal generation pipelines',
      'Secure NextAuth authentication with audit-ready role segregation',
      'Scheduled background cron tasks for automated client status reporting',
    ],
    tech: ['Next.js', 'MongoDB', 'NextAuth', 'Nodemailer', 'Tailwind CSS'],
  },
  {
    id: 'showa-store',
    name: 'Showa Store Management',
    category: 'desktop',
    categoryLabel: 'Offline-First Desktop Software',
    duration: 'Feb 2026 – Apr 2026',
    status: 'Deployed for Retail',
    statusColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    summary:
      'High-throughput POS and inventory management desktop application packaged with Electron, featuring embedded SQLite storage and multi-user Local Area Network (LAN) synchronization.',
    architecture: [
      'Zero-cloud architecture with embedded SQLite database for ultra-low latency',
      'Multi-device real-time sync across local network with conflict resolution',
      'Integrated POS billing terminal with barcode scanner hardware support',
      'Supplier debt tracking and customer ledger accounting modules',
    ],
    tech: ['Next.js', 'Express.js', 'SQLite', 'Electron', 'Tailwind CSS'],
  },
  {
    id: 'vscode-portfolio',
    name: 'VS Code Developer Portfolio',
    category: 'personal',
    categoryLabel: 'Interactive Web Application',
    duration: '2026',
    status: 'Live & Active',
    statusColor: 'text-sky-400 border-sky-500/20 bg-sky-500/10',
    summary:
      'A faithful reproduction of the Visual Studio Code interface built on Next.js. Features a functional virtual file system, syntax highlighter, 20+ command terminal, and Gemini AI assistant.',
    architecture: [
      'Full virtual file hierarchy with tab state management and breadcrumb navigation',
      'Interactive Unix-like terminal emulator with autocomplete and command history',
      'Real-time Redis analytics layer tracking page impressions and reader reviews',
      'Context-aware Gemini AI assistant embedded in the editor sidebar',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Redis', 'Gemini API'],
    link: 'https://mandeepiitp.tech',
  },
  {
    id: 'local-bazaar',
    name: 'Local Bazaar',
    category: 'personal',
    categoryLabel: 'Hyperlocal E-Commerce PWA',
    duration: 'Jun 2025 – Sep 2025',
    status: 'Completed Prototype',
    statusColor: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    summary:
      'Direct-to-consumer hyperlocal delivery infrastructure connecting brick-and-mortar storefronts without dark-store overhead, supporting real-time tracking and offline capability.',
    architecture: [
      'Storekeeper self-serve catalog onboarding and live inventory toggling',
      'Full order dispatch workflow from cart checkout to last-mile confirmation',
      'Progressive Web App (PWA) architecture with offline caching and home screen install',
      'Web push notifications for continuous order lifecycle updates',
    ],
    tech: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'PWA'],
  },
];

const experience = [
  {
    id: 1,
    role: 'Freelance Backend Engineer',
    company: 'Quick Venue',
    location: 'Remote',
    period: 'Jun 2026 – Aug 2026',
    badge: 'Contract',
    description:
      'Architected core backend REST services and database schemas for an AI-enabled venue and cafe reservation platform.',
    keyPoints: [
      'Engineered high-performance MongoDB schemas supporting complex multi-attribute queries for venues, catering menus, and vendor slots',
      'Implemented JWT-based authentication pipelines with multi-tier role authorization (Administrators, Vendors, Customers)',
      'Built automated quotation generation workflows and booking lifecycle state machines',
    ],
    tech: ['Express.js', 'MongoDB', 'Node.js', 'JWT', 'REST APIs'],
  },
  {
    id: 2,
    role: 'Chief Technology Officer (CTO)',
    company: 'Showa',
    location: 'Bihar, India',
    period: 'Jul 2025 – Jun 2026',
    badge: 'Executive',
    description:
      'Directed full product engineering lifecycle for three commercial software deliverables across cloud, SaaS, and desktop platforms.',
    keyPoints: [
      'Led dev team in system architecture, code reviews, sprint planning, and client milestone delivery',
      'Delivered Showa Track CRM and Showa Store Management desktop software from concept to customer rollout',
      'Established engineering standards for database normalization, API design, and CI/CD automated deployments',
      'Interfaced directly with stakeholders to translate business operational bottlenecks into software solutions',
    ],
    tech: ['Next.js', 'Express.js', 'MongoDB', 'SQLite', 'Electron', 'Tailwind CSS'],
  },
  {
    id: 3,
    role: 'Independent Full Stack Developer',
    company: 'Freelance Practice',
    location: 'Remote',
    period: 'Sep 2025 – Present',
    badge: 'Independent',
    description:
      'Designing and shipping custom web applications, automation pipelines, and technical solutions for private clients.',
    keyPoints: [
      'Delivered end-to-end full stack web platforms with modern Next.js and Node.js architectures',
      'Implemented performance optimizations and technical SEO resulting in superior search discoverability',
      'Actively accepting contracts for SaaS development, API integrations, and backend architecture',
    ],
    tech: ['Next.js', 'React', 'MongoDB', 'Express.js', 'Tailwind CSS', 'SEO'],
  },
  {
    id: 4,
    role: 'Core Technical Member (WebWiser)',
    company: 'Student Technical Council, IIT Patna',
    location: 'IIT Patna, India',
    period: 'Sep 2025 – Present',
    badge: 'Community',
    description:
      'Engineering and maintaining campus technical systems and official portals for premier college technical festivals.',
    keyPoints: [
      'Architected and actively maintain backend services for the STC IITP Hybrid campus portal',
      'Developed high-traffic event platforms for Xenith and Phoenix technical festivals with zero downtime',
      'Served as technical crew lead for STC Immersion events, conducting workshops on web dev and deployment',
    ],
    tech: ['Next.js', 'React', 'Node.js', 'MongoDB', 'DevOps'],
  },
];

const education = [
  {
    id: 1,
    degree: 'Bachelor of Science in Computer Science and Data Analytics',
    school: 'Indian Institute of Technology (IIT) Patna',
    location: 'Patna, Bihar, India',
    period: 'Dec 2024 – Dec 2028',
    grade: 'CPI: 8.9 / 10 (as of 3rd semester)',
    isCurrent: true,
    highlights: 'Rigorous coursework in Data Structures, Algorithms, System Design, Database Systems, Probability & Statistics, and Machine Learning.',
  },
  {
    id: 2,
    degree: 'Senior Secondary (Class XII) — Physics, Chemistry, Mathematics',
    school: 'Swami Vivekanand Government Model School (CBSE)',
    location: 'Rajasthan, India',
    period: 'Completed 2024',
    grade: 'CBSE Board',
    isCurrent: false,
    highlights: 'Strong foundation in Advanced Mathematics, Analytical Physics, and Computer Science fundamentals.',
  },
  {
    id: 3,
    degree: 'Secondary School Education (Class X)',
    school: 'J.A. Meghani English High School',
    location: 'Maharashtra, India',
    period: 'Completed 2022',
    grade: 'Maharashtra SSC Board',
    isCurrent: false,
    highlights: 'Graduated with First Class with Distinction.',
  },
];

const skillGroups = [
  {
    title: 'Languages & Core',
    items: ['TypeScript', 'JavaScript (ES6+)', 'SQL', 'HTML5', 'CSS3', 'Python Basics'],
  },
  {
    title: 'Frontend Frameworks',
    items: ['React 19', 'Next.js 15/16 (App Router)', 'Tailwind CSS', 'shadcn/ui', 'Vite'],
  },
  {
    title: 'Backend & APIs',
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'NextAuth', 'Zod Validation'],
  },
  {
    title: 'Databases & Storage',
    items: ['MongoDB & Mongoose', 'SQLite', 'PostgreSQL', 'Redis (Upstash)', 'ImageKit CDN'],
  },
  {
    title: 'Desktop & Architecture',
    items: ['Electron', 'Offline-First Design', 'LAN Multi-Device Sync', 'PWA Architecture'],
  },
  {
    title: 'DevOps & Tooling',
    items: ['Git & GitHub', 'Docker', 'Vercel Deployment', 'Hoppscotch / Postman', 'Linux Shell', 'Cron Automations'],
  },
];

const honors = [
  {
    place: '1st Runner-up',
    event: 'hackNtech Hackathon',
    organizer: 'IIT Patna',
    year: '2025',
    image: '/images/hackNtech2.0.jpeg',
    summary: 'Built and demonstrated an end-to-end automated platform in 24 hours under competitive collegiate judging.',
  },
  {
    place: '1st Runner-up',
    event: 'Pixel Pulse UI/UX Challenge',
    organizer: 'IIT Patna',
    year: '2026',
    image: '/images/pixel_pulse_certificate.jpeg',
    summary: 'Awarded for precision visual hierarchy, accessibility standards, and high-fidelity interaction design.',
  },
  {
    place: '1st Place Winner',
    event: 'Idea Station Innovation Competition',
    organizer: 'IIT Patna',
    year: '2025',
    image: '/images/idea_station_poster.png',
    summary: 'Took 1st rank for business viability and technical execution roadmap of local commerce digitization.',
  },
  {
    place: 'Top 10 Finalist',
    event: 'Annual Inter-College Hackathon',
    organizer: 'IIT Patna',
    year: '2026',
    image: '/images/award.jpeg',
    summary: 'Ranked in the top 10 finalists out of 100+ participating engineering teams.',
  },
  {
    place: 'Top 7 Finalist',
    event: 'Collegiate Hackathon',
    organizer: 'IIT Patna',
    year: '2025',
    image: '/images/award2.jpeg',
    summary: 'Finalist recognition for full-stack software prototype deliverable within tight constraints.',
  },
];

export default function UserFriendlyPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeNav, setActiveNav] = useState('about');
  const [activeHeroTab, setActiveHeroTab] = useState<'overview' | 'terminal' | 'stack'>('overview');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'projects', 'experience', 'education', 'skills', 'honors', 'contact'];
      const scrollPos = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNav(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developer.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully to Mandeep Nagar! Thank you.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setSubmitStatus({
        type: 'error',
        message: err?.message || 'Failed to dispatch email. Please try emailing directly at mandeep.pc2006@gmail.com',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'honors', label: 'Honors' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#d4d4d8] font-sans antialiased selection:bg-[#0071e3] selection:text-white relative">

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-70"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#09090b] via-transparent to-transparent pointer-events-none z-0" />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/85 border-b border-white/[0.08] transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          <a href="#about" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.12] flex items-center justify-center bg-[#141417] group-hover:border-[#0071e3] transition-colors flex-shrink-0">
              <img src="/images/logo.png" alt="Mandeep Nagar logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white tracking-tight">{developer.name}</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1 bg-[#141417]/80 p-1 rounded-full border border-white/[0.08] text-xs">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-1 rounded-full font-medium transition-all ${activeNav === item.id
                  ? 'bg-[#0071e3] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.05]'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1f1f23] text-[#cccccc] hover:text-white border border-white/[0.1] transition-all hover:border-[#0071e3] active:scale-[0.98]"
              title="Switch to interactive VS Code IDE theme"
            >
              <Terminal className="w-3.5 h-3.5 text-[#0071e3]" />
              <span className="hidden sm:inline">VS Code View</span>
              <span className="sm:hidden">IDE</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-20 sm:space-y-28 relative z-10">

        <section id="about" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-[#a1a1aa] mb-5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-[11px] text-[#e4e4e7]">Available for Roles & Client Contracts</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.03em] leading-tight mb-3">
                  {developer.name}
                </h1>
                <p className="text-base sm:text-lg text-[#0071e3] font-medium mb-4">
                  {developer.role}
                </p>

                <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed mb-4">
                  {developer.tagline}
                </p>

                <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed mb-8">
                  {developer.bio}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Get In Touch</span>
                </a>

                <a
                  href={developer.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#141417] hover:bg-[#1e1e22] text-[#e4e4e7] text-xs font-medium border border-white/[0.1] transition-all hover:border-white/[0.2] active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Resume (PDF)</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#141417] hover:bg-[#1e1e22] text-[#e4e4e7] text-xs font-medium border border-white/[0.1] transition-all hover:border-white/[0.2] active:scale-[0.98] cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#71717a]" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                </button>

                <a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#141417] hover:bg-[#1e1e22] text-[#e4e4e7] text-xs font-medium border border-white/[0.1] transition-all hover:border-white/[0.2] active:scale-[0.98]"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>

                <a
                  href={developer.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#141417] hover:bg-[#1e1e22] text-[#e4e4e7] text-xs font-medium border border-white/[0.1] transition-all hover:border-white/[0.2] active:scale-[0.98]"
                  title="View GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5 text-[#a1a1aa]" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-[#141417]/90 border border-white/[0.08] overflow-hidden shadow-2xl backdrop-blur-md">

              <div className="px-4 py-3 border-b border-white/[0.06] bg-[#111113] flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                  <span className="text-[11px] font-mono text-[#71717a] ml-2">mandeep.profile</span>
                </div>

                <div className="flex items-center gap-1 bg-[#18181b] p-0.5 rounded-md border border-white/[0.06] text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveHeroTab('overview')}
                    className={`px-2 py-0.5 rounded transition-colors ${activeHeroTab === 'overview' ? 'bg-[#27272a] text-white' : 'text-[#71717a] hover:text-[#cccccc]'
                      }`}
                  >
                    bio
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHeroTab('stack')}
                    className={`px-2 py-0.5 rounded transition-colors ${activeHeroTab === 'stack' ? 'bg-[#27272a] text-white' : 'text-[#71717a] hover:text-[#cccccc]'
                      }`}
                  >
                    focus
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHeroTab('terminal')}
                    className={`px-2 py-0.5 rounded transition-colors ${activeHeroTab === 'terminal' ? 'bg-[#27272a] text-white' : 'text-[#71717a] hover:text-[#cccccc]'
                      }`}
                  >
                    sh
                  </button>
                </div>
              </div>

              <div className="p-5">
                {activeHeroTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/[0.1] bg-[#1a1a1e] flex-shrink-0">
                        <img
                          src={developer.avatarUrl}
                          alt={developer.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white tracking-tight">{developer.name}</div>
                        <div className="text-xs text-[#a1a1aa]">{developer.location}</div>
                        <div className="text-[11px] font-mono text-[#0071e3] mt-1">
                          IIT Patna BS (CS & Data Analytics)
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0d0d0f] border border-white/[0.06] text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between text-[#71717a]">
                        <span>ACADEMIC_CPI</span>
                        <span className="text-white font-semibold">8.9 / 10.0</span>
                      </div>
                      <div className="flex justify-between text-[#71717a]">
                        <span>PRIMARY_STACK</span>
                        <span className="text-[#4ec9b0]">Next.js • Express • MongoDB</span>
                      </div>
                      <div className="flex justify-between text-[#71717a]">
                        <span>SYSTEMS_DEPLOYED</span>
                        <span className="text-emerald-400">5+ Production Apps</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a] pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> Rajasthan, India
                      </span>
                      <span className="text-emerald-400 font-medium">Verified Builder</span>
                    </div>
                  </div>
                )}

                {activeHeroTab === 'stack' && (
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-[#71717a] uppercase tracking-wider mb-2">
                      Core Engineering Capabilities
                    </div>
                    {developer.corePillars.map((pillar, pi) => (
                      <div key={pi} className="p-2.5 rounded-lg bg-[#0d0d0f] border border-white/[0.06]">
                        <div className="text-xs font-semibold text-white mb-0.5 flex items-center justify-between">
                          <span>{pillar.title}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                        </div>
                        <div className="text-[11px] text-[#a1a1aa] font-mono leading-relaxed">{pillar.desc}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeHeroTab === 'terminal' && (
                  <div className="p-3.5 rounded-lg bg-[#09090b] font-mono text-[12px] leading-relaxed space-y-2 text-[#cccccc]">
                    <div>
                      <span className="text-emerald-400">mandeep@iitp</span>:<span className="text-[#0071e3]">~</span>$ whoami
                    </div>
                    <div className="text-[#a1a1aa] pl-2 text-[11px]">
                      Mandeep Nagar — Full Stack Developer & Systems Builder
                    </div>
                    <div>
                      <span className="text-emerald-400">mandeep@iitp</span>:<span className="text-[#0071e3]">~</span>$ npm run status
                    </div>
                    <div className="text-[#4ec9b0] pl-2 text-[11px]">
                      [READY] Open to full-time roles & engineering contracts.
                    </div>
                    <div>
                      <span className="text-emerald-400">mandeep@iitp</span>:<span className="text-[#0071e3]">~</span>$ contact --email
                    </div>
                    <div className="text-[#38bdf8] pl-2 text-[11px]">
                      mandeep.pc2006@gmail.com (+91 99204 80615)
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        <section id="projects" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1">
                Portfolio Work
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em]">
                Featured Production Systems
              </h2>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#141417] border border-white/[0.06] self-start sm:self-auto overflow-x-auto max-w-full">
              {[
                { id: 'all', label: 'All (5)' },
                { id: 'client', label: 'Client SaaS' },
                { id: 'desktop', label: 'Desktop & LAN' },
                { id: 'personal', label: 'Personal' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id as ProjectCategory)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${selectedCategory === tab.id
                    ? 'bg-[#1f1f24] text-white border border-white/[0.1]'
                    : 'text-[#858585] hover:text-[#cccccc]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-2xl bg-[#141417] border border-white/[0.06] hover:border-white/[0.15] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#a1a1aa] border border-white/[0.06]">
                          {project.categoryLabel}
                        </span>
                        <span className="text-[11px] font-mono text-[#71717a]">{project.duration}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white tracking-tight">{project.name}</h3>
                    </div>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#18181b] hover:bg-[#202024] text-[#a1a1aa] hover:text-white border border-white/[0.08] transition-colors"
                        title="Visit Live URL"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-5">
                    {project.summary}
                  </p>

                  <div className="space-y-2 mb-6">
                    {project.architecture.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#cccccc]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-1.5 flex-shrink-0" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  {project.tech.map((techItem) => (
                    <span
                      key={techItem}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#18181b] text-[#a1a1aa] border border-white/[0.06]"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="scroll-mt-24">
          <div className="mb-8">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1">
              Career Timeline
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em]">
              Professional Experience
            </h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="p-6 rounded-2xl bg-[#141417] border border-white/[0.06] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">{exp.role}</h3>
                    <div className="text-xs sm:text-sm text-[#0071e3] font-medium flex items-center gap-2">
                      <span>{exp.company}</span>
                      <span className="text-[#3f3f46]">•</span>
                      <span className="text-xs text-[#71717a] font-mono">{exp.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto mt-1 sm:mt-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#a1a1aa] border border-white/[0.06]">
                      {exp.badge}
                    </span>
                    <span className="text-xs font-mono text-[#71717a]">{exp.period}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-4">{exp.description}</p>

                <div className="space-y-2 mb-4">
                  {exp.keyPoints.map((point, pi) => (
                    <div key={pi} className="flex items-start gap-2.5 text-xs text-[#cccccc]">
                      <span className="text-[#0071e3] font-bold mt-0.5">•</span>
                      <span className="leading-snug">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#18181b] text-[#a1a1aa] border border-white/[0.06]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="education" className="scroll-mt-24">
          <div className="mb-8">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1">
              Academics
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em]">
              Education & Degrees
            </h2>
          </div>

          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-6 rounded-2xl bg-[#141417] border border-white/[0.06] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-white tracking-tight">{edu.degree}</h3>
                    {edu.isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        In Progress
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-[#0071e3] font-medium">{edu.school}</div>
                  <p className="text-xs text-[#a1a1aa] pt-1 max-w-2xl">{edu.highlights}</p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-xs font-mono text-[#71717a]">{edu.period}</div>
                  <div className="text-xs font-mono text-[#e4e4e7] mt-1 font-semibold">{edu.grade}</div>
                  <div className="text-[11px] text-[#71717a]">{edu.location}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="scroll-mt-24">
          <div className="mb-8">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1">
              Proficiency
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em]">
              Technical Skills & Tooling
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillGroups.map((group, gi) => (
              <div
                key={gi}
                className="p-5 rounded-2xl bg-[#141417] border border-white/[0.06]"
              >
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md bg-[#18181b] text-[#cccccc] border border-white/[0.06] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="honors" className="scroll-mt-24">
          <div className="mb-8">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1">
              Recognition
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em]">
              Honors & Competitions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {honors.map((h, hi) => (
              <div
                key={hi}
                className="p-5 rounded-2xl bg-[#141417] border border-white/[0.06] flex flex-col justify-between group hover:border-white/[0.15] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-white border border-white/[0.1]">
                      {h.place}
                    </span>
                    <span className="text-xs font-mono text-[#71717a]">{h.year}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">{h.event}</h3>
                  <div className="text-xs text-[#0071e3] font-mono mb-2">{h.organizer}</div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed mb-4">{h.summary}</p>
                </div>

                {h.image && (
                  <button
                    type="button"
                    onClick={() => setPreviewImage(h.image)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#71717a] hover:text-white pt-2 border-t border-white/[0.04] transition-colors cursor-pointer self-start"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>View Certificate / Photo</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 pb-12">
          <div className="mb-8">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] mb-1">
              Get In Touch
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em] mb-2">
              Contact & Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-xl">
              Messages submitted below will be delivered directly to <span className="text-[#38bdf8] font-mono">mandeep.pc2006@gmail.com</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-5 rounded-2xl bg-[#141417] border border-white/[0.06] hover:border-white/[0.15] text-left transition-all cursor-pointer"
            >
              <div className="text-[11px] font-mono uppercase text-[#71717a] mb-1">Email Address</div>
              <div className="text-sm font-semibold text-white truncate">{developer.email}</div>
              <div className="text-[11px] font-mono text-[#0071e3] mt-2 flex items-center gap-1">
                <span>{copiedEmail ? 'Copied to clipboard' : 'Click to copy'}</span>
              </div>
            </button>

            <a
              href={`tel:${developer.phone}`}
              className="p-5 rounded-2xl bg-[#141417] border border-white/[0.06] hover:border-white/[0.15] transition-all"
            >
              <div className="text-[11px] font-mono uppercase text-[#71717a] mb-1">Phone / WhatsApp</div>
              <div className="text-sm font-semibold text-white">{developer.phone}</div>
              <div className="text-[11px] font-mono text-[#0071e3] mt-2 flex items-center gap-1">
                <span>Direct line</span>
              </div>
            </a>

            <a
              href={developer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#141417] border border-white/[0.06] hover:border-white/[0.15] transition-all"
            >
              <div className="text-[11px] font-mono uppercase text-[#71717a] mb-1">LinkedIn</div>
              <div className="text-sm font-semibold text-white">in/mandeepnagar</div>
              <div className="text-[11px] font-mono text-[#0071e3] mt-2 flex items-center gap-1">
                <span>Connect on LinkedIn</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </a>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#141417] border border-white/[0.08]">
            <h3 className="text-base font-semibold text-white mb-1">Send a Direct Message</h3>
            <p className="text-xs text-[#a1a1aa] mb-6">
              Fill out the details below to email Mandeep directly.
            </p>

            {submitStatus && (
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 mb-6 ${submitStatus.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                  }`}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#71717a] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-white/[0.1] text-white placeholder-[#52525b] text-xs sm:text-sm focus:outline-none focus:border-[#0071e3] transition-colors disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#71717a] mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@organization.com"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-white/[0.1] text-white placeholder-[#52525b] text-xs sm:text-sm focus:outline-none focus:border-[#0071e3] transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#71717a] mb-1">Subject (Optional)</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Project inquiry / Full-time role opportunity"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-white/[0.1] text-white placeholder-[#52525b] text-xs sm:text-sm focus:outline-none focus:border-[#0071e3] transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#71717a] mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hello Mandeep, we saw your work and would like to discuss..."
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-white/[0.1] text-white placeholder-[#52525b] text-xs sm:text-sm focus:outline-none focus:border-[#0071e3] transition-colors resize-none disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs tracking-wide transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[85vh] bg-[#141417] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] mb-2">
              <span className="text-xs font-mono text-[#a1a1aa]">Document Preview</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-md text-[#71717a] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center rounded-lg bg-[#09090b]">
              <img
                src={previewImage}
                alt="Document Preview"
                className="max-h-[68vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/[0.06] py-8 px-4 sm:px-6 text-xs font-mono text-[#71717a] relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>© 2026 {developer.name}</span>
            <span className="mx-2">•</span>
            <span>Rajasthan IN</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Terminal className="w-3 h-3 text-[#0071e3]" />
              <span>VS Code Theme Mode</span>
            </Link>
            <span>•</span>
            <a href="https://mandeepiitp.tech" className="hover:text-white transition-colors">
              mandeepiitp.tech
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}