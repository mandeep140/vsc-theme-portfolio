import { create } from 'zustand';
import { FileNode, findFileById, getFilePath, fileTree } from '@/data/portfolio-data';
import { playToastSound, playToggleSound } from '@/lib/sound';

export interface Tab {
  id: string;
  name: string;
  language?: string;
  path: string[];
}

interface PortfolioStore {
  fileTree: FileNode[];
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;

  openTabs: Tab[];
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;
  openFile: (file: FileNode) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (id: string) => void;
  reorderTabs: (sourceIndex: number, destinationIndex: number) => void;
  setOpenTabs: (tabs: Tab[]) => void;

  mdPreviewMode: boolean;
  toggleMdPreview: () => void;

  terminalHistory: TerminalLine[];
  terminalInput: string;
  currentDir: string;
  setTerminalInput: (input: string) => void;
  executeCommand: (command: string) => void;
  clearTerminal: () => void;

  activeSidebarPanel: 'explorer' | 'search' | 'git' | 'extensions' | 'contact' | 'profile' | 'settings' | 'assistant' | 'feedback';
  setActiveSidebarPanel: (panel: PortfolioStore['activeSidebarPanel']) => void;
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number;
  setSidebarWidth: (w: number) => void;

  terminalVisible: boolean;
  toggleTerminal: () => void;
  terminalHeight: number;
  setTerminalHeight: (h: number) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: FileNode[];

  isMobile: boolean;
  setIsMobile: (v: boolean) => void;
  mobileMoreOpen: boolean;
  setMobileMoreOpen: (v: boolean) => void;

  toasts: Toast[];
  showToast: (message: string) => void;
  dismissToast: (id: number) => void;

  commandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (v: boolean) => void;

  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  colorTheme: string;
  setColorTheme: (colorTheme: string) => void;

  editorFontSize: number;
  setEditorFontSize: (size: number) => void;
  showLineNumbers: boolean;
  toggleLineNumbers: () => void;
  wordWrap: boolean;
  toggleWordWrap: () => void;
  tabSize: number;
  setTabSize: (size: number) => void;
  cursorStyle: 'line' | 'block' | 'underline' | 'none';
  setCursorStyle: (style: 'line' | 'block' | 'underline' | 'none') => void;
  breadcrumbsVisible: boolean;
  toggleBreadcrumbs: () => void;
  resetSettings: () => void;

  tourOpen: boolean;
  startTour: () => void;
  closeTour: () => void;

  soundEnabled: boolean;
  toggleSound: () => void;
  soundVolume: number;
  setSoundVolume: (volume: number) => void;
}

export interface Toast {
  id: number;
  message: string;
  timestamp: number;
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'command' | 'success' | 'info' | 'warning' | 'dim' | 'highlight';
  content: string;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  fileTree,
  expandedFolders: new Set(['src', 'projects', 'experience', 'education']),
  toggleFolder: (id: string) =>
    set((state) => {
      const next = new Set(state.expandedFolders);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { expandedFolders: next };
    }),

  openTabs: [],
  activeTabId: null,
  setActiveTabId: (id: string | null) => set({ activeTabId: id }),
  openFile: (file: FileNode) => {
    const { openTabs } = get();
    const existing = openTabs.find((t) => t.id === file.id);
    if (existing) {
      set({ activeTabId: file.id });
      return;
    }
    const path = getFilePath(fileTree, file.id);
    const newTab: Tab = {
      id: file.id,
      name: file.name,
      language: file.language,
      path,
    };
    set({
      openTabs: [...openTabs, newTab],
      activeTabId: file.id,
    });
  },
  closeTab: (id: string) => {
    const { openTabs, activeTabId } = get();
    const filtered = openTabs.filter((t) => t.id !== id);
    let newActiveId = activeTabId;
    if (activeTabId === id) {
      const idx = openTabs.findIndex((t) => t.id === id);
      newActiveId = filtered[Math.min(idx, filtered.length - 1)]?.id ?? null;
    }
    set({ openTabs: filtered, activeTabId: newActiveId });
  },
  closeOtherTabs: (id: string) => {
    const { openTabs } = get();
    const target = openTabs.find((t) => t.id === id);
    if (target) {
      set({ openTabs: [target], activeTabId: id });
    }
  },
  closeAllTabs: () => {
    set({ openTabs: [], activeTabId: null });
  },
  setActiveTab: (id: string) => set({ activeTabId: id }),
  reorderTabs: (sourceIndex: number, destinationIndex: number) => {
    const { openTabs } = get();
    if (
      sourceIndex === destinationIndex ||
      sourceIndex < 0 ||
      destinationIndex < 0 ||
      sourceIndex >= openTabs.length ||
      destinationIndex >= openTabs.length
    ) {
      return;
    }
    const newTabs = [...openTabs];
    const [moved] = newTabs.splice(sourceIndex, 1);
    newTabs.splice(destinationIndex, 0, moved);
    set({ openTabs: newTabs });
  },
  setOpenTabs: (openTabs: Tab[]) => set({ openTabs }),

  mdPreviewMode: false,
  toggleMdPreview: () => set((s) => ({ mdPreviewMode: !s.mdPreviewMode })),

