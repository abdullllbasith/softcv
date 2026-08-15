import { create } from 'zustand';
import {
  ResumeData,
  ResumeProfile,
  TemplateId,
  ExperienceEntry,
  EducationEntry,
  SkillGroup,
  ProjectEntry,
  CertificationEntry,
  LanguageEntry,
  AwardEntry,
  CustomSection,
} from '@/types/resume';
import {
  SAMPLE_RESUME_DATA,
  DEFAULT_BLANK_RESUME,
  INITIAL_PROFILES,
} from '@/lib/initialData';

const LOCAL_STORAGE_KEY = 'live_resume_builder_store_v1';
const MAX_HISTORY_LENGTH = 30;

interface ResumeStoreState {
  profiles: ResumeProfile[];
  activeProfileId: string;
  resumeData: ResumeData;
  focusedFieldId: string | null;
  zoomLevel: number | 'fit';
  isPrintPreview: boolean;
  activeTab: 'edit' | 'preview';
  openSections: Record<string, boolean>;

  // History stack
  history: ResumeData[];
  historyIndex: number;

  // Actions
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  updatePersonalInfo: (field: string, value: string) => void;
  updateSummary: (summary: string) => void;

  // Experience actions
  addExperience: () => void;
  updateExperience: (id: string, entry: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;

  // Education actions
  addEducation: () => void;
  updateEducation: (id: string, entry: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;

  // Skills actions
  addSkillGroup: () => void;
  updateSkillGroup: (id: string, group: Partial<SkillGroup>) => void;
  removeSkillGroup: (id: string) => void;

  // Projects actions
  addProject: () => void;
  updateProject: (id: string, entry: Partial<ProjectEntry>) => void;
  removeProject: (id: string) => void;

  // Certifications actions
  addCertification: () => void;
  updateCertification: (id: string, entry: Partial<CertificationEntry>) => void;
  removeCertification: (id: string) => void;

  // Languages actions
  addLanguage: () => void;
  updateLanguage: (id: string, entry: Partial<LanguageEntry>) => void;
  removeLanguage: (id: string) => void;

  // Awards actions
  addAward: () => void;
  updateAward: (id: string, entry: Partial<AwardEntry>) => void;
  removeAward: (id: string) => void;

  // Custom Sections actions
  addCustomSection: () => void;
  updateCustomSection: (id: string, entry: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;

  // Layout & Settings
  setTemplateId: (templateId: TemplateId) => void;
  setAccentColor: (color: string) => void;
  reorderSections: (newOrder: string[]) => void;
  toggleSectionVisibility: (sectionKey: string) => void;
  setFocusedFieldId: (id: string | null) => void;
  setZoomLevel: (zoom: number | 'fit') => void;
  setIsPrintPreview: (preview: boolean) => void;
  setActiveTab: (tab: 'edit' | 'preview') => void;
  toggleSectionOpen: (sectionKey: string) => void;
  setSectionOpen: (sectionKey: string, isOpen: boolean) => void;
  navigateToField: (fieldId: string, sectionKey: string) => void;

  // History controls
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Profile Management
  switchProfile: (profileId: string) => void;
  createProfile: (name: string) => void;
  renameProfile: (profileId: string, newName: string) => void;
  deleteProfile: (profileId: string) => void;
  loadSampleData: () => void;
  resetToBlank: () => void;
  importJson: (jsonData: any) => boolean;

  // LocalStorage Helper
  hydrateFromStorage: () => void;
  saveToStorage: () => void;
}

const getDefaultStoreSlice = () => ({
  profiles: INITIAL_PROFILES,
  activeProfileId: INITIAL_PROFILES[0].id,
  resumeData: INITIAL_PROFILES[0].data,
});

/** Read persisted state — browser only. Never call during SSR module init. */
const readStoredStoreState = (): {
  profiles: ResumeProfile[];
  activeProfileId: string;
  resumeData: ResumeData;
} | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!parsed.profiles || parsed.profiles.length === 0) return null;
    const activeProf =
      parsed.profiles.find((p: ResumeProfile) => p.id === parsed.activeProfileId) ||
      parsed.profiles[0];
    return {
      profiles: parsed.profiles,
      activeProfileId: activeProf.id,
      resumeData: activeProf.data,
    };
  } catch (err) {
    console.error('Failed to load resume state from localStorage', err);
    return null;
  }
};

const initialStore = getDefaultStoreSlice();

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  profiles: initialStore.profiles,
  activeProfileId: initialStore.activeProfileId,
  resumeData: initialStore.resumeData,
  focusedFieldId: null,
  zoomLevel: 100,
  isPrintPreview: false,
  activeTab: 'edit',
  openSections: {
    personalInfo: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: false,
    certifications: false,
    languages: false,
    awards: false,
    customSections: false,
  },

  // History stack setup
  history: [initialStore.resumeData],
  historyIndex: 0,

  setResumeData: (updater) => {
    set((state) => {
      const newData = typeof updater === 'function' ? updater(state.resumeData) : updater;

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      if (newHistory.length >= MAX_HISTORY_LENGTH) {
        newHistory.shift();
      }
      newHistory.push(newData);

      const updatedProfiles = state.profiles.map((p) =>
        p.id === state.activeProfileId
          ? { ...p, data: newData, updatedAt: new Date().toISOString() }
          : p
      );

      const newState = {
        resumeData: newData,
        profiles: updatedProfiles,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };

      setTimeout(() => get().saveToStorage(), 50);

      return newState;
    });
  },

  updatePersonalInfo: (field, value) => {
    get().setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  },

  updateSummary: (summary) => {
    get().setResumeData((prev) => ({
      ...prev,
      summary,
    }));
  },

  // Experience Actions
  addExperience: () => {
    const newEntry: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      isCurrent: true,
      bullets: [''],
    };
    get().setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newEntry],
    }));
  },

  updateExperience: (id, entry) => {
    get().setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, ...entry } : item
      ),
    }));
  },

  removeExperience: (id) => {
    get().setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  },

  reorderExperience: (startIndex, endIndex) => {
    get().setResumeData((prev) => {
      const items = Array.from(prev.experience);
      const [reorderedItem] = items.splice(startIndex, 1);
      items.splice(endIndex, 0, reorderedItem);
      return { ...prev, experience: items };
    });
  },

  // Education Actions
  addEducation: () => {
    const newEntry: EducationEntry = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    get().setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEntry],
    }));
  },

  updateEducation: (id, entry) => {
    get().setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, ...entry } : item
      ),
    }));
  },

  removeEducation: (id) => {
    get().setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  },

  reorderEducation: (startIndex, endIndex) => {
    get().setResumeData((prev) => {
      const items = Array.from(prev.education);
      const [reorderedItem] = items.splice(startIndex, 1);
      items.splice(endIndex, 0, reorderedItem);
      return { ...prev, education: items };
    });
  },

  // Skill Group Actions
  addSkillGroup: () => {
    const newGroup: SkillGroup = {
      id: `skill-${Date.now()}`,
      category: 'New Category',
      skills: [''],
      displayStyle: 'tags',
    };
    get().setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newGroup],
    }));
  },

  updateSkillGroup: (id, group) => {
    get().setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((item) =>
        item.id === id ? { ...item, ...group } : item
      ),
    }));
  },

  removeSkillGroup: (id) => {
    get().setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item.id !== id),
    }));
  },

  // Project Actions
  addProject: () => {
    const newProject: ProjectEntry = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      techStack: [],
      link: '',
      bullets: [''],
    };
    get().setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  },

  updateProject: (id, entry) => {
    get().setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, ...entry } : item
      ),
    }));
  },

  removeProject: (id) => {
    get().setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  },

  // Certifications
  addCertification: () => {
    const newCert: CertificationEntry = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
    };
    get().setResumeData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
  },

  updateCertification: (id, entry) => {
    get().setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        item.id === id ? { ...item, ...entry } : item
      ),
    }));
  },

  removeCertification: (id) => {
    get().setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }));
  },

  // Languages
  addLanguage: () => {
    const newLang: LanguageEntry = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'Fluent',
    };
    get().setResumeData((prev) => ({
      ...prev,
      languages: [...prev.languages, newLang],
    }));
  },

  updateLanguage: (id, entry) => {
    get().setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.map((item) =>
        item.id === id ? { ...item, ...entry } : item
      ),
    }));
  },

  removeLanguage: (id) => {
    get().setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.filter((item) => item.id !== id),
    }));
  },

  // Awards
  addAward: () => {
    const newAward: AwardEntry = {
      id: `award-${Date.now()}`,
      title: '',
      issuer: '',
      date: '',
    };
    get().setResumeData((prev) => ({
      ...prev,
      awards: [...prev.awards, newAward],
    }));
  },

  updateAward: (id, entry) => {
    get().setResumeData((prev) => ({
      ...prev,
      awards: prev.awards.map((item) =>
        item.id === id ? { ...item, ...entry } : item
      ),
    }));
  },

  removeAward: (id) => {
    get().setResumeData((prev) => ({
      ...prev,
      awards: prev.awards.filter((item) => item.id !== id),
    }));
  },

  // Custom Sections
  addCustomSection: () => {
    const newCustom: CustomSection = {
      id: `custom-${Date.now()}`,
      title: 'Additional Information',
      content: '',
    };
    get().setResumeData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newCustom],
    }));
  },

  updateCustomSection: (id, entry) => {
    get().setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((item) =>
        item.id === id ? { ...item, ...entry } : item
      ),
    }));
  },

  removeCustomSection: (id) => {
    get().setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((item) => item.id !== id),
    }));
  },

  // Layout & Settings
  setTemplateId: (templateId) => {
    get().setResumeData((prev) => ({ ...prev, templateId }));
  },

  setAccentColor: (accentColor) => {
    get().setResumeData((prev) => ({ ...prev, accentColor }));
  },

  reorderSections: (newOrder) => {
    get().setResumeData((prev) => ({ ...prev, sectionOrder: newOrder }));
  },

  toggleSectionVisibility: (sectionKey) => {
    get().setResumeData((prev) => {
      const visibility = prev.sectionVisibility || {};
      return {
        ...prev,
        sectionVisibility: {
          ...visibility,
          [sectionKey]: visibility[sectionKey] === false ? true : false,
        },
      };
    });
  },

  setFocusedFieldId: (id) => set({ focusedFieldId: id }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setIsPrintPreview: (preview) => set({ isPrintPreview: preview }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleSectionOpen: (sectionKey) => {
    set((state) => ({
      openSections: {
        ...state.openSections,
        [sectionKey]: !state.openSections[sectionKey],
      },
    }));
  },

  setSectionOpen: (sectionKey, isOpen) => {
    set((state) => ({
      openSections: {
        ...state.openSections,
        [sectionKey]: isOpen,
      },
    }));
  },

  // Click-to-edit bidirectional navigation
  navigateToField: (fieldId, sectionKey) => {
    // Expand section accordion
    get().setSectionOpen(sectionKey, true);

    // Switch to edit tab if on mobile/tablet
    set({ activeTab: 'edit', focusedFieldId: fieldId });

    // Scroll left panel element into view & focus input
    setTimeout(() => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.focus();
        } else {
          const childInput = element.querySelector('input, textarea');
          if (childInput instanceof HTMLElement) {
            childInput.focus();
          }
        }
      }
    }, 100);
  },

  // History controls
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevData = history[prevIndex];
      set({
        resumeData: prevData,
        historyIndex: prevIndex,
      });
      get().saveToStorage();
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextData = history[nextIndex];
      set({
        resumeData: nextData,
        historyIndex: nextIndex,
      });
      get().saveToStorage();
    }
  },

  // Profile Management
  switchProfile: (profileId) => {
    const target = get().profiles.find((p) => p.id === profileId);
    if (target) {
      set({
        activeProfileId: target.id,
        resumeData: target.data,
        history: [target.data],
        historyIndex: 0,
      });
      get().saveToStorage();
    }
  },

  createProfile: (name) => {
    const newProf: ResumeProfile = {
      id: `profile-${Date.now()}`,
      name: name || 'Untitled Resume',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: { ...SAMPLE_RESUME_DATA, templateId: 'modern' },
    };

    set((state) => {
      const updatedProfiles = [...state.profiles, newProf];
      return {
        profiles: updatedProfiles,
        activeProfileId: newProf.id,
        resumeData: newProf.data,
        history: [newProf.data],
        historyIndex: 0,
      };
    });
    get().saveToStorage();
  },

  renameProfile: (profileId, newName) => {
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === profileId ? { ...p, name: newName } : p
      ),
    }));
    get().saveToStorage();
  },

  deleteProfile: (profileId) => {
    const { profiles, activeProfileId } = get();
    if (profiles.length <= 1) return;

    const remaining = profiles.filter((p) => p.id !== profileId);
    const nextActive = activeProfileId === profileId ? remaining[0] : profiles.find((p) => p.id === activeProfileId)!;

    set({
      profiles: remaining,
      activeProfileId: nextActive.id,
      resumeData: nextActive.data,
      history: [nextActive.data],
      historyIndex: 0,
    });
    get().saveToStorage();
  },

  loadSampleData: () => {
    get().setResumeData(() => ({ ...SAMPLE_RESUME_DATA }));
  },

  resetToBlank: () => {
    get().setResumeData(() => ({ ...DEFAULT_BLANK_RESUME }));
  },

  importJson: (jsonData) => {
    try {
      if (jsonData && typeof jsonData === 'object' && jsonData.personalInfo) {
        const fullData: ResumeData = {
          ...DEFAULT_BLANK_RESUME,
          ...jsonData,
          sectionOrder: jsonData.sectionOrder || DEFAULT_BLANK_RESUME.sectionOrder,
          sectionVisibility: jsonData.sectionVisibility || DEFAULT_BLANK_RESUME.sectionVisibility,
        };
        get().setResumeData(fullData);
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON', e);
    }
    return false;
  },

  hydrateFromStorage: () => {
    const stored = readStoredStoreState();
    if (!stored) return;
    set({
      profiles: stored.profiles,
      activeProfileId: stored.activeProfileId,
      resumeData: stored.resumeData,
      history: [stored.resumeData],
      historyIndex: 0,
    });
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const { profiles, activeProfileId } = get();
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ profiles, activeProfileId })
      );
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  },
}));
