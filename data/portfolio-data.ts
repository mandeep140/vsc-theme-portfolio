export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: string;
  language?: string;
  children?: FileNode[];
  content?: string;
}

export const fileTree: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'about-me',
        name: 'index.ts',
        type: 'file',
        language: 'typescript',
        content: `interface Developer {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  bio: string;
  interests: string[];
  funFact: string;
}

const developer: Developer = {
  name: "Mandeep Nagar",
  title: "Full Stack Developer",
  location: "Patna, Bihar, India",
  email: "mandeep.pc2006@gmail.com",
  phone: "+91 99204 80615",
  website: "https://mandeepiitp.tech",
  linkedin: "https://linkedin.com/in/mandeepnagar",
  bio:
    "Full Stack Developer and CTO-experienced builder skilled in shipping " +
    "production SaaS applications, CRM systems, and business automation " +
    "software end-to-end -- from backend architecture to client delivery. " +
    "Proficient in Next.js, Express.js, MongoDB, and AI-assisted development. " +
    "Currently pursuing BS in Computer Science and Data Analytics at IIT Patna, " +
    "actively contributing to campus tech community (STC IITP) and freelancing " +
    "on real-world client projects. Always picking up something new -- fast " +
    "learner, genuinely curious, and never really done with learning.",
  interests: [
    "SaaS Product Development",
    "Backend Architecture & System Design",
    "AI-Assisted Development",
    "DevOps & Deployment Workflows",
    "Offline-First & Desktop Apps (Electron)",
    "Automation",
  ],
  funFact: "I've been CTO of a company, a freelance backend dev, and a full-time CS student -- often all in the same semester.",
};

console.log(
  \`Hey there! I am \${developer.name}. Welcome to my codebase.\`
);

export default developer;`,
      },
      {
        id: 'projects',
        name: 'projects',
        type: 'folder',
        children: [
          {
            id: 'claimproof',
            name: 'claimproof.ts',
            type: 'file',
            language: 'typescript',
            content: `interface ClaimProofProject {
  name: string;
  title: string;
  category: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  repository: string;
  description: string;
  keyFeatures: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    ai: string[];
    validation: string[];
    testing: string[];
  };
  architecture: string[];
  engineeringHighlights: string[];
}

const ClaimProof: ClaimProofProject = {
  name: "ClaimProof",
  title: "Explainable Insurance Claim Evidence Auditor",
  category: "AI / Insurance / Full Stack / Hackathon",
  type: "Personal Hackathon Project",
  status: "Hackathon Project",
  startDate: "September 6, 2026",
  endDate: "September 6, 2026",
  duration: "1 day documented development sprint / hackathon prototype",
  repository: "https://github.com/mandeep140/claimproof",
  description:
    "ClaimProof is a claimant-side insurance claim evidence auditing platform. " +
    "It helps users identify missing documents, inconsistencies, unsupported " +
    "information, and potential claim issues before submitting an insurance claim. " +
    "The application processes insurance policies and supporting documents, " +
    "extracts structured information, compares entities and facts across documents, " +
    "grounds findings in policy clauses, and produces an explainable claim-readiness report.",
  keyFeatures: [
    "Insurance document upload and validation",
    "Motor insurance workflow and Health insurance workflow",
    "Multimodal document extraction with Gemini-powered understanding",
    "Structured field extraction with confidence scoring and page/document provenance",
    "Entity resolution (names, vehicle numbers, driver, policyholder consistency checking)",
    "Policy-period validation and notification-delay checks",
    "Repair-bill and hospital-bill amount consistency checks",
    "Admission and discharge timeline validation",
    "Missing-document detection and policy clause extraction",
    "Policy grounding & evidence graph connecting documents, entities, findings, and clauses",
    "Trusted policy-source discovery (Insurer / IRDAI) & policy-version comparison",
    "Explainable claim-readiness report",
    "Privacy-aware claim sessions with hashed session access and PII-safe logging",
    "Claim-data deletion and retention handling",
    "Deterministic validation for dates, numbers, identifiers with AI used for semantic reasoning",
  ],
  techStack: {
    frontend: ["Next.js 16", "React 19", "Tailwind CSS"],
    backend: ["Node.js", "Express 5", "Mongoose"],
    database: ["MongoDB Atlas"],
    ai: ["Google Gemini", "@google/genai"],
    validation: ["Zod"],
    testing: ["Vitest"],
  },
  architecture: [
    "Provider abstraction for multimodal extraction",
    "Provider abstraction for cross-document entity comparison",
    "Provider abstraction for policy grounding and explanation",
  ],
  engineeringHighlights: [
    "Deterministic rules are used for arithmetic, dates, and identifiers",
    "AI is used strictly for ambiguous semantic tasks and natural-language explanations",
    "Evidence provenance tracks document, page, field, and confidence metrics",
    "No-auth claim sessions use cryptographic per-claim access tokens with IDOR protection",
    "PII-safe logging throughout ingestion pipelines",
    "Backend test suite documented at 160 passing tests",
  ],
};

export default ClaimProof;`,
          },
          {
            id: 'saarthi',
            name: 'saarthi.ts',
            type: 'file',
            language: 'typescript',
            content: `interface SaarthiProject {
  name: string;
  title: string;
  category: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  privacyPrinciple: string;
  coreFeatures: string[];
  privacyImplementation: string[];
  architecture: {
    frontend: string[];
    backend: string[];
    database: string[];
    mapping: string[];
    engines: string[];
  };
}

const Saarthi: SaarthiProject = {
  name: "Saarthi",
  title: "Safety-Aware Navigation",
  category: "AI / Maps / Safety / Hackathon",
  type: "Personal Hackathon Project",
  status: "Hackathon Project",
  startDate: "August 2026",
  endDate: "September 2026",
  duration: "August--September 2026",
  description:
    "Saarthi is a safety-aware navigation system designed to evaluate route risk " +
    "using contextual, time-dependent, and category-specific safety signals " +
    "instead of relying only on conventional shortest-route navigation. " +
    "The system combines route information with H3-based spatial segmentation, " +
    "safety scoring, confidence estimation, and explainable route-risk information.",
  privacyPrinciple: "Collect less - store less - expose less - give AI only what it needs",
  coreFeatures: [
    "Safety-aware route assessment considering context, time, and multi-factor signals",
    "Context-aware and time-dependent route risk evaluation",
    "Category-specific risk calculations and explainable route scoring",
    "Confidence-aware safety outputs and side-by-side route comparison",
    "H3 geographic spatial segmentation",
    "OSRM-based route engine with fallback architecture",
    "Modular backend engine pipeline: Route, Safety, Confidence, Emergency, and Report engines",
    "Privacy-aware data collection with session-based route handling",
    "Progressive Web App (PWA) frontend with interactive map integration",
    "Emergency and incident report workflows",
  ],
  privacyImplementation: [
    "Raw location data minimization",
    "Area and grid-level H3 representation",
    "Reduced timestamp precision",
    "Category and date-based reporting",
    "Reports are not directly treated as raw ML training data",
    "Route IDs stored instead of unnecessarily persisting complete route payloads client-side",
  ],
  architecture: {
    frontend: ["Next.js", "Progressive Web App (PWA)"],
    backend: ["Express 5"],
    database: ["MongoDB"],
    mapping: ["OSRM", "VersaTiles / map tiles", "H3 segmentation"],
    engines: ["Route Engine", "Safety Engine", "Confidence Engine", "Emergency Engine", "Report Engine"],
  },
};

export default Saarthi;`,
          },
          {
            id: 'portfolio',
            name: 'vscode-portfolio.tsx',
            type: 'file',
            language: 'tsx',
            content: `interface PortfolioProject {
  name: string;
  title: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  live: string;
  description: string;
  techStack: string[];
  features: string[];
  status: 'completed' | 'in-progress' | 'archived';
  meta: string;
}

const VSCPortfolio: PortfolioProject = {
  name: "VSCode Theme Portfolio",
  title: "Interactive VS Code-Themed Developer Portfolio",
  category: "Frontend / Portfolio",
  type: "Personal Project",
  startDate: "August 15, 2026",
  endDate: "August 17, 2026",
  live: "https://mandeepiitp.tech",
  description:
    "A creative developer portfolio built to look and feel like " +
    "Visual Studio Code -- featuring a working file explorer, " +
    "syntax-highlighted code content, a functional terminal with 25+ commands, " +
    "an interactive feature tour, a Gemini AI copilot, and a " +
    "Redis-backed reviews and live stats system.",
  techStack: [
    "Next.js 16",
    "TypeScript",
    "React",
    "Tailwind CSS",
    "Zustand",
    "Radix UI",
    "Framer Motion",
    "Lucide React",
    "Google Generative AI SDK",
    "Upstash Redis",
    "NextAuth",
    "Resend",
    "Zod",
    "Vercel",
  ],
  features: [
    "Pixel-perfect VS Code UI with dark, light, and 32 color themes",
    "Working file explorer with folder and file tree navigation",
    "Tabbed editor with syntax highlighting, pointer reordering, and overflow controls",
    "Functional terminal supporting projects, experience, ai, neofetch, and file inspection",
    "Gemini AI Assistant embedded directly in the workspace",
    "Interactive guided feature tour and custom sound effects",
    "Redis-backed live views, likes, and visitor review system",
    "Mobile-responsive layout with safe-area support",
    "Command palette (Ctrl+Shift+P) with quick actions",
  ],
  status: "completed",
  meta: "Canonical central record for the VS Code Portfolio.",
};

export default VSCPortfolio;`,
          },
          {
            id: 'theyneedhelp',
            name: 'theyneedhelp.ts',
            type: 'file',
            language: 'typescript',
            content: `interface TheyNeedHelpProject {
  name: string;
  title: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  repository: string;
  description: string;
  features: string[];
  techStack: string[];
}

const TheyNeedHelp: TheyNeedHelpProject = {
  name: "TheyNeedHelp",
  title: "Community Help & Case Resolution Platform",
  category: "Full Stack / Community Platform",
  type: "Personal Project",
  startDate: "April 7, 2025",
  endDate: "April 16, 2025",
  duration: "10 days",
  repository: "https://github.com/mandeep140/theyneedhelp",
  description:
    "A community platform where people can publish help requests and cases, " +
    "attach supporting media, discover cases by location, communicate through " +
    "comments, and allow authorized NGOs or administrators to manage and resolve cases.",
  features: [
    "User registration and login with Passport authentication",
    "Email OTP verification and forgot-password OTP flow",
    "Case creation, editing, and deletion with image/video uploads",
    "Cloudinary media storage and Multer integration",
    "Case search and filtering by state and geographic location",
    "Discussion threads and case commenting",
    "Role-based authorization: User, NGO, and Administrator roles",
    "Admin user management and NGO-specific state-based case resolution workflow",
    "Solved-case status marking and flash-message feedback",
  ],
  techStack: [
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "EJS",
    "EJS Mate",
    "Passport",
    "Passport Local",
    "Passport Local Mongoose",
    "Cloudinary",
    "Multer",
    "Nodemailer",
    "Express Session",
    "CORS",
    "Joi",
    "dotenv",
    "crypto",
  ],
};

export default TheyNeedHelp;`,
          },
          {
            id: 'listpro',
            name: 'listpro.ts',
            type: 'file',
            language: 'typescript',
            content: `interface ListProProject {
  name: string;
  title: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  repository: string;
  description: string;
  features: string[];
  techStack: string[];
}

const ListPro: ListProProject = {
  name: "ListPro",
  title: "Full-Stack Listing & Review Platform",
  category: "Full Stack / Marketplace",
  type: "Personal Project",
  startDate: "March 2, 2025",
  endDate: "March 3, 2025",
  duration: "2 days",
  repository: "https://github.com/mandeep140/ListPro",
  description:
    "A full-stack listing platform where authenticated users can create, " +
    "manage, review, and rate property and travel listings with ownership-based authorization.",
  features: [
    "User registration, login, and Passport authentication",
    "Listing creation, editing, deletion, and details viewing",
    "Server-side listing validation with Joi schemas",
    "Ownership authorization checks preventing unauthorized modifications",
    "Community reviews and 5-star ratings with review deletion authorization",
    "Connect-Mongo session persistence across browser restarts",
    "Image URL support and Cloudinary media uploads",
    "Flash messages and RESTful method-override for PUT and DELETE requests",
  ],
  techStack: [
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "EJS",
    "EJS Mate",
    "Passport Local",
    "Passport Local Mongoose",
    "Joi",
    "Express Session",
    "Connect Mongo",
    "Multer",
    "Cloudinary",
  ],
};

export default ListPro;`,
          },
          {
            id: 'daily-news-provider',
            name: 'daily-news-provider.ts',
            type: 'file',
            language: 'typescript',
            content: `interface DailyNewsProject {
  name: string;
  title: string;
  category: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  visibility: string;
  description: string;
  features: string[];
  techStack: string[];
}

const DailyNewsProvider: DailyNewsProject = {
  name: "Daily News Provider",
  title: "Automated Daily News Processing System",
  category: "Automation / Python",
  type: "Personal Project",
  status: "Private / Automation Project",
  startDate: "August 2026",
  endDate: "September 25, 2026",
  duration: "August--September 2026",
  visibility: "Private Repository",
  description:
    "A Python automation project for collecting, processing, and tracking " +
    "news items for recurring daily digests and watch-based updates.",
  features: [
    "Automated news processing pipeline",
    "Daily digest workflow",
    "Watch-based update workflow",
    "Previously-seen item tracking to eliminate duplicate entries",
    "Automated JSON state management",
    "Scheduled processing via GitHub Actions",
    "Event-driven update handling",
    "Git-based automation workflows and state persistence",
  ],
  techStack: [
    "Python",
    "GitHub Actions",
    "JSON",
    "Git-based automation workflows",
  ],
};

export default DailyNewsProvider;`,
          },
          {
            id: 'local-bazaar',
            name: 'local-bazaar.ts',
            type: 'file',
            language: 'typescript',
            content: `const LocalBazaar = {
  name: "Local Bazaar",
  type: "Personal Project",
  category: "Full Stack / E-Commerce PWA",
  duration: "Jun 2025 -- Sep 2025",
  description:
    "A full order-to-delivery e-commerce system -- conceptually similar to Blinkit " +
    "but with no dark stores. Items are sent directly from local shops to customers. " +
    "The flow: shop owner onboards and lists their items, customer places an order " +
    "and pays, then the shop fulfills and delivers. Fully built and functional -- " +
    "development was paused after this stage; not currently live.",
  techStack: [
    "Next.js",
    "Node.js",
    "MongoDB",
    "Tailwind CSS",
    "PWA",
    "Push Notifications",
  ],
  features: [
    "Shop owner onboarding and item listing",
    "Full order-to-delivery customer flow",
    "Integrated payment system",
    "Push notifications for order updates",
    "PWA support for mobile install",
  ],
  status: "archived",
  note: "Fully built and functional. Development paused -- not currently deployed.",
};

export default LocalBazaar;`,
          },
          {
            id: 'the-production',
            name: 'the-production.tsx',
            type: 'file',
            language: 'tsx',
            content: `interface TheProductionProject {
  name: string;
  title: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  repository: string;
  description: string;
  features: string[];
  techStack: string[];
}

const TheProduction: TheProductionProject = {
  name: "The Production",
  title: "Streaming Platform UI Concept",
  category: "Frontend / UI / Animation",
  type: "Independent Project",
  startDate: "April 4, 2025",
  endDate: "June 4, 2025",
  duration: "Approximately 2 months",
  repository: "https://github.com/mandeep140/The-Production",
  description:
    "An independent streaming-platform-style frontend concept focused on " +
    "advanced animations, smooth transitions, responsive presentation, " +
    "and interactive page composition. (Independent concept, not an official Netflix product).",
  features: [
    "Animated landing page and immersive media showcase",
    "Home discovery sections with interactive content cards",
    "About page and contact page layouts",
    "Client-side routing with smooth page-to-page transitions",
    "Cinematic intro animation sequence",
    "Smooth scrolling powered by Lenis",
    "Resilient React error boundary",
    "Responsive layout across all breakpoints",
    "Image preloading for snappy media rendering",
  ],
  techStack: [
    "React 19",
    "Vite",
    "React Router",
    "Tailwind CSS",
    "GSAP",
    "Framer Motion",
    "Barba",
    "Lenis",
    "React Icons",
  ],
};

export default TheProduction;`,
          },
          {
            id: 'offline-todo',
            name: 'offline-todo.ts',
            type: 'file',
            language: 'typescript',
            content: `interface OfflineTodoProject {
  name: string;
  title: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  features: string[];
  techStack: string[];
  status: string;
}

const OfflineTodo: OfflineTodoProject = {
  name: "Offline Todo",
  title: "Offline-First Todo PWA",
  category: "PWA / Offline-First",
  type: "Personal Project",
  startDate: "December 31, 2025",
  endDate: "December 31, 2025",
  duration: "1 day",
  status: "completed",
  description:
    "An offline-first task management application focused on browser-side persistence, " +
    "PWA support, and installable web-app behavior.",
  features: [
    "Offline-first task management with immediate local execution",
    "Progressive Web App (PWA) support with service worker caching",
    "Persistent browser storage across sessions",
    "Installable web experience across desktop and mobile devices",
    "Full offline availability without requiring active network connectivity",
  ],
  techStack: [
    "Next.js",
    "React",
    "PWA technologies",
    "Web Storage API",
    "Tailwind CSS",
  ],
};

export default OfflineTodo;`,
          },
          {
            id: 'chaiwala',
            name: 'chaiwala.ts',
            type: 'file',
            language: 'typescript',
            content: `interface ChaiwalaProject {
  name: string;
  title: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  repository: string;
  liveSite: string;
  description: string;
  verifiedFeatures: string[];
  techStack: string[];
}

const Chaiwala: ChaiwalaProject = {
  name: "Chaiwala",
  title: "Next.js Full-Stack Web Application",
  category: "Full Stack / Web Application",
  type: "Personal Project",
  startDate: "July 18, 2026",
  endDate: "July 19, 2026",
  duration: "2 days",
  repository: "https://github.com/mandeep140/chaiwala",
  liveSite: "https://chaiwala-ten.vercel.app",
  description:
    "A Next.js web application built with a modern React frontend, " +
    "MongoDB-backed data layer, and authentication-oriented backend infrastructure.",
  verifiedFeatures: [
    "Next.js full-stack application architecture",
    "React-based responsive user interface",
    "MongoDB integration with Mongoose schemas and models",
    "Authentication-related implementation with password hashing (bcryptjs)",
    "Reusable UI components and design system tooling",
    "Modern responsive styling with Tailwind CSS and Lucide icons",
  ],
  techStack: [
    "Next.js 16",
    "React 19",
    "MongoDB",
    "Mongoose",
    "bcryptjs",
    "Tailwind CSS",
    "Shadcn/UI",
    "Lucide React",
    "Base UI",
  ],
};

export default Chaiwala;`,
          },
          {
            id: 'bachelors',
            name: 'bachelors.ts',
            type: 'file',
            language: 'typescript',
            content: `interface BachelorsProject {
  name: string;
  title: string;
  category: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  liveSite: string;
  visibility: string;
  description: string;
  features: string[];
  techStack: string[];
}

const Bachelors: BachelorsProject = {
  name: "Bachelors",
  title: "Private Next.js Application",
  category: "Full Stack / Web Application",
  type: "Personal Project",
  status: "Private Project",
  startDate: "February 16, 2026",
  endDate: "February 16, 2026",
  duration: "1 day documented development",
  visibility: "Private Project (Source Code Confidential)",
  description:
    "A private Next.js application featuring multiple pages, authentication functionality, " +
    "and monthly date/reset logic.",
  features: [
    "Multi-page application navigation and layout structure",
    "Authentication functionality and session handling",
    "Monthly date handling logic",
    "Reset functionality and state cycles",
    "Application-level responsive UI",
  ],
  techStack: [
    "Next.js",
    "React",
    "JavaScript",
    "Vercel",
    "Authentication functionality",
  ],
};

export default Bachelors;`,
          },
        ],
      },
      {
        id: 'experience',
        name: 'experience',
        type: 'folder',
        children: [
          {
            id: 'cto-showa',
            name: 'cto-showa.ts',
            type: 'file',
            language: 'typescript',
            content: `interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  keyProjects: {
    name: string;
    description: string;
    tech: string[];
    note?: string;
  }[];
  achievements: string[];
  technologies: string[];
}

const ctoShowa: WorkExperience = {
  company: "Showa",
  role: "Chief Technology Officer (CTO)",
  duration: "Jul 2025 -- Jun 2026",
  location: "Bihar, India",
  description:
    "Led development of three full-stack SaaS applications, owning product " +
    "planning, feature prioritization, client communication, and the complete " +
    "software development lifecycle.",
  keyProjects: [
    {
      name: "Showa Track",
      description:
        "A CRM platform for Out of Home (OOH) advertising agencies to manage media " +
        "inventory, bookings, agreements, and proposals -- reducing manual work through " +
        "automated proposal generation, conflict detection, and email notifications.",
      tech: ["Next.js", "MongoDB", "NextAuth", "Nodemailer", "Tailwind CSS"],
    },
    {
      name: "Showa Store Management",
      description:
        "An offline-first desktop store management and POS system built with Next.js, " +
        "Express.js, SQLite, and Electron with multi-user LAN support, inventory tracking, " +
        "supplier debt management, and barcode scanner integration.",
      tech: ["Next.js", "Express.js", "SQLite", "Electron", "Tailwind CSS"],
    },
    {
      name: "ADJMD",
      description:
        "A full-stack advertisement and media inventory management platform for managing " +
        "media inventory, clients, contracts, and business operations. Delivered for " +
        "production use within a 1-month development cycle.",
      tech: ["Next.js", "Express.js", "MongoDB", "Tailwind CSS", "ImageKit"],
      note: "Built under Showa as a major client SaaS deliverable",
    },
  ],
  achievements: [
    "Led development of three full-stack SaaS applications (ShowaTrack, Showa Store Management, ADJMD) using Next.js, Express.js, MongoDB, SQLite, Electron, and Tailwind CSS",
    "Led a development team in building and shipping production software across cloud and offline desktop environments",
    "Managed product planning, feature prioritization, client communication, and the complete software development lifecycle",
    "Designed scalable backend architecture, authentication systems, deployment workflows, and production releases",
    "Delivered multiple company and client deliverables on schedule with high reliability",
  ],
  technologies: [
    "Next.js",
    "Express.js",
    "MongoDB",
    "SQLite",
    "Electron",
    "Tailwind CSS",
    "NextAuth",
    "ImageKit",
    "Nodemailer",
  ],
};

export default ctoShowa;`,
          },
          {
            id: 'freelance-quickvenue',
            name: 'freelance-quick-venue.ts',
            type: 'file',
            language: 'typescript',
            content: `interface FreelanceQuickVenue {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  keyProjects: {
    name: string;
    description: string;
    tech: string[];
  }[];
  achievements: string[];
  technologies: string[];
}

const freelanceQuickVenue: FreelanceQuickVenue = {
  company: "Quick Venue",
  role: "Freelance Developer",
  duration: "Jun 2026 -- Aug 2026",
  location: "Remote",
  description:
    "Built backend APIs for an AI-powered venue and cafe booking platform, " +
    "designing scalable schemas and business logic for multiple user roles.",
  keyProjects: [
    {
      name: "Quick Venue",
      description:
        "AI-powered venue and cafe reservation platform. Built REST APIs, " +
        "role-based access control, booking state machines, and quotation management.",
      tech: ["Express.js", "MongoDB", "REST APIs", "JWT", "Node.js"],
    },
  ],
  achievements: [
    "Developed backend APIs for an AI-powered venue and cafe booking platform using Express.js and MongoDB",
    "Designed scalable schemas for venues, cafes, vendors, bookings, quotations, payments, and role-based access control",
    "Built secure authentication, admin APIs, booking workflow, quotation management, and business logic for multiple user roles",
  ],
  technologies: [
    "Express.js",
    "MongoDB",
    "REST APIs",
    "JWT",
    "Node.js",
  ],
};

export default freelanceQuickVenue;`,
          },
          {
            id: 'stc-member',
            name: 'stc-member.ts',
            type: 'file',
            language: 'typescript',
            content: `interface STCMemberExperience {
  organization: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  keyWork: {
    name: string;
    description: string;
    tech: string[];
  }[];
  achievements: string[];
  technologies: string[];
}

const stcMember: STCMemberExperience = {
  organization: "Student Technical Council (STC), IIT Patna",
  role: "Member, WebWiser",
  duration: "Sep 2025 -- Present",
  location: "Bihar, India",
  description:
    "Building and maintaining the STC IITP Hybrid website backend, " +
    "contributing frontend work across the site, and sharing web development " +
    "and DevOps knowledge within the council.",
  keyWork: [
    {
      name: "STC Hybrid Programs",
      description:
        "Architected and actively maintain the entire backend services for the STC IITP Hybrid campus portal.",
      tech: ["Next.js", "Node.js", "MongoDB", "Express.js"],
    },
    {
      name: "Xenith Technical Fest",
      description:
        "Built the event portal and registration interface for Xenith, IIT Patna's premier technical fest.",
      tech: ["Next.js", "React", "Tailwind CSS"],
    },
    {
      name: "Phoenix Technical Fest",
      description:
        "Contributed to frontend and event scheduling modules for the Phoenix technical fest platform.",
      tech: ["React", "Tailwind CSS"],
    },
  ],
  achievements: [
    "Built and still maintain the entire backend of the STC IITP Hybrid website",
    "Significant frontend contributions -- built the Xenith technical fest event page and multiple other pages",
    "Contributed to the Phoenix technical fest website",
    "Share web development and DevOps resources and knowledge in official STC channels",
    "Help conduct technical events and hackathons",
    "Tech team member for 2nd and 3rd Immersion events conducted by STC IITP Hybrid",
  ],
  technologies: [
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "Tailwind CSS",
    "DevOps",
  ],
};

export default stcMember;`,
          },
          {
            id: 'freelance-independent',
            name: 'freelance-independent.ts',
            type: 'file',
            language: 'typescript',
            content: `interface FreelanceIndependent {
  role: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

const freelanceIndependent: FreelanceIndependent = {
  role: "Freelance Developer (Independent)",
  duration: "Sep 2025 -- Present",
  location: "Remote",
  description:
    "Independently shipping freelance web development and SEO projects " +
    "for clients. Currently available for freelance work.",
  achievements: [
    "Shipped multiple freelance client projects end-to-end",
    "Delivered SEO work alongside development projects resulting in superior visibility",
    "Currently available and actively taking on new freelance work and technical contracts",
  ],
  technologies: [
    "Next.js",
    "Express.js",
    "MongoDB",
    "Tailwind CSS",
    "SEO",
  ],
};

export default freelanceIndependent;`,
          },
        ],
      },
      {
        id: 'education',
        name: 'education',
        type: 'folder',
        children: [
          {
            id: 'iitp-degree',
            name: 'iit-patna-bs.ts',
            type: 'file',
            language: 'typescript',
            content: `const iitPatnaBS = {
  degree: "Bachelor of Science (BS) in Computer Science and Data Analytics/Science",
  university: "Indian Institute of Technology (IIT) Patna",
  location: "Bihar, India",
  duration: "Dec 2024 -- Dec 2028",
  cpi: "8.9 / 10 (as of 3rd semester results)",
  status: "Currently pursuing",
  note: "4-year, 8-semester degree program",
};

export default iitPatnaBS;`,
          },
          {
            id: 'senior-secondary',
            name: 'senior-secondary.ts',
            type: 'file',
            language: 'typescript',
            content: `const seniorSecondary = {
  degree: "Senior Secondary (Class XII), PCM",
  board: "CBSE",
  school: "Swami Vivekanand Government Model School",
  location: "Rajasthan, India",
  passed: 2024,
};

export default seniorSecondary;`,
          },
          {
            id: 'secondary',
            name: 'secondary.ts',
            type: 'file',
            language: 'typescript',
            content: `const secondary = {
  degree: "Secondary (Class X)",
  board: "Maharashtra SSC Board",
  school: "J.A. Meghani English High School",
  location: "Maharashtra, India",
  passed: 2022,
};

export default secondary;`,
          },
        ],
      },
      {
        id: 'achievements',
        name: 'achievements.ts',
        type: 'file',
        language: 'typescript',
        content: `interface Achievement {
  title: string;
  event: string;
  organizer: string;
  year: number;
}

const achievements: Achievement[] = [
  {
    title: "1st Runner-up",
    event: "Hackathon -- hackNtech",
    organizer: "IIT Patna",
    year: 2025,
  },
  {
    title: "1st Runner-up",
    event: "UI/UX Competition -- Pixel Pulse",
    organizer: "IIT Patna",
    year: 2026,
  },
  {
    title: "1st Rank",
    event: "Idea Station",
    organizer: "IIT Patna",
    year: 2025,
  },
  {
    title: "Top 10 Rank",
    event: "Hackathon",
    organizer: "IIT Patna",
    year: 2026,
  },
  {
    title: "Top 7 Rank",
    event: "Hackathon",
    organizer: "IIT Patna",
    year: 2025,
  },
];

export default achievements;`,
      },
      {
        id: 'skills',
        name: 'skills.ts',
        type: 'file',
        language: 'typescript',
        content: `interface SkillCategory {
  category: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["JavaScript", "TypeScript", "SQL", "HTML", "CSS", "Python"],
  },
  {
    category: "Frameworks & Runtime",
    skills: ["React", "Next.js", "Node.js", "Express.js", "Vite"],
  },
  {
    category: "Databases",
    skills: ["MongoDB", "SQLite", "PostgreSQL", "Firebase"],
  },
  {
    category: "Cloud & Infra",
    skills: ["AWS", "Vercel", "Docker"],
  },
  {
    category: "Authentication",
    skills: ["NextAuth", "JWT", "Passport"],
  },
  {
    category: "Developer Tools",
    skills: ["Git", "Docker", "Hoppscotch", "VS Code", "MongoDB Compass"],
  },
  {
    category: "Libraries & Technologies",
    skills: ["Tailwind CSS", "shadcn/ui", "Bootstrap", "REST APIs", "Electron", "Cron Jobs", "ImageKit", "Nodemailer", "H3", "OSRM", "GSAP", "Framer Motion"],
  },
];

export default skillCategories;`,
      },
      {
        id: 'contact',
        name: 'contact.ts',
        type: 'file',
        language: 'typescript',
        content: `const contactInfo = {
  email: "mandeep.pc2006@gmail.com",
  phone: "+91 99204 80615",
  linkedin: "https://linkedin.com/in/mandeepnagar",
  portfolio: "https://mandeepiitp.tech",
  location: "Patna, Bihar, India",
  availability: "Open to full-time roles, freelance projects, and tech collaborations",
};

console.log(
  "Thanks for checking out my portfolio!"
);
console.log(
  "Do not be a stranger -- reach out anytime."
);

export default contactInfo;`,
      },
      {
        id: 'readme',
        name: 'README.md',
        type: 'file',
        language: 'markdown',
        content: `# Mandeep Nagar -- Developer Portfolio

> A full-stack developer portfolio disguised as a VS Code workspace.

## How to Navigate

**File Explorer (Left Panel)**
- Click folders to expand/collapse
- Click files to open them in the editor

**Terminal (Bottom Panel)**
- Type \`help\` to see all available commands
- Type \`projects\` or \`project <name>\` to explore all 11 personal/hackathon projects
- Type \`experience\` to inspect CTO @ Showa, Quick Venue, STC IIT Patna, and Freelance work
- Try \`neofetch\` for a fun system info display
- Use \`cat <file>\` to open files from the terminal

## Tech Stack

This portfolio is built with:
- **Next.js 16** -- React Framework
- **TypeScript** -- Type Safety
- **TailwindCSS** -- Styling
- **Zustand** -- State Management
- **Lucide Icons** -- Iconography
- **Google Generative AI SDK** -- Gemini Copilot

## About

Full Stack Developer building production-ready SaaS applications with
Next.js, Express.js, MongoDB, SQLite, and modern web technologies.
This portfolio is a creative way to showcase my work and skills.

---

*Built with coffee and curiosity*`,
      },
      {
        id: 'images-dir',
        name: 'images',
        type: 'folder',
        children: [
          {
            id: 'white-logo',
            name: 'white_logo.png',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'award',
            name: 'award.jpeg',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'award2',
            name: 'award2.jpeg',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'hackntech-2',
            name: 'hackNtech2.0.jpeg',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'hackntech-2-poster',
            name: 'hackNtech2.0_poster.png',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'hackntech-3',
            name: 'hackNtech3.0.jpeg',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'idea-station-poster',
            name: 'idea_station_poster.png',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'pixel-pulse-cert',
            name: 'pixel_pulse_certificate.jpeg',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'pixel-pulse-poster',
            name: 'pixel_pulse_poster.png',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'tech-crew',
            name: 'tech_crew.jpeg',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
          {
            id: 'tech-team',
            name: 'tech_team.jpeg',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
        ],
      },
      {
        id: 'files-dir',
        name: 'files',
        type: 'folder',
        children: [
          {
            id: 'resume',
            name: 'mandeep_resume.pdf',
            type: 'file',
            language: 'pdf',
            content: undefined,
          },
        ],
      },
    ],
  },
];

export function findFileById(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findFileById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function getAllFiles(nodes: FileNode[]): FileNode[] {
  const files: FileNode[] = [];
  for (const node of nodes) {
    if (node.type === 'file') files.push(node);
    if (node.children) files.push(...getAllFiles(node.children));
  }
  return files;
}

export function getFilePath(nodes: FileNode[], targetId: string, path: string[] = []): string[] {
  for (const node of nodes) {
    const currentPath = [...path, node.name];
    if (node.id === targetId) return currentPath;
    if (node.children) {
      const found = getFilePath(node.children, targetId, currentPath);
      if (found.length > 0) return found;
    }
  }
  return [];
}