  terminalHistory: [
    { type: 'dim', content: 'Portfolio Terminal v3.0.1' },
    { type: 'dim', content: 'Type "help" to see available commands.' },
    { type: 'output', content: '' },
  ],
  terminalInput: '',
  currentDir: '~/portfolio/src',
  setTerminalInput: (input: string) => set({ terminalInput: input }),
  executeCommand: (command: string) => {
    const { terminalHistory, currentDir } = get();
    const trimmed = command.trim();
    if (!trimmed) return;

    const newHistory = [...terminalHistory, { type: 'input' as const, content: `${currentDir} $ ${trimmed}` }];
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    let output: TerminalLine[] = [];

    switch (cmd) {
      case 'help':
        output = [
          { type: 'highlight', content: 'Available commands:' },
          { type: 'output', content: '' },
          { type: 'info', content: '  help              | Show this help message' },
          { type: 'info', content: '  ls                | List portfolio files' },
          { type: 'info', content: '  cat <file>        | Open a file in the editor' },
          { type: 'info', content: '  clear             | Clear the terminal' },
          { type: 'info', content: '  whoami            | Display developer info' },
          { type: 'info', content: '  skills            | List technical skills' },
          { type: 'info', content: '  projects [list]   | List all 11 personal/hackathon projects' },
          { type: 'info', content: '  project <name>    | Detailed view for a specific project' },
          { type: 'info', content: '  experience        | Show professional experience (4 positions)' },
          { type: 'info', content: '  showa             | Inspect CTO @ Showa (ShowaTrack, Store Mgmt, ADJMD)' },
          { type: 'info', content: '  quick-venue       | Inspect Freelance @ Quick Venue' },
          { type: 'info', content: '  stc               | Inspect STC Member @ IIT Patna' },
          { type: 'info', content: '  contact           | Show contact info' },
          { type: 'info', content: '  neofetch          | Display system info' },
          { type: 'info', content: '  date              | Show current date/time' },
          { type: 'info', content: '  echo <text>       | Print text to terminal' },
          { type: 'info', content: '  pwd               | Print working directory' },
          { type: 'info', content: '  cd <dir>          | Change directory' },
          { type: 'info', content: '  sudo hire me      | Try it...' },
          { type: 'info', content: '  stats             | View live views & likes from Redis' },
          { type: 'info', content: '  ai <question>     | Ask Mandeep\'s AI Assistant (Gemini)' },
          { type: 'info', content: '  npm run dev       | Start the portfolio & print /ui link' },
          { type: 'info', content: '  ui / start        | Open user-friendly portfolio UI (/ui)' },
          { type: 'info', content: '  git log           | Show commit history' },
          { type: 'info', content: '  git status        | Show working tree status' },
          { type: 'info', content: '  uname -a          | System information' },
          { type: 'info', content: '  rm -rf /          | Nice try' },
          { type: 'info', content: '  history           | Show command history' },
          { type: 'info', content: '  open <file>       | Open file in editor (alias for cat)' },
          { type: 'info', content: '  tree              | Show file tree' },
          { type: 'output', content: '' },
          { type: 'dim', content: '  Tip: Press Tab for autocomplete' },
        ];
        break;

      case 'ls': {
        const dir = args[0]?.toLowerCase();
        if (dir === 'projects' || dir === 'projects/') {
          output = [
            { type: 'info', content: 'projects/' },
            { type: 'output', content: '  claimproof.ts' },
            { type: 'output', content: '  saarthi.ts' },
            { type: 'output', content: '  vscode-portfolio.tsx' },
            { type: 'output', content: '  theyneedhelp.ts' },
            { type: 'output', content: '  listpro.ts' },
            { type: 'output', content: '  daily-news-provider.ts' },
            { type: 'output', content: '  local-bazaar.ts' },
            { type: 'output', content: '  the-production.tsx' },
            { type: 'output', content: '  offline-todo.ts' },
            { type: 'output', content: '  chaiwala.ts' },
            { type: 'output', content: '  bachelors.ts' },
          ];
        } else if (dir === 'experience' || dir === 'experience/') {
          output = [
            { type: 'info', content: 'experience/' },
            { type: 'output', content: '  cto-showa.ts' },
            { type: 'output', content: '  freelance-quick-venue.ts' },
            { type: 'output', content: '  stc-member.ts' },
            { type: 'output', content: '  freelance-independent.ts' },
          ];
        } else if (dir === 'education' || dir === 'education/') {
          output = [
            { type: 'info', content: 'education/' },
            { type: 'output', content: '  iit-patna-bs.ts' },
            { type: 'output', content: '  senior-secondary.ts' },
            { type: 'output', content: '  secondary.ts' },
          ];
        } else if (dir === 'images' || dir === 'images/') {
          output = [
            { type: 'info', content: 'images/' },
            { type: 'output', content: '  my.png' },
            { type: 'output', content: '  logo.png' },
            { type: 'output', content: '  white_logo.png' },
            { type: 'output', content: '  award.jpeg' },
            { type: 'output', content: '  award2.jpeg' },
            { type: 'output', content: '  hackNtech2.0.jpeg' },
            { type: 'output', content: '  hackNtech2.0_poster.png' },
            { type: 'output', content: '  hackNtech3.0.jpeg' },
            { type: 'output', content: '  idea_station_poster.png' },
            { type: 'output', content: '  pixel_pulse_certificate.jpeg' },
            { type: 'output', content: '  pixel_pulse_poster.png' },
            { type: 'output', content: '  tech_crew.jpeg' },
            { type: 'output', content: '  tech_team.jpeg' },
          ];
        } else if (dir === 'files' || dir === 'files/') {
          output = [
            { type: 'info', content: 'files/' },
            { type: 'output', content: '  mandeep_resume.pdf' },
          ];
        } else {
          output = [
            { type: 'info', content: 'src/' },
            { type: 'output', content: '  projects/' },
            { type: 'output', content: '  experience/' },
            { type: 'output', content: '  education/' },
            { type: 'output', content: '  images/' },
            { type: 'output', content: '  files/' },
            { type: 'output', content: '  index.ts' },
            { type: 'output', content: '  skills.ts' },
            { type: 'output', content: '  achievements.ts' },
            { type: 'output', content: '  contact.ts' },
            { type: 'info', content: '  README.md' },
          ];
        }
        break;
      }

      case 'cat':
      case 'open': {
        const fileName = args.join(' ').toLowerCase();
        const allFiles = getAllFilesFlat(fileTree);
        const file = allFiles.find(
          (f) => f.name.toLowerCase() === fileName || f.id === fileName || f.name.toLowerCase().startsWith(fileName)
        );
        if (file) {
          get().openFile(file);
          if (file.language === 'binary') {
            output = [
              { type: 'success', content: `Opened ${file.name} in the editor (preview mode)` },
            ];
          } else {
            output = [{ type: 'success', content: `Opened ${file.name} in the editor` }];
          }
        } else {
          output = [{ type: 'error', content: `cat: ${args.join(' ')}: No such file or directory` }];
        }
        break;
      }

      case 'clear':
        set({ terminalHistory: [] });
        return;

      case 'whoami':
        output = [
          { type: 'highlight', content: '+--------------------------------+' },
          { type: 'success', content: '|  Mandeep Nagar                 |' },
          { type: 'output', content: '|  Full Stack Developer           |' },
          { type: 'output', content: '|  Patna, Bihar, India            |' },
          { type: 'info', content: '|  mandeep.pc2006@gmail.com       |' },
          { type: 'info', content: '|  mandeepiitp.tech               |' },
          { type: 'highlight', content: '+--------------------------------+' },
        ];
        break;

      case 'skills':
        output = [
          { type: 'highlight', content: '-- Frontend ---------------------' },
          { type: 'success', content: '  React/Next.js  [###################-] 95%' },
          { type: 'success', content: '  TypeScript     [##################.] 92%' },
          { type: 'success', content: '  TailwindCSS    [##################.] 90%' },
          { type: 'output', content: '' },
          { type: 'highlight', content: '-- Backend ----------------------' },
          { type: 'success', content: '  Node.js/Exp    [##################.] 90%' },
          { type: 'success', content: '  MongoDB        [#################--] 85%' },
          { type: 'success', content: '  SQLite         [################---] 82%' },
          { type: 'output', content: '' },
          { type: 'highlight', content: '-- DevOps -----------------------' },
          { type: 'success', content: '  Docker         [################---] 80%' },
          { type: 'success', content: '  CI/CD          [#################--] 85%' },
          { type: 'output', content: '' },
          { type: 'dim', content: '  Type "cat skills.ts" for full details' },
        ];
        break;

      case 'projects':
      case 'project':
      case 'claimproof':
      case 'saarthi':
      case 'theyneedhelp':
      case 'listpro':
      case 'chaiwala':
      case 'bachelors': {
        const sub = (cmd === 'projects' || cmd === 'project') ? (args[0] || '').toLowerCase() : cmd;
        const normalized = sub === 'list' ? '' : sub.replace(/^projects?\//, '').replace(/\.(ts|tsx)$/, '');

        const PROJECT_LOOKUP: Record<string, {
          name: string;
          title: string;
          category: string;
          date: string;
          duration: string;
          tech: string[];
          shortDesc: string;
          features: string[];
          repo?: string;
          live?: string;
          isPrivate?: boolean;
          file: string;
        }> = {
          'claimproof': {
            name: 'ClaimProof',
            title: 'Explainable Insurance Claim Evidence Auditor',
            category: 'AI / Insurance / Full Stack / Hackathon',
            date: 'September 6, 2026',
            duration: '1 day documented development sprint / hackathon prototype',
            tech: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Node.js', 'Express 5', 'MongoDB Atlas', 'Google Gemini', 'Zod', 'Vitest'],
            shortDesc: 'Built an explainable insurance-claim auditing platform that validates documents, detects inconsistencies, grounds findings in policy clauses, and generates a claim-readiness report before submission.',
            features: [
              'Multimodal document extraction with Gemini-powered understanding',
              'Structured field extraction with confidence scoring and page/document provenance',
              'Cross-document entity resolution (policyholder, vehicle numbers, driver, timestamps)',
              'Policy grounding & evidence graph connecting findings directly to insurer/IRDAI clauses',
              'Deterministic validation rules for dates, numbers, and arithmetic; AI for semantic reasoning',
              'Privacy-aware claim sessions with hashed tokens, PII-safe logging, and 160 passing test suites',
            ],
            repo: 'https://github.com/mandeep140/claimproof',
            file: 'claimproof.ts',
          },
          'saarthi': {
            name: 'Saarthi',
            title: 'Safety-Aware Navigation',
            category: 'AI / Maps / Safety / Hackathon',
            date: 'August 2026 – September 2026',
            duration: 'August–September 2026',
            tech: ['Next.js', 'PWA', 'Express 5', 'MongoDB', 'OSRM', 'VersaTiles', 'H3 Spatial Index'],
            shortDesc: 'Built a privacy-aware safety navigation system that evaluates route risk using contextual, time-dependent, and explainable safety signals.',
            features: [
              'H3 geographic spatial segmentation for area-level safety evaluation',
              'OSRM-based route engine with robust fallback architecture and route comparison',
              'Modular backend pipeline: Route, Safety, Confidence, Emergency, and Report engines',
              'Privacy principle: "Collect less - store less - expose less - give AI only what it needs"',
              'Raw location data minimization, reduced timestamp precision, and session-based route IDs',
              'Progressive Web App (PWA) frontend with interactive map integration',
            ],
            file: 'saarthi.ts',
          },
          'vscode-portfolio': {
            name: 'VSCode Theme Portfolio',
            title: 'Interactive VS Code-Themed Developer Portfolio',
            category: 'Frontend / Portfolio',
            date: 'August 15, 2026 – August 17, 2026',
            duration: 'August 15–17, 2026',
            tech: ['Next.js 16', 'TypeScript', 'React 19', 'Tailwind CSS', 'Zustand', 'Radix UI', 'Framer Motion', 'Lucide React', 'Upstash Redis', 'Google Gemini API', 'Vercel'],
            shortDesc: 'Interactive developer portfolio faithfully reproducing Visual Studio Code with working file explorer, tabbed editor, 25+ command terminal, 32 themes, and Gemini AI assistant.',
            features: [
              'Working virtual file system with tabs, syntax highlighting, and pointer reordering',
              'Functional terminal with command history, autocomplete, and live stats',
              'Gemini AI Copilot embedded directly into the workspace',
              'Dynamic theme engine supporting 32 VS Code dark and light themes with full contrast parity',
              'Upstash Redis analytics tracking live page impressions, likes, and visitor reviews',
            ],
            live: 'https://mandeepiitp.tech',
            file: 'vscode-portfolio.tsx',
          },
          'portfolio': {
            name: 'VSCode Theme Portfolio',
            title: 'Interactive VS Code-Themed Developer Portfolio',
            category: 'Frontend / Portfolio',
            date: 'August 15, 2026 – August 17, 2026',
            duration: 'August 15–17, 2026',
            tech: ['Next.js 16', 'TypeScript', 'React 19', 'Tailwind CSS', 'Zustand', 'Radix UI', 'Framer Motion', 'Lucide React', 'Upstash Redis', 'Google Gemini API', 'Vercel'],
            shortDesc: 'Interactive developer portfolio faithfully reproducing Visual Studio Code with working file explorer, tabbed editor, 25+ command terminal, 32 themes, and Gemini AI assistant.',
            features: [
              'Working virtual file system with tabs, syntax highlighting, and pointer reordering',
              'Functional terminal with command history, autocomplete, and live stats',
              'Gemini AI Copilot embedded directly into the workspace',
              'Dynamic theme engine supporting 32 VS Code dark and light themes with full contrast parity',
              'Upstash Redis analytics tracking live page impressions, likes, and visitor reviews',
            ],
            live: 'https://mandeepiitp.tech',
            file: 'vscode-portfolio.tsx',
          },
          'theyneedhelp': {
            name: 'TheyNeedHelp',
            title: 'Community Help & Case Resolution Platform',
            category: 'Full Stack / Community Platform',
            date: 'April 7, 2025 – April 16, 2025',
            duration: '10 days',
            tech: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'EJS Mate', 'Passport', 'Cloudinary', 'Multer', 'Nodemailer', 'Joi'],
            shortDesc: 'Built a full-stack community help platform with authentication, media uploads, NGO/admin roles, location-based discovery, comments, and case-resolution workflows.',
            features: [
              'Passport authentication with email OTP verification and forgot-password OTP recovery',
              'Case creation, editing, and deletion with image/video uploads via Cloudinary & Multer',
              'Location/state-based case search and discovery filtering',
              'Discussion comments on community cases',
              'Multi-role authorization: User, NGO, and Administrator roles with resolution workflows',
            ],
            repo: 'https://github.com/mandeep140/theyneedhelp',
            file: 'theyneedhelp.ts',
          },
          'listpro': {
            name: 'ListPro',
            title: 'Full-Stack Listing & Review Platform',
            category: 'Full Stack / Marketplace',
            date: 'March 2, 2025 – March 3, 2025',
            duration: '2 days',
            tech: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'EJS Mate', 'Passport Local', 'Joi', 'Connect Mongo', 'Multer', 'Cloudinary'],
            shortDesc: 'Built a full-stack listing platform with authentication, authorization, CRUD operations, reviews, ratings, validation, and MongoDB-backed sessions.',
            features: [
              'User registration, login, and Passport authentication',
              'Listing creation, editing, and deletion guarded by server-side Joi schemas',
              'Ownership-based authorization preventing unauthorized edits',
              'User reviews, star ratings, and review deletion permissions',
              'Cloudinary asset pipeline and Connect-Mongo session persistence',
            ],
            repo: 'https://github.com/mandeep140/ListPro',
            file: 'listpro.ts',
          },
          'daily-news-provider': {
            name: 'Daily News Provider',
            title: 'Automated Daily News Processing System',
            category: 'Automation / Python',
            date: 'August 2026 – September 25, 2026',
            duration: 'August–September 2026',
            tech: ['Python', 'GitHub Actions', 'JSON', 'Git Automation'],
            shortDesc: 'Built a Python-based automated news-processing system with scheduled GitHub Actions workflows and persistent seen-item tracking.',
            features: [
              'Automated news collection and processing pipeline',
              'Daily digest workflow and watch-based update pipeline',
              'Previously-seen item tracking to eliminate duplicate entries',
              'Automated JSON state management with Git-based versioning',
              'Scheduled cron execution via GitHub Actions workflows',
            ],
            isPrivate: true,
            file: 'daily-news-provider.ts',
          },
          'local-bazaar': {
            name: 'Local Bazaar',
            title: 'Hyperlocal E-Commerce PWA',
            category: 'Full Stack / E-Commerce PWA',
            date: 'June 2025 – September 2025',
            duration: 'June–September 2025',
            tech: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'PWA', 'Push Notifications'],
            shortDesc: 'Full order-to-delivery hyperlocal e-commerce system connecting local storefronts directly to consumers with PWA support and push notifications.',
            features: [
              'Direct shop-to-customer model without dark store overhead',
              'Store owner onboarding and catalog management',
              'Full customer checkout, payment, and delivery dispatch workflow',
              'Progressive Web App (PWA) with push notifications for order status',
            ],
            file: 'local-bazaar.ts',
          },
          'the-production': {
            name: 'The Production',
            title: 'Streaming Platform UI Concept',
            category: 'Frontend / UI / Animation',
            date: 'April 4, 2025 – June 4, 2025',
            duration: 'Approximately 2 months',
            tech: ['React 19', 'Vite', 'React Router', 'Tailwind CSS', 'GSAP', 'Framer Motion', 'Barba', 'Lenis'],
            shortDesc: 'Designed and developed an animated streaming-platform UI concept using React, Vite, GSAP, Framer Motion, and smooth route/page transitions.',
            features: [
              'Cinematic landing page with interactive content carousel and media cards',
              'Fluid route and page transitions powered by GSAP and Framer Motion',
              'Lenis smooth scrolling integration for seamless inertial navigation',
              'Client-side error boundaries and media preloading pipeline',
              'Note: Independent streaming-platform UI concept, not an official Netflix product',
            ],
            repo: 'https://github.com/mandeep140/The-Production',
            file: 'the-production.tsx',
          },
          'offline-todo': {
            name: 'Offline Todo',
            title: 'Offline-First Todo PWA',
            category: 'PWA / Offline-First',
            date: 'December 31, 2025',
            duration: '1 day',
            tech: ['Next.js', 'React', 'PWA Technologies', 'Web Storage API', 'Tailwind CSS'],
            shortDesc: 'Built an offline-first Todo PWA for task management with browser persistence and installable offline support.',
            features: [
              'Offline-first task management with immediate local execution',
              'Progressive Web App (PWA) manifest with service worker caching',
              'Persistent browser storage across sessions',
              'Full offline availability without active network connection',
            ],
            file: 'offline-todo.ts',
          },
          'chaiwala': {
            name: 'Chaiwala',
            title: 'Next.js Full-Stack Web Application',
            category: 'Full Stack / Web Application',
            date: 'July 18, 2026 – July 19, 2026',
            duration: '2 days',
            tech: ['Next.js 16', 'React 19', 'MongoDB', 'Mongoose', 'bcryptjs', 'Tailwind CSS', 'Shadcn/UI', 'Lucide React'],
            shortDesc: 'Developed a Next.js full-stack web application using React, MongoDB, Mongoose, Tailwind CSS, and authentication-oriented backend infrastructure.',
            features: [
              'Next.js 16 full-stack App Router architecture',
              'Responsive React-based user interface styled with Tailwind CSS',
              'MongoDB data layer with Mongoose modeling and schemas',
              'Authentication-related implementation with password hashing (bcryptjs)',
              'Reusable UI components and design system tokens',
            ],
            repo: 'https://github.com/mandeep140/chaiwala',
            live: 'https://chaiwala-ten.vercel.app',
            file: 'chaiwala.ts',
          },
          'bachelors': {
            name: 'Bachelors',
            title: 'Private Next.js Application',
            category: 'Full Stack / Web Application',
            date: 'February 16, 2026',
            duration: '1 day documented development',
            tech: ['Next.js', 'React', 'JavaScript', 'Authentication', 'Vercel'],
            shortDesc: 'Built a private Next.js application with authentication, multi-page navigation, and monthly date/reset functionality.',
            features: [
              'Multi-page application navigation and layout structure',
              'Authentication functionality and session handling',
              'Monthly date handling logic and automated reset cycles',
              'Responsive web interface deployed on Vercel',
            ],
            isPrivate: true,
            file: 'bachelors.ts',
          },
        };

        const target = normalized ? (PROJECT_LOOKUP[normalized] || Object.values(PROJECT_LOOKUP).find(p => p.name.toLowerCase() === normalized)) : null;

        if (target) {
          output = [
            { type: 'highlight', content: `+-- [Project: ${target.name}] --------------------------------+` },
            { type: 'info', content: `  Title:       ${target.title}` },
            { type: 'output', content: `  Category:    ${target.category}` },
            { type: 'output', content: `  Date:        ${target.date}` },
            { type: 'output', content: `  Duration:    ${target.duration}` },
            { type: 'output', content: `  Tech Stack:  ${target.tech.join(', ')}` },
            { type: 'output', content: '' },
            { type: 'success', content: `  Overview:` },
            { type: 'output', content: `    ${target.shortDesc}` },
            { type: 'output', content: '' },
            { type: 'success', content: `  Key Features:` },
            ...target.features.map(f => ({ type: 'output' as const, content: `    * ${f}` })),
            { type: 'output', content: '' },
            {
              type: target.isPrivate ? 'warning' : 'info',
              content: `  Repository:  ${target.isPrivate ? 'Private Project' : (target.repo || 'N/A')}`,
            },
            ...(target.live ? [{ type: 'info' as const, content: `  Live Demo:   ${target.live}` }] : []),
            { type: 'highlight', content: `+------------------------------------------------------------+` },
            { type: 'dim', content: `  Tip: Type "cat ${target.file}" to open source in the editor.` },
          ];
        } else if (normalized) {
          output = [
            { type: 'error', content: `Project "${normalized}" not found.` },
            { type: 'dim', content: 'Type "projects" to view the complete list of 11 portfolio projects.' },
          ];
        } else {
          output = [
            { type: 'highlight', content: '+--------------------------------------------------------------------------+' },
            { type: 'highlight', content: '|  #   Project                  Period           Category / Status         |' },
            { type: 'highlight', content: '+--------------------------------------------------------------------------+' },
            { type: 'output', content: '|  1   ClaimProof               Sep 6, 2026      AI / Hackathon Prototype  |' },
            { type: 'output', content: '|  2   Saarthi                  Aug – Sep 2026   AI / Hackathon Project    |' },
            { type: 'output', content: '|  3   VSCode Theme Portfolio   Aug 15–17, 2026  Frontend / Live & Active  |' },
            { type: 'output', content: '|  4   TheyNeedHelp             Apr 7–16, 2025   Full Stack / Completed    |' },
            { type: 'output', content: '|  5   ListPro                  Mar 2–3, 2025    Full Stack / Completed    |' },
            { type: 'output', content: '|  6   Daily News Provider      Aug–Sep 2026     Private / Automation      |' },
            { type: 'output', content: '|  7   Local Bazaar             Jun–Sep 2025     E-Commerce / Prototype    |' },
            { type: 'output', content: '|  8   The Production           Apr 4–Jun 4, 25  Frontend UI Concept       |' },
            { type: 'output', content: '|  9   Offline Todo             Dec 31, 2025     PWA / Completed           |' },
            { type: 'output', content: '|  10  Chaiwala                 Jul 18–19, 2026  Full Stack / Deployed     |' },
            { type: 'output', content: '|  11  Bachelors                Feb 16, 2026     Private Project           |' },
            { type: 'highlight', content: '+--------------------------------------------------------------------------+' },
            { type: 'dim', content: '  Type "project <name>" (e.g. project claimproof) or "cat <file>" to inspect.' },
          ];
        }
        break;
      }

