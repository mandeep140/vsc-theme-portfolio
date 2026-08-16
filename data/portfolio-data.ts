
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
            id: 'adjmd',
            name: 'adjmd.tsx',
            type: 'file',
            language: 'tsx',
            content: `interface Project {
  name: string;
  type: string;
  duration: string;
  description: string;
  techStack: string[];
  features: string[];
  status: 'completed' | 'in-progress' | 'archived';
}

const AdJmd: Project = {
  name: "AdJmd",
  type: "Client Project",
  duration: "Jun 2025 -- Jul 2025",
  description:
    "A full-stack advertisement management platform for managing media " +
    "inventory, clients, and business operations. Delivered for production " +
    "use within a one-month development cycle.",
  techStack: [
    "Next.js",
    "Express.js",
    "MongoDB",
    "Tailwind CSS",
    "ImageKit",
  ],
  features: [
    "Secure authentication and role-based access control",
    "Image uploads and media management via ImageKit",
    "Scalable REST APIs",
    "Optimized MongoDB schemas for efficient data management",
  ],
  status: "completed",
};

export default AdJmd;`,
          },
          {
            id: 'showa-track',
            name: 'showa-track.ts',
            type: 'file',
            language: 'typescript',
            content: `const ShowaTrack = {
  name: "Showa Track",
  type: "Client Project",
  duration: "Oct 2025 -- Feb 2026",
  description:
    "A CRM platform for Out of Home advertising agencies to manage media " +
    "inventory, bookings, agreements, and proposals -- reducing manual work " +
    "through automation of proposal generation and operational workflows.",
  techStack: [
    "Next.js",
    "MongoDB",
    "NextAuth",
    "Nodemailer",
    "Tailwind CSS",
  ],
  features: [
    "Automated proposal generation, media booking, and operational workflows",
    "Booking conflict detection to prevent duplicate media bookings",
    "Authentication with NextAuth",
    "Scheduled jobs and email notifications",
    "Reporting features",
  ],
  status: "completed",
};

export default ShowaTrack;`,
          },
          {
            id: 'showa-store',
            name: 'showa-store-management.ts',
            type: 'file',
            language: 'typescript',
            content: `const ShowaStoreManagement = {
  name: "Showa Store Management",
  type: "Client Project",
  duration: "Feb 2026 -- Apr 2026",
  description:
    "An offline-first store management system built with Next.js, " +
    "Express.js, SQLite, and Electron -- packaged as a desktop application " +
    "with multi-user LAN support.",
  techStack: [
    "Next.js",
    "Express.js",
    "SQLite",
    "Electron",
    "Tailwind CSS",
  ],
  features: [
    "POS billing and inventory management",
    "Supplier and customer management with debt tracking",
    "Barcode support",
    "Secure role-based authentication with multi-user support",
    "LAN connectivity across multiple devices",
    "Packaged as a desktop application using Electron",
  ],
  status: "completed",
};

export default ShowaStoreManagement;`,
          },
          {
            id: 'portfolio',
            name: 'vscode-portfolio.tsx',
            type: 'file',
            language: 'tsx',
            content: `const VSCPortfolio = {
  name: "VS Code Developer Portfolio",
  type: "Personal Project",
  live: "https://mandeep-vsc.vercel.app",
  description:
    "A creative developer portfolio built to look and feel like " +
    "Visual Studio Code -- featuring a working file explorer, " +
    "syntax-highlighted code content, a functional terminal, " +
    "an interactive feature tour, a Gemini AI copilot, and a " +
    "Redis-backed reviews and live stats system.",
  techStack: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Zustand",
    "Upstash Redis",
    "Google Gemini API",
    "Lucide Icons",
    "React Syntax Highlighter",
    "Vercel",
  ],
  features: [
    "Pixel-perfect VS Code theme (dark and light modes)",
    "Working file explorer with folder and file tree",
    "Tabbed editor with full syntax highlighting",
    "Functional terminal with 15+ built-in commands",
    "Gemini AI Copilot powered by the Gemini API",
    "Redis-backed live views, likes, and reviews system",
    "Interactive guided feature tour",
    "Mobile-first responsive design",
    "Command palette with quick actions",
    "Keyboard shortcuts support",
    "Status bar with live information",
    "Settings panel for theme, font, and cursor customization",
  ],
  year: 2026,
  status: "completed",
  meta: "Yes, this file is self-referential. I thought it was funny.",
};

export default VSCPortfolio;`,
          },
          {
            id: 'local-bazaar',
            name: 'local-bazaar.ts',
            type: 'file',
            language: 'typescript',
            content: `const LocalBazaar = {
  name: "Local Bazaar",
  type: "Personal Project",
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
  achievements: [
    "Led development of three full-stack SaaS applications using Next.js, Express.js, MongoDB, SQLite, and Tailwind CSS",
    "Led a small development team in building and shipping production software",
    "Managed product planning, feature prioritization, client communication, and the complete software development lifecycle",
    "Designed scalable backend architecture, authentication systems, deployment workflows, and production releases",
    "Delivered multiple company and client projects",
  ],
  technologies: [
    "Next.js", "Express.js", "MongoDB", "SQLite", "Tailwind CSS",
  ],
};

export default ctoShowa;`,
          },
          {
            id: 'freelance-independent',
            name: 'freelance-independent.ts',
            type: 'file',
            language: 'typescript',
            content: `const freelanceIndependent = {
  role: "Freelance Developer (Independent)",
  duration: "Sep 2025 -- Present",
  location: "Remote",
  description:
    "Independently shipping freelance web development and SEO projects " +
    "for clients. Currently available for freelance work.",
  achievements: [
    "Shipped multiple freelance client projects end-to-end",
    "Delivered SEO work alongside development projects",
    "Currently available and actively taking on new freelance work",
  ],
  technologies: [
    "Next.js", "Express.js", "MongoDB", "Tailwind CSS", "SEO",
  ],
};

export default freelanceIndependent;`,
          },
          {
            id: 'freelance-quickvenue',
            name: 'freelance-quick-venue.ts',
            type: 'file',
            language: 'typescript',
            content: `const freelanceQuickVenue = {
  company: "Quick Venue",
  role: "Freelance Developer",
  duration: "Jun 2026 -- Aug 2026",
  location: "Remote",
  description:
    "Built backend APIs for an AI-powered venue and cafe booking platform, " +
    "designing scalable schemas and business logic for multiple user roles.",
  achievements: [
    "Developed backend APIs for an AI-powered venue and cafe booking platform using Express.js and MongoDB",
    "Designed scalable schemas for venues, cafes, vendors, bookings, quotations, payments, and role-based access control",
    "Built secure authentication, admin APIs, booking workflow, quotation management, and business logic for multiple user roles",
  ],
  technologies: [
    "Express.js", "MongoDB", "REST APIs", "JWT",
  ],
};

export default freelanceQuickVenue;`,
          },
          {
            id: 'stc-member',
            name: 'stc-member.ts',
            type: 'file',
            language: 'typescript',
            content: `const stcMember = {
  organization: "Student Technical Council (STC), IIT Patna",
  role: "Member, WebWiser",
  duration: "Sep 2025 -- Present",
  location: "Bihar, India",
  description:
    "Building and maintaining the STC IITP Hybrid website backend, " +
    "contributing frontend work across the site, and sharing web development " +
    "and DevOps knowledge within the council.",
  achievements: [
    "Built and still maintain the entire backend of the STC IITP Hybrid website",
    "Significant frontend contributions -- built the Xenith technical fest event page and multiple other pages",
    "Contributed to the Phoenix technical fest website",
    "Share web development and DevOps resources and knowledge in official STC channels",
    "Help conduct technical events",
    "Tech team member for 2nd and 3rd Immersion events conducted by STC IITP Hybrid",
  ],
  technologies: [
    "Next.js", "React", "Node.js", "MongoDB", "Tailwind CSS",
  ],
};

export default stcMember;`,
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
    skills: ["JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
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
    skills: ["NextAuth", "JWT"],
  },
  {
    category: "Developer Tools",
    skills: ["Git", "Docker", "Hoppscotch", "VS Code", "MongoDB Compass"],
  },
  {
    category: "Libraries & Technologies",
    skills: ["Tailwind CSS", "shadcn/ui", "Bootstrap", "REST APIs", "Electron", "Cron Jobs", "ImageKit", "Nodemailer"],
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
- Try \`neofetch\` for a fun system info display
- Use \`cat <file>\` to open files from the terminal

## Tech Stack

This portfolio is built with:
- **Next.js** -- React Framework
- **TypeScript** -- Type Safety
- **TailwindCSS** -- Styling
- **Zustand** -- State Management
- **Lucide Icons** -- Iconography

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