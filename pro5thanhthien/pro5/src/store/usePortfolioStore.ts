import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';

interface PortfolioState {
  // Theme state
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Navigation state
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Mobile menu state
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Project modal state
  selectedProjectId: string | null;
  setSelectedProject: (id: string | null) => void;

  // 3D Avatar state
  isSceneLoaded: boolean;
  setSceneLoaded: (loaded: boolean) => void;
  customModelUrl: string | null;
  customModelName: string | null;
  setCustomModel: (url: string | null, name?: string | null) => void;
  resetCustomModel: () => void;

  // Drag Bike Drive-By & Audio state
  isAudioMuted: boolean;
  toggleAudioMuted: () => void;
  setAudioMuted: (muted: boolean) => void;
  revTriggerCount: number;
  revEngine: () => void;

  // Backwards compatibility for legacy views
  isUiHidden: boolean;
  toggleUiHidden: () => void;
  setLoadingError: (hasError: boolean) => void;
  setSplineApp: (app: unknown) => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('portfolio-theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light') {
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return saved;
    }
  }
  // Default to dark mode
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }
  return 'dark';
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  theme: getInitialTheme(),
  activeSection: 'home',
  isMobileMenuOpen: false,
  selectedProjectId: null,
  isSceneLoaded: false,
  customModelUrl: null,
  customModelName: null,
  isUiHidden: false,

  // Audio Defaults (Web Audio Micro-sounds)
  isAudioMuted: false,
  revTriggerCount: 0,

  toggleTheme: () => {
    const newTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: newTheme });
  },

  setTheme: (theme: ThemeMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  setActiveSection: (section: string) => {
    set({ activeSection: section });
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false });
  },

  setSelectedProject: (id: string | null) => {
    set({ selectedProjectId: id });
  },

  setSceneLoaded: (loaded: boolean) => {
    set({ isSceneLoaded: loaded });
  },

  setCustomModel: (url: string | null, name: string | null = null) => {
    set({ customModelUrl: url, customModelName: name });
  },

  resetCustomModel: () => {
    set({ customModelUrl: null, customModelName: null });
  },

  toggleAudioMuted: () => {
    set((s) => ({ isAudioMuted: !s.isAudioMuted }));
  },

  setAudioMuted: (muted: boolean) => {
    set({ isAudioMuted: muted });
  },

  revEngine: () => {
    set((s) => ({ revTriggerCount: s.revTriggerCount + 1 }));
  },

  toggleUiHidden: () => {
    set((s) => ({ isUiHidden: !s.isUiHidden }));
  },

  setLoadingError: () => {},
  setSplineApp: () => {},
}));