      case 'contact':
        output = [
          { type: 'highlight', content: '-- Contact Info -----------------' },
          { type: 'output', content: '' },
          { type: 'info', content: '  Email:    mandeep.pc2006@gmail.com' },
          { type: 'info', content: '  Phone:    +91 99204 80615' },
          { type: 'info', content: '  LinkedIn: linkedin.com/in/mandeepnagar' },
          { type: 'info', content: '  Website:  mandeepiitp.tech' },
          { type: 'output', content: '' },
          { type: 'info', content: '  Location: Patna, Bihar, India' },
          { type: 'success', content: '  Status:   Open to full-time roles, freelance & collaborations' },
        ];
        break;

      case 'experience':
        output = [
          { type: 'highlight', content: '-- Professional Experience -------------------------' },
          { type: 'output', content: '' },
          { type: 'success', content: '  1. Chief Technology Officer (CTO)' },
          { type: 'output', content: '     Company: Showa | Jul 2025 -- Jun 2026 | Bihar, India' },
          { type: 'dim', content: '     Key Projects / Deliverables:' },
          { type: 'info', content: '       * Showa Track: CRM for OOH advertising agencies with automated proposals & conflict detection' },
          { type: 'info', content: '       * Showa Store Management: Offline-first desktop POS & inventory system (SQLite, LAN, Electron)' },
          { type: 'info', content: '       * ADJMD: Built under Showa -- Full-stack ad inventory platform (ImageKit, RBAC, 1-mo sprint)' },
          { type: 'output', content: '' },
          { type: 'success', content: '  2. Freelance Developer' },
          { type: 'output', content: '     Company: Quick Venue | Jun 2026 -- Aug 2026 | Remote' },
          { type: 'info', content: '     * Built backend REST APIs & RBAC schemas for AI-powered venue & cafe reservation platform' },
          { type: 'output', content: '' },
          { type: 'success', content: '  3. Core Technical Member (WebWiser)' },
          { type: 'output', content: '     Organization: Student Technical Council (STC), IIT Patna | Sep 2025 -- Present' },
          { type: 'info', content: '     * STC Hybrid Programs: Architected and maintain backend for the STC IITP Hybrid campus portal' },
          { type: 'info', content: '     * Xenith Technical Fest: Built event and registration platform for IIT Patna\'s premier fest' },
          { type: 'output', content: '' },
          { type: 'success', content: '  4. Freelance Developer (Independent)' },
          { type: 'output', content: '     Practice: Independent | Sep 2025 -- Present | Remote' },
          { type: 'info', content: '     * Shipping full-stack web platforms and SEO implementations end-to-end for private clients' },
          { type: 'output', content: '' },
          { type: 'dim', content: '  Tip: Type "showa", "quick-venue", "stc", or "cat <file>" for full details.' },
        ];
        break;

      case 'showa':
        output = [
          { type: 'highlight', content: '+-- [Experience: CTO @ Showa] ----------------------------+' },
          { type: 'info', content: '  Role:        Chief Technology Officer (CTO)' },
          { type: 'output', content: '  Company:     Showa (Bihar, India)' },
          { type: 'output', content: '  Duration:    Jul 2025 -- Jun 2026' },
          { type: 'output', content: '  Tech Stack:  Next.js, Express.js, MongoDB, SQLite, Electron, Tailwind CSS, NextAuth, ImageKit' },
          { type: 'output', content: '' },
          { type: 'success', content: '  Key Work & Commercial Deliverables:' },
          { type: 'output', content: '    1. Showa Track' },
          { type: 'dim', content: '       CRM platform for Out of Home (OOH) advertising agencies automating proposals, media bookings, conflict detection, and email notices.' },
          { type: 'output', content: '    2. Showa Store Management' },
          { type: 'dim', content: '       High-throughput offline-first POS & inventory desktop application with SQLite, multi-device LAN sync, and barcode scanner integration.' },
          { type: 'output', content: '    3. ADJMD (Built under Showa)' },
          { type: 'dim', content: '       Full-stack advertisement & media inventory management platform with RBAC and ImageKit asset CDN, shipped to production in 1 month.' },
          { type: 'output', content: '' },
          { type: 'highlight', content: '+----------------------------------------------------------+' },
          { type: 'dim', content: '  Tip: Type "cat cto-showa.ts" to view the full experience file.' },
        ];
        break;

      case 'quick-venue':
      case 'quickvenue':
        output = [
          { type: 'highlight', content: '+-- [Experience: Freelance @ Quick Venue] ----------------+' },
          { type: 'info', content: '  Role:        Freelance Developer' },
          { type: 'output', content: '  Company:     Quick Venue (Remote)' },
          { type: 'output', content: '  Duration:    Jun 2026 -- Aug 2026' },
          { type: 'output', content: '  Tech Stack:  Express.js, MongoDB, REST APIs, JWT, Node.js' },
          { type: 'output', content: '' },
          { type: 'success', content: '  Key Deliverables:' },
          { type: 'output', content: '    * Developed backend REST APIs for AI-powered venue and cafe reservation platform' },
          { type: 'output', content: '    * Designed scalable schemas for venues, cafes, vendors, bookings, quotations, and payments' },
          { type: 'output', content: '    * Built secure authentication and multi-tier role authorization (Admin, Vendor, Customer)' },
          { type: 'highlight', content: '+----------------------------------------------------------+' },
          { type: 'dim', content: '  Tip: Type "cat freelance-quick-venue.ts" for the full file.' },
        ];
        break;

      case 'stc':
        output = [
          { type: 'highlight', content: '+-- [Experience: STC Member @ IIT Patna] -----------------+' },
          { type: 'info', content: '  Role:        Member, WebWiser' },
          { type: 'output', content: '  Council:     Student Technical Council (STC), IIT Patna' },
          { type: 'output', content: '  Duration:    Sep 2025 -- Present (Bihar, India)' },
          { type: 'output', content: '  Tech Stack:  Next.js, React, Node.js, MongoDB, Tailwind CSS, DevOps' },
          { type: 'output', content: '' },
          { type: 'success', content: '  Key Contributions:' },
          { type: 'output', content: '    * STC Hybrid Programs: Architected and actively maintain the entire portal backend' },
          { type: 'output', content: '    * Xenith Technical Fest: Built event and registration platform for IIT Patna\'s premier fest' },
          { type: 'output', content: '    * Phoenix Technical Fest: Contributed to fest frontend and event scheduling' },
          { type: 'output', content: '    * Tech crew lead for STC Immersion events, conducting workshops on web dev & deployment' },
          { type: 'highlight', content: '+----------------------------------------------------------+' },
          { type: 'dim', content: '  Tip: Type "cat stc-member.ts" for the full file.' },
        ];
        break;

      case 'neofetch':
        output = [
          { type: 'info', content: '        /\\                   mandeep@portfolio' },
          { type: 'info', content: '       /  \\                  -----------------' },
          { type: 'success', content: '      /    \\                 OS: PortfolioOS v3.0.1' },
          { type: 'success', content: '     /  /\\  \\                Host: VS Code Theme' },
          { type: 'highlight', content: '    /  /  \\  \\               Kernel: Next.js 16' },
          { type: 'highlight', content: '   /  /    \\  \\              Uptime: 20+ years' },
          { type: 'warning', content: '  /  /      \\  \\             Packages: 40+ technologies' },
          { type: 'warning', content: ' /  /   /\\   \\  \\            Shell: TypeScript 5' },
          { type: 'error', content: '/  /   /  \\   \\  \\           Resolution: Infinite' },
          { type: 'dim', content: '--------------------         DE: React 19' },
          { type: 'dim', content: '                           WM: TailwindCSS' },
          { type: 'dim', content: '                           Terminal: Portfolio Terminal' },
          { type: 'dim', content: '                           CPU: Coffee-Powered Brain' },
          { type: 'dim', content: '                           Memory: Lots of Stack Overflow' },
          { type: 'output', content: '' },
          { type: 'success', content: '   [####]   [####]   [####]   [####]' },
          { type: 'info', content: '   [####]   [####]   [####]   [####]' },
        ];
        break;

      case 'date':
        output = [{ type: 'output', content: new Date().toString() }];
        break;

      case 'echo':
        output = [{ type: 'output', content: args.join(' ') }];
        break;

      case 'pwd':
        output = [{ type: 'output', content: currentDir }];
        break;

      case 'tree':
        output = [
          { type: 'info', content: 'src/' },
          { type: 'dim', content: '+-- projects/' },
          { type: 'output', content: '|   +-- claimproof.ts' },
          { type: 'output', content: '|   +-- saarthi.ts' },
          { type: 'output', content: '|   +-- vscode-portfolio.tsx' },
          { type: 'output', content: '|   +-- theyneedhelp.ts' },
          { type: 'output', content: '|   +-- listpro.ts' },
          { type: 'output', content: '|   +-- daily-news-provider.ts' },
          { type: 'output', content: '|   +-- local-bazaar.ts' },
          { type: 'output', content: '|   +-- the-production.tsx' },
          { type: 'output', content: '|   +-- offline-todo.ts' },
          { type: 'output', content: '|   +-- chaiwala.ts' },
          { type: 'output', content: '|   +-- bachelors.ts' },
          { type: 'dim', content: '+-- experience/' },
          { type: 'output', content: '|   +-- cto-showa.ts' },
          { type: 'output', content: '|   +-- freelance-quick-venue.ts' },
          { type: 'output', content: '|   +-- stc-member.ts' },
          { type: 'output', content: '|   +-- freelance-independent.ts' },
          { type: 'dim', content: '+-- education/' },
          { type: 'output', content: '|   +-- iit-patna-bs.ts' },
          { type: 'output', content: '|   +-- senior-secondary.ts' },
          { type: 'output', content: '|   +-- secondary.ts' },
          { type: 'dim', content: '+-- images/' },
          { type: 'output', content: '|   +-- my.png' },
          { type: 'output', content: '|   +-- logo.png' },
          { type: 'output', content: '|   +-- white_logo.png' },
          { type: 'output', content: '|   +-- award.jpeg' },
          { type: 'output', content: '|   +-- award2.jpeg' },
          { type: 'output', content: '|   +-- hackNtech2.0.jpeg' },
          { type: 'output', content: '|   +-- hackNtech3.0.jpeg' },
          { type: 'output', content: '|   +-- pixel_pulse_certificate.jpeg' },
          { type: 'output', content: '|   +-- tech_crew.jpeg' },
          { type: 'output', content: '|   +-- tech_team.jpeg' },
          { type: 'dim', content: '+-- files/' },
          { type: 'output', content: '|   +-- mandeep_resume.pdf' },
          { type: 'output', content: '+-- index.ts' },
          { type: 'output', content: '+-- skills.ts' },
          { type: 'output', content: '+-- achievements.ts' },
          { type: 'output', content: '+-- contact.ts' },
          { type: 'info', content: '+-- README.md' },
        ];
        break;

      case 'history': {
        const inputs = get().terminalHistory.filter(l => l.type === 'input');
        if (inputs.length === 0) {
          output = [{ type: 'dim', content: 'No command history yet.' }];
        } else {
          output = inputs.map((l, i) => ({ type: 'dim' as const, content: `  ${i + 1}  ${l.content.split(' $ ').pop()}` }));
        }
        break;
      }

      case 'cd': {
        const target = args[0]?.toLowerCase();
        const validDirs = ['~', '~/', 'src', 'src/', 'projects', 'projects/', 'experience', 'experience/', 'education', 'education/', 'images', 'images/'];
        if (!target || target === '~' || target === '~/') {
          set({ currentDir: '~/portfolio' });
        } else if (validDirs.includes(target)) {
          const dirName = target.replace(/\/$/, '');
          set({ currentDir: `~/portfolio/src/${dirName === 'src' ? '' : dirName + '/'}` });
        } else if (target === '..') {
          const parts2 = currentDir.split('/');
          if (parts2.length > 2) {
            parts2.pop();
            set({ currentDir: parts2.join('/') });
          }
        } else {
          output = [{ type: 'error', content: `cd: ${target}: No such directory` }];
        }
        if (output.length === 0) output = [{ type: 'output', content: '' }];
        break;
      }

      case 'sudo':
        if (args.join(' ') === 'hire me') {
          output = [
            { type: 'success', content: '  Executing hire-mandeep.sh ...' },
            { type: 'output', content: '' },
            { type: 'output', content: '  You just found the hire command.' },
            { type: 'output', content: '  Shoot an email and let\'s talk.' },
            { type: 'output', content: '' },
            { type: 'info', content: '  mandeep.pc2006@gmail.com' },
          ];
        } else {
          output = [{ type: 'error', content: `sudo: ${args.join(' ')}: command not found. Try "sudo hire me"` }];
        }
        break;

      case 'npm': {
        const sub = args[0];
        if (sub === 'run' && args[1] === 'dev') {
          output = [
            { type: 'command', content: '> portfolio@3.0.1 dev' },
            { type: 'command', content: '> next dev' },
            { type: 'output', content: '' },
            { type: 'success', content: '  ▲ Next.js 16.3.1 (Turbopack)' },
            { type: 'info', content: '  - Local IDE: http://localhost:3000' },
            { type: 'info', content: '  - Web UI:    https://mandeepiitp.tech/ui (or /ui)' },
            { type: 'success', content: '  ✓ Ready in 180ms' },
            { type: 'output', content: '' },
          ];
        } else {
          output = [{ type: 'error', content: `npm: unknown command "${args.join(' ')}"` }];
        }
        break;
      }

      case 'ui':
      case 'start': {
        if (typeof window !== 'undefined') {
          window.open('/ui', '_blank');
        }
        output = [
          { type: 'success', content: '  Launching user-friendly UI portfolio (/ui)...' },
          { type: 'info', content: '  - URL: https://mandeepiitp.tech/ui' },
        ];
        break;
      }

      case 'git': {
        const sub = args[0];
        if (sub === 'log') {
          output = [
            { type: 'warning', content: 'commit a1b2c3d (HEAD -> main)' },
            { type: 'output', content: 'Author: Mandeep Nagar <mandeep.pc2006@gmail.com>' },
            { type: 'dim', content: 'Date:   ' + new Date().toDateString() },
            { type: 'output', content: '' },
            { type: 'output', content: '    feat: add VS Code themed portfolio' },
            { type: 'output', content: '' },
            { type: 'warning', content: 'commit e4f5g6h' },
            { type: 'output', content: 'Author: Mandeep Nagar <mandeep.pc2006@gmail.com>' },
            { type: 'output', content: '' },
            { type: 'output', content: '    feat: add terminal with commands' },
            { type: 'output', content: '' },
            { type: 'warning', content: 'commit i7j8k9l' },
            { type: 'output', content: 'Author: Mandeep Nagar <mandeep.pc2006@gmail.com>' },
            { type: 'output', content: '' },
            { type: 'output', content: '    feat: implement file explorer and editor' },
          ];
        } else if (sub === 'status') {
          output = [
            { type: 'output', content: 'On branch main' },
            { type: 'dim', content: 'Your branch is up to date with \'origin/main\'.' },
            { type: 'output', content: '' },
            { type: 'success', content: 'nothing to commit, working tree clean' },
          ];
        } else {
          output = [{ type: 'error', content: `git: '${sub || ''}' is not a git command. Try 'git log' or 'git status'.` }];
        }
        break;
      }

      case 'uname':
        output = [{ type: 'output', content: 'PortfolioOS 3.0.1 x86_64 Next.js/16 TypeScript/5' }];
        break;

      case 'stats': {
        output = [
          { type: 'highlight', content: 'Portfolio Analytics (Upstash Redis):' },
          { type: 'dim', content: 'Connecting to Redis...' },
        ];
        if (typeof window !== 'undefined') {
          fetch('/api/stats')
            .then((r) => r.json())
            .then((d) => {
              set((s) => ({
                terminalHistory: [
                  ...s.terminalHistory,
                  { type: 'success', content: `  Total Views : ${d.views ?? 0}` },
                  { type: 'success', content: `  Total Likes : ${d.likes ?? 0}` },
                ],
              }));
            })
            .catch(() => {
              set((s) => ({
                terminalHistory: [
                  ...s.terminalHistory,
                  { type: 'error', content: '  Failed to fetch Redis stats' },
                ],
              }));
            });
        }
        break;
      }

      case 'ai':
      case 'ask': {
        const query = args.join(' ').trim();
        if (!query) {
          output = [
            { type: 'error', content: 'Usage: ai <question>' },
            { type: 'dim', content: 'Example: ai what are Mandeep\'s key projects?' },
          ];
        } else {
          output = [
            { type: 'highlight', content: `[Gemini Copilot]: Thinking...` },
          ];
          if (typeof window !== 'undefined') {
            fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: query }),
            })
              .then((r) => r.json())
              .then((d) => {
                const lines = (d.reply || d.error || 'No response received.').split('\n');
                set((s) => ({
                  terminalHistory: [
                    ...s.terminalHistory,
                    ...lines.map((l: string) => ({ type: 'info' as const, content: `  ${l}` })),
                  ],
                }));
              })
              .catch((err) => {
                set((s) => ({
                  terminalHistory: [
                    ...s.terminalHistory,
                    { type: 'error', content: `  Failed to connect to AI assistant: ${err.message}` },
                  ],
                }));
              });
          }
        }
        break;
      }

      case 'rm':
        output = [
          { type: 'error', content: 'Permission denied. Nice try though.' },
          { type: 'error', content: 'This portfolio is read-only.' },
        ];
        break;

      default:
        output = [{ type: 'error', content: `command not found: ${cmd}. Type "help" for available commands.` }];
    }

    set({ terminalHistory: [...newHistory, ...output], terminalInput: '' });
  },
  clearTerminal: () => set({ terminalHistory: [] }),

  activeSidebarPanel: 'explorer',
  setActiveSidebarPanel: (panel) => set({ activeSidebarPanel: panel, sidebarVisible: true }),
  sidebarVisible: true,
  toggleSidebar: () => set((s) => ({ sidebarVisible: !s.sidebarVisible })),
  sidebarWidth: 240,
  setSidebarWidth: (w: number) => set({ sidebarWidth: Math.max(230, Math.min(500, w)) }),

  terminalVisible: true,
  toggleTerminal: () => set((s) => ({ terminalVisible: !s.terminalVisible })),
  terminalHeight: 220,
  setTerminalHeight: (h: number) => set({ terminalHeight: Math.max(120, Math.min(600, h)) }),

  searchQuery: '',
  setSearchQuery: (query: string) => {
    const allFiles = getAllFilesFlat(fileTree);
    const results = query
      ? allFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          (f.content && f.content.toLowerCase().includes(query.toLowerCase()))
      )
      : [];
    set({ searchQuery: query, searchResults: results });
  },
  searchResults: [],

  isMobile: false,
  setIsMobile: (v: boolean) =>
    set((s) => ({
      isMobile: v,
      sidebarVisible: s.isMobile === v ? s.sidebarVisible : v ? false : true,
    })),
  mobileMoreOpen: false,
  setMobileMoreOpen: (v: boolean) => set({ mobileMoreOpen: v }),

  commandPaletteOpen: false,
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setCommandPaletteOpen: (v: boolean) => set({ commandPaletteOpen: v }),

  toasts: [] as Toast[],
  showToast: (message: string) => {
    const id = Date.now();
    const toast: Toast = { id, message, timestamp: Date.now() };
    playToastSound();
    set((s) => ({ toasts: [...s.toasts, toast] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },
  dismissToast: (id: number) => {
    set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) }));
  },

  theme: typeof window !== 'undefined'
    ? (() => {
      const ct = localStorage.getItem('portfolio-color-theme') || '';
      const t = localStorage.getItem('portfolio-theme') || '';
      const lightThemes = [
        'light',
        'solarized-light',
        'github-light',
        'catppuccin-latte',
        'one-light',
        'quiet-light',
        'gruvbox-light',
        'rose-pine-dawn',
        'ayu-light',
      ];
      if (
        lightThemes.includes(ct) ||
        ct.endsWith('-light') ||
        ct.endsWith('-latte') ||
        ct.endsWith('-dawn') ||
        t === 'light'
      ) {
        return 'light';
      }
      return 'dark';
    })()
    : 'dark',
  setTheme: (theme: 'dark' | 'light') => {
    playToggleSound();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio-theme', theme);
      } catch { }
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.add('theme-light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      } else {
        root.classList.remove('theme-light');
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      }
    }
    set({ theme });
  },

  colorTheme: typeof window !== 'undefined' ? (localStorage.getItem('portfolio-color-theme') || 'dark') : 'dark',
  setColorTheme: (colorTheme: string) => {
    playToggleSound();
    // Determine if this is a light theme variant
    const lightThemes = [
      'light',
      'solarized-light',
      'github-light',
      'catppuccin-latte',
      'one-light',
      'quiet-light',
      'gruvbox-light',
      'rose-pine-dawn',
      'ayu-light',
    ];
    const isLightVariant =
      lightThemes.includes(colorTheme) ||
      colorTheme.endsWith('-light') ||
      colorTheme.endsWith('-latte') ||
      colorTheme.endsWith('-dawn');
    const themeMode: 'dark' | 'light' = isLightVariant ? 'light' : 'dark';

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio-color-theme', colorTheme);
        localStorage.setItem('portfolio-theme', themeMode);
      } catch { }
      const root = document.documentElement;

      // Cleanly remove all previous theme classes
      Array.from(root.classList)
        .filter((c) => c.startsWith('theme-') || c === 'dark' || c === 'light')
        .forEach((c) => root.classList.remove(c));

      // Apply the chosen theme class and data-theme
      if (colorTheme === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else if (colorTheme === 'light') {
        root.classList.add('theme-light');
        root.setAttribute('data-theme', 'light');
      } else {
        root.classList.add(`theme-${colorTheme}`);
        root.setAttribute('data-theme', isLightVariant ? 'light' : 'dark');
        if (isLightVariant) {
          root.classList.add('theme-light');
        } else {
          root.classList.add('dark');
        }
      }
    }
    set({ colorTheme, theme: themeMode });
  },

  editorFontSize: typeof window !== 'undefined' ? parseInt(localStorage.getItem('portfolio_font_size') || '13', 10) : 13,
  setEditorFontSize: (size: number) => {
    playToggleSound();
    const clamped = Math.max(10, Math.min(24, size));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_font_size', String(clamped));
      } catch { }
    }
    set({ editorFontSize: clamped });
  },

  showLineNumbers: typeof window !== 'undefined' ? localStorage.getItem('portfolio_line_numbers') !== 'false' : true,
  toggleLineNumbers: () => {
    playToggleSound();
    set((s) => {
      const next = !s.showLineNumbers;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('portfolio_line_numbers', String(next));
        } catch { }
      }
      return { showLineNumbers: next };
    });
  },

  wordWrap: typeof window !== 'undefined' ? localStorage.getItem('portfolio_word_wrap') === 'true' : false,
  toggleWordWrap: () => {
    playToggleSound();
    set((s) => {
      const next = !s.wordWrap;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('portfolio_word_wrap', String(next));
        } catch { }
      }
      return { wordWrap: next };
    });
  },

  tabSize: typeof window !== 'undefined' ? parseInt(localStorage.getItem('portfolio_tab_size') || '2', 10) : 2,
  setTabSize: (size: number) => {
    playToggleSound();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_tab_size', String(size));
      } catch { }
    }
    set({ tabSize: size });
  },

  cursorStyle: typeof window !== 'undefined' ? (localStorage.getItem('portfolio_cursor_style') as 'line' | 'block' | 'underline' | 'none') || 'line' : 'line',
  setCursorStyle: (style: 'line' | 'block' | 'underline' | 'none') => {
    playToggleSound();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_cursor_style', style);
      } catch { }
    }
    set({ cursorStyle: style });
  },

  breadcrumbsVisible: typeof window !== 'undefined' ? localStorage.getItem('portfolio_breadcrumbs') !== 'false' : true,
  toggleBreadcrumbs: () => {
    playToggleSound();
    set((s) => {
      const next = !s.breadcrumbsVisible;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('portfolio_breadcrumbs', String(next));
        } catch { }
      }
      return { breadcrumbsVisible: next };
    });
  },

  resetSettings: () => {
    playToggleSound();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('portfolio_font_size');
        localStorage.removeItem('portfolio_line_numbers');
        localStorage.removeItem('portfolio_word_wrap');
        localStorage.removeItem('portfolio_tab_size');
        localStorage.removeItem('portfolio_cursor_style');
        localStorage.removeItem('portfolio_breadcrumbs');
        localStorage.removeItem('portfolio_sound_volume');
        localStorage.removeItem('portfolio_sound_enabled');
      } catch { }
    }
    set({
      editorFontSize: 13,
      showLineNumbers: true,
      wordWrap: false,
      tabSize: 2,
      cursorStyle: 'line',
      breadcrumbsVisible: true,
      soundEnabled: true,
      soundVolume: 80,
    });
  },

  tourOpen: false,
  startTour: () => set({ tourOpen: true }),
  closeTour: () => set({ tourOpen: false }),

  soundEnabled: typeof window !== 'undefined' ? localStorage.getItem('portfolio_sound_enabled') !== 'false' : true,
  toggleSound: () => {
    playToggleSound();
    set((s) => {
      const next = !s.soundEnabled;
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_sound_enabled', String(next));
      }
      return { soundEnabled: next };
    });
  },

  soundVolume: typeof window !== 'undefined' ? parseInt(localStorage.getItem('portfolio_sound_volume') || '80', 10) : 80,
  setSoundVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(100, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_sound_volume', String(clamped));
    }
    set({ soundVolume: clamped });
  },
}));

function getAllFilesFlat(nodes: FileNode[]): FileNode[] {
  const files: FileNode[] = [];
  for (const node of nodes) {
    if (node.type === 'file') files.push(node);
    if (node.children) files.push(...getAllFilesFlat(node.children));
  }
  return files;
}
