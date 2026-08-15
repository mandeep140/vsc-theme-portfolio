// portfolio-data.ts -- All portfolio content structured as VS Code file system

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
        content: `/**
 * index.ts
 * Welcome to my portfolio -- yes, it is a VS Code theme.
 * I am the developer, and this is my story.
 */

interface Developer {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  bio: string;
  interests: string[];
  funFact: string;
}

const developer: Developer = {
  name: "Mandeep Nagar",
  title: "Full Stack Developer",
  location: "Patna, Bihar, India",
  email: "mandeep.pc2006@gmail.com",
  website: "https://mandeepiitp.tech",
  bio: 
    "Full Stack Developer building production-ready SaaS applications with " +
    "Next.js, Express.js, MongoDB, SQLite, and modern web technologies. I lean " +
    "heavily on AI-assisted development to ship faster without compromising " +
    "code quality or scalability -- from idea to deployment, solo or leading a team.",
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

// Fun fact: This portfolio IS a working VS Code theme
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
            content: `/**
 * adjmd.tsx
 * Full-stack advertisement management platform
 */

interface Project {
  name: string;
  description: string;
  techStack: string[];
  features: string[];
  year: number;
  status: 'completed' | 'in-progress' | 'archived';
}

const AdJmd: Project = {
  name: "AdJmd",
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
    "Image uploads and media management",
    "Scalable REST APIs",
    "Optimized MongoDB schemas for efficient data management",
  ],
  year: 2025,
  status: "completed",
};

export default AdJmd;`,
          },
          {
            id: 'showa-track',
            name: 'showa-track.ts',
            type: 'file',
            language: 'typescript',
            content: `/**
 * showa-track.ts
 * CRM platform for Out of Home (OOH) advertising agencies
 */

const ShowaTrack = {
  name: "Showa Track",
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
  year: 2025,
  status: "completed",
};

export default ShowaTrack;`,
          },
          {
            id: 'showa-store',
            name: 'showa-store-management.ts',
            type: 'file',
            language: 'typescript',
            content: `/**
 * showa-store-management.ts
 * Offline-first desktop store management system
 */

const ShowaStoreManagement = {
  name: "Showa Store Management",
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
  year: 2026,
  status: "completed",
};

export default ShowaStoreManagement;`,
          },
          {
            id: 'portfolio',
            name: 'vscode-portfolio.tsx',
            type: 'file',
            language: 'tsx',
            content: `/**
 * vscode-portfolio.tsx
 * You are looking at it right now! This very portfolio.
 */

const VSCPortfolio = {
  name: "VS Code Developer Portfolio",
  description:
    "A creative developer portfolio built to look and feel like " +
    "Visual Studio Code. Features a working file explorer, " +
    "syntax-highlighted content, and a functional terminal. " +
    "Because why have a normal portfolio when you can have one " +
    "that makes recruiters go 'wait, that is VS Code?!'",
  techStack: [
    "Next.js",
    "TypeScript",
    "TailwindCSS",
    "Zustand",
    "Lucide Icons",
    "React Syntax Highlighter",
  ],
  features: [
    "Pixel-perfect VS Code dark theme recreation",
    "Working file explorer with folder/file tree",
    "Tabbed editor with syntax highlighting",
    "Functional terminal with 15+ commands",
    "Responsive design for all screen sizes",
    "Smooth animations and transitions",
    "Keyboard shortcuts support",
    "Status bar with live information",
  ],
  year: 2026,
  status: "completed",
  meta: "Yes, this file is self-referential. I thought it was funny.",
};

export default VSCPortfolio;`,
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
            content: `/**
 * cto-showa.ts
 * Chief Technology Officer (CTO) @ Showa
 */

interface WorkExperience {
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
  duration: "Sep 2025 -- Jun 2026",
  location: "Bihar, India",
  description:
    "Led development of three full-stack SaaS applications, owning product " +
    "planning, feature prioritization, client communication, and the complete " +
    "software development lifecycle.",
  achievements: [
    "Led development of three full stack SaaS applications using Next.js, Express.js, MongoDB, SQLite, and Tailwind CSS",
    "Managed product planning, feature prioritization, client communication, and the complete software development lifecycle",
    "Designed scalable backend architecture, authentication systems, deployment workflows, and production releases",
  ],
  technologies: [
    "Next.js", "Express.js", "MongoDB", "SQLite", "Tailwind CSS",
  ],
};

