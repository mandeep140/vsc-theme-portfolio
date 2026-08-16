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

  mdPreviewMode: false,
  toggleMdPreview: () => set((s) => ({ mdPreviewMode: !s.mdPreviewMode })),

  terminalHistory: [
    { type: 'dim', content: 'Portfolio Terminal v1.0.0' },
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
          { type: 'info', content: '  help           | Show this help message' },
          { type: 'info', content: '  ls             | List portfolio files' },
          { type: 'info', content: '  cat <file>     | Open a file in the editor' },
          { type: 'info', content: '  clear          | Clear the terminal' },
          { type: 'info', content: '  whoami         | Display developer info' },
          { type: 'info', content: '  skills         | List technical skills' },
          { type: 'info', content: '  projects       | List all projects' },
          { type: 'info', content: '  contact        | Show contact info' },
          { type: 'info', content: '  experience     | Show work experience' },
          { type: 'info', content: '  neofetch       | Display system info' },
          { type: 'info', content: '  date           | Show current date/time' },
          { type: 'info', content: '  echo <text>    | Print text to terminal' },
          { type: 'info', content: '  pwd            | Print working directory' },
          { type: 'info', content: '  cd <dir>       | Change directory' },
          { type: 'info', content: '  sudo hire me   | Try it...' },
          { type: 'info', content: '  stats          | View live views & likes from Redis' },
          { type: 'info', content: '  ai <question>  | Ask Mandeep\'s AI Assistant (Gemini)' },
          { type: 'info', content: '  npm run dev    | Start the portfolio' },
          { type: 'info', content: '  git log        | Show commit history' },
          { type: 'info', content: '  git status     | Show working tree status' },
          { type: 'info', content: '  uname -a       | System information' },
          { type: 'info', content: '  rm -rf /       | Nice try' },
          { type: 'info', content: '  history        | Show command history' },
          { type: 'info', content: '  open <file>    | Open file in editor (alias for cat)' },
          { type: 'info', content: '  tree           | Show file tree' },
          { type: 'output', content: '' },
          { type: 'dim', content: '  Tip: Press Tab for autocomplete' },
        ];
        break;

      case 'ls': {
        const dir = args[0]?.toLowerCase();
        if (dir === 'projects' || dir === 'projects/') {
          output = [
            { type: 'info', content: 'projects/' },
            { type: 'output', content: '  adjmd.tsx' },
            { type: 'output', content: '  showa-track.ts' },
            { type: 'output', content: '  showa-store-management.ts' },
            { type: 'output', content: '  vscode-portfolio.tsx' },
            { type: 'output', content: '  local-bazaar.ts' },
          ];
        } else if (dir === 'experience' || dir === 'experience/') {
          output = [
            { type: 'info', content: 'experience/' },
            { type: 'output', content: '  cto-showa.ts' },
            { type: 'output', content: '  freelance-independent.ts' },
            { type: 'output', content: '  freelance-quick-venue.ts' },
            { type: 'output', content: '  stc-member.ts' },
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
        output = [
          { type: 'highlight', content: '+----------------------------------------------------+' },
          { type: 'highlight', content: '|  #  Project                   Period    Status   |' },
          { type: 'highlight', content: '+----------------------------------------------------+' },
          { type: 'output', content: '|  1  AdJmd Platform            Jun-Jul 2025  Done |' },
          { type: 'output', content: '|  2  Showa Track               Oct25-Feb26  Done  |' },
          { type: 'output', content: '|  3  Showa Store Mgmt          Feb-Apr 2026  Done |' },
          { type: 'output', content: '|  4  VS Code Portfolio         2026         Done  |' },
          { type: 'output', content: '|  5  Local Bazaar              Jun-Sep 2025  Arch |' },
          { type: 'highlight', content: '+----------------------------------------------------+' },
          { type: 'dim', content: '  Type "cat <filename>" to view project details' },
        ];
        break;

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
          { type: 'highlight', content: '-- Work Experience ----------------' },
          { type: 'output', content: '' },
          { type: 'success', content: '  > CTO' },
          { type: 'output', content: '    Showa | Jul 2025 -- Jun 2026' },
          { type: 'dim', content: '    Bihar, India' },
          { type: 'output', content: '' },
          { type: 'info', content: '  > Freelance Developer (Independent)' },
          { type: 'output', content: '    Sep 2025 -- Present' },
          { type: 'dim', content: '    Remote' },
          { type: 'output', content: '' },
          { type: 'info', content: '  > Freelance Developer' },
          { type: 'output', content: '    Quick Venue | Jun -- Aug 2026' },
          { type: 'dim', content: '    Remote' },
          { type: 'output', content: '' },
          { type: 'warning', content: '  > Member, WebWiser -- STC' },
          { type: 'output', content: '    IIT Patna | Sep 2025 -- Present' },
          { type: 'dim', content: '    Bihar, India' },
          { type: 'output', content: '' },
          { type: 'dim', content: '  Type "cat <filename>" for details' },
        ];
        break;

      case 'neofetch':
        output = [
          { type: 'info', content: '        /\\                   mandeep@portfolio' },
          { type: 'info', content: '       /  \\                  -----------------' },
          { type: 'success', content: '      /    \\                 OS: PortfolioOS v1.0' },
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
          { type: 'output', content: '|   +-- adjmd.tsx' },
          { type: 'output', content: '|   +-- showa-track.ts' },
          { type: 'output', content: '|   +-- showa-store-management.ts' },
          { type: 'output', content: '|   +-- vscode-portfolio.tsx' },
          { type: 'output', content: '|   +-- local-bazaar.ts' },
          { type: 'dim', content: '+-- experience/' },
          { type: 'output', content: '|   +-- cto-showa.ts' },
          { type: 'output', content: '|   +-- freelance-independent.ts' },
          { type: 'output', content: '|   +-- freelance-quick-venue.ts' },
          { type: 'output', content: '|   +-- stc-member.ts' },
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
            { type: 'command', content: '> portfolio@1.0.0 dev' },
            { type: 'command', content: '> next dev' },
            { type: 'output', content: '' },
            { type: 'success', content: '  > Next.js 16.3.1' },
            { type: 'info', content: '  - Local:   http://localhost:3000' },
            { type: 'success', content: '  - Ready in 1.2s' },
            { type: 'output', content: '' },
            { type: 'success', content: '  Portfolio compiled successfully' },
            { type: 'dim', content: '  You are already looking at it!' },
          ];
        } else {
          output = [{ type: 'error', content: `npm: unknown command "${args.join(' ')}"` }];
        }
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
        output = [{ type: 'output', content: 'PortfolioOS 1.0.0 x86_64 Next.js/16 TypeScript/5' }];
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

  theme: 'dark',
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