export default ctoShowa;`,
          },
          {
            id: 'freelance-quickvenue',
            name: 'freelance-quick-venue.ts',
            type: 'file',
            language: 'typescript',
            content: `/**
 * freelance-quick-venue.ts
 * Freelance Full Stack Developer @ Quick Venue
 */

const freelanceQuickVenue = {
  company: "Quick Venue",
  role: "Freelance Full Stack Developer",
  duration: "Jun 2026 -- Jul 2026",
  location: "Remote",
  description:
    "Built backend APIs for an AI-powered venue booking platform, designing " +
    "scalable schemas and business logic for multiple user roles.",
  achievements: [
    "Developed backend APIs for an AI powered venue booking platform using Express.js and MongoDB",
    "Designed scalable schemas for venues, cafes, vendors, bookings, quotations, payments, and role based access control",
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
            content: `/**
 * stc-member.ts
 * Member, Student Technical Council (STC) @ IIT Patna
 */

const stcMember = {
  company: "Indian Institute of Technology Patna",
  role: "Member, Student Technical Council (STC)",
  duration: "Sep 2025 -- Present",
  location: "Bihar, India",
  description:
    "Building and maintaining institute and technical fest websites, and " +
    "sharing web development and DevOps knowledge within the council.",
  achievements: [
    "Developed the frontend and complete backend of the STC IITP Hybrid website",
    "Developed and maintained the Xenith technical fest website throughout the event",
    "Contributed to the development of the Phoenix technical fest website",
    "Shared valuable content related to Web Development and DevOps in official channels",
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
            content: `/**
 * iit-patna-bs.ts
 * B.S. in Computer Science
 */

const education = {
  degree: "Bachelor of Science in Computer Science",
  university: "Indian Institute of Technology Patna",
  duration: "Dec 2024 -- Present",
  cgpa: "8.9 / 10",
  location: "Bihar, India",
};

export default education;`,
          },
          {
            id: 'senior-secondary',
            name: 'senior-secondary.ts',
            type: 'file',
            language: 'typescript',
            content: `/**
 * senior-secondary.ts
 * Senior Secondary (Class XII), PCM
 */

const seniorSecondary = {
  degree: "Senior Secondary (Class XII), PCM",
  school: "SVGMS",
  location: "Rajasthan, India",
  year: 2024,
};

export default seniorSecondary;`,
          },
        ],
      },
      {
        id: 'skills',
        name: 'skills.ts',
        type: 'file',
        language: 'typescript',
        content: `/**
 * skills.ts
 * Technical skills
 */

interface SkillCategory {
  category: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["Python", "JavaScript", "TypeScript", "SQL (PostgreSQL)", "HTML", "CSS"],
  },
  {
    category: "Frameworks",
    skills: ["React", "Next.js", "Node.js", "Express.js", "Vite"],
  },
  {
    category: "Databases",
    skills: ["MongoDB", "SQLite", "PostgreSQL"],
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
    skills: ["Tailwind CSS", "shadcn/ui", "Bootstrap", "REST APIs", "Electron", "Cron Jobs"],
  },
];

export default skillCategories;`,
      },
      {
        id: 'contact',
        name: 'contact.ts',
        type: 'file',
        language: 'typescript',
        content: `/**
 * contact.ts
 * Let us connect! Here is how to reach me.
 */

const contactInfo = {
  email: "mandeep.pc2006@gmail.com",
  phone: "+91 99204 80615",
  linkedin: "https://linkedin.com/in/mandeepnagar",
  portfolio: "https://mandeepiitp.tech",
  location: "Patna, Bihar, India",
  availability: "Open to opportunities",
};

// Prefer email for serious inquiries

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
            id: 'white_logo',
            name: 'white_logo.png',
            type: 'file',
            language: 'binary',
            content: undefined,
          },
        ],
      },
    ],
  },
];

// Helper to find a file by ID in the tree
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

// Get all files (flat list)
export function getAllFiles(nodes: FileNode[]): FileNode[] {
  const files: FileNode[] = [];
  for (const node of nodes) {
    if (node.type === 'file') files.push(node);
    if (node.children) files.push(...getAllFiles(node.children));
  }
  return files;
}

// Get file path
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