# Live Resume Builder — Full Development Prompt

## 0. Objective

Build a **Live Resume Builder** web app with a split-screen interface:
- **Left panel** — form inputs for resume data (scrollable, sectioned)
- **Right panel** — real-time resume preview that updates instantly as the user types (sticky/fixed while left panel scrolls)

The app must support **multiple resume templates**, be fully **light-mode** by default, and deliver a polished, modern, professional UI/UX suitable for a portfolio-grade SaaS product.

---

## 1. Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand (single resume store, persisted to localStorage)
- **Animations:** Framer Motion (panel transitions, section add/remove, template switch)
- **Drag & Drop:** dnd-kit (reorder sections, reorder entries within a section)
- **PDF Export:** react-to-print or html2canvas + jsPDF (pixel-perfect export of the preview pane)
- **Forms:** react-hook-form + zod (validation)
- **Icons:** lucide-react
- **Fonts:** Inter (UI) + 2–3 resume-specific fonts (see Template System)

---

## 2. Layout Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Top Navbar: Logo | Template Switcher | Undo/Redo | Export PDF   │
├───────────────────────────────┬───────────────────────────────────┤
│                                │                                   │
│   LEFT PANEL (45% width)      │   RIGHT PANEL (55% width)         │
│   - Scrollable                │   - Sticky/fixed                  │
│   - Accordion-style sections  │   - Live A4-ratio preview canvas  │
│   - Add/Remove/Reorder items  │   - Zoom controls (75%/100%/125%) │
│   - Section-by-section forms  │   - Page-break indicator for      │
│                                │     multi-page resumes            │
└───────────────────────────────┴───────────────────────────────────┘
```

- Desktop (≥1024px): true split screen, left 40–45%, right 55–60%
- Tablet (768–1023px): split screen collapses to tabs ("Edit" / "Preview") with a toggle
- Mobile (<768px): single column, preview accessible via floating "Preview" button that opens a full-screen modal
- Right panel preview is **sticky** (`position: sticky; top: navbar-height`) so it stays visible while the left panel scrolls independently

---

## 3. Data Model

```typescript
interface ResumeData {
  templateId: string;
  accentColor: string; // user-selectable theme color per template
  personalInfo: {
    fullName: string;
    title: string; // e.g. "Senior Frontend Developer"
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    photoUrl?: string; // optional, only shown in templates that support it
  };
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  awards: AwardEntry[];
  customSections: CustomSection[]; // user-defined sections
  sectionOrder: string[]; // drag-and-drop controlled order
}

interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string | "Present";
  bullets: string[]; // achievement-based bullet points
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface SkillGroup {
  id: string;
  category: string; // e.g. "Frontend", "Tools"
  skills: string[];
  displayStyle: "tags" | "bars" | "dots" | "commaList";
}

interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  link?: string;
  bullets: string[];
}

interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

interface LanguageEntry {
  id: string;
  language: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

interface CustomSection {
  id: string;
  title: string;
  content: string; // rich text or bullet list
}
```

---

## 4. Left Panel — Input Sections

Render as a **vertical accordion** (one section open at a time, or all expandable). Each section header shows a progress indicator (e.g. checkmark if filled, dot if empty).

Order (draggable via handle icon, reflected live in `sectionOrder`):
1. **Personal Info** — name, title, contact fields, optional photo upload (drag-drop or click), social links
2. **Professional Summary** — textarea with live character count and an AI-style "tip" hint (e.g. "Aim for 2–4 sentences")
3. **Work Experience** — repeatable entry cards; each card has company/role/dates + a dynamic bullet-point list (add/remove/reorder bullets); "Add Experience" button
4. **Education** — repeatable entry cards
5. **Skills** — grouped by category; toggle display style (tags/bars/dots); tag input with autocomplete suggestions
6. **Projects** — repeatable cards with tech-stack tag input
7. **Certifications** — repeatable entries
8. **Languages** — repeatable entries with proficiency dropdown
9. **Awards** — repeatable entries
10. **Custom Section** — user can add unlimited custom sections with a title + rich text/bullets

Interaction details:
- Every input updates the store on `onChange` (debounced ~150ms) and instantly reflects in the right panel
- Each repeatable entry (experience, education, etc.) is a **collapsible card** with a drag handle, duplicate button, and delete button (with confirm-on-delete toast + undo)
- Empty states show a friendly placeholder illustration + "Add your first [X]" CTA
- Inline validation via zod (e.g. valid email, end date after start date) — errors shown under fields, not as blocking modals
- "Present" checkbox for current job/education auto-disables end date field

---

## 5. Right Panel — Live Preview

- Renders the selected template inside an **A4-ratio container** (210mm × 297mm scaled to fit), with realistic shadow/paper look
- Auto-paginates: if content overflows one page, show a visual page break line and a floating "Page 2" tab
- Zoom controls: 75% / 100% / 125% / Fit-to-width, bottom-right floating toolbar
- Highlight-on-focus: when a user focuses an input on the left, the corresponding preview element gets a soft highlight/pulse (accent-colored outline) so they can visually track what they're editing
- Smooth Framer Motion transitions when switching templates (crossfade, ~250ms) — no jarring reflow
- "Print Preview" toggle strips UI chrome and shows exactly what will export to PDF

---

## 6. Template System

Build **6 distinct templates**, each a separate React component consuming the same `ResumeData` shape (strict separation of data and presentation):

| Template | Style | Best for | Layout notes |
|---|---|---|---|
| **Minimal** | Clean, generous whitespace, single column | ATS-safe, general use | Serif or Inter headings, thin divider rules |
| **Modern** | Two-column (sidebar for skills/contact, main for experience) | Tech/creative roles | Accent-colored sidebar background |
| **Professional** | Traditional single column, structured headers | Corporate/finance/legal | Small caps section headers, muted accent |
| **Creative** | Bold header band, icon-accented sections, photo support | Design/marketing roles | Larger accent color usage, rounded elements |
| **Compact** | Dense, small type, optimized for 1-page fit | Senior candidates with lots of experience | Tight line-height, multi-column skills |
| **ATS-Friendly** | Pure single-column, no icons/graphics/tables | Applying through ATS systems | Plain text hierarchy, standard fonts only |

Requirements:
- Each template accepts an `accentColor` prop (user picks from a curated palette of 8–10 colors via a color-swatch picker)
- Template switching preserves all entered data (no data loss)
- Each template independently handles empty sections (hide section entirely if empty, don't render blank headers)
- Templates must degrade gracefully to 1–2 pages max with smart spacing compression if content is long (optional "Compact Mode" toggle)

---

## 7. UI/UX & Design System (Light Mode)

**Color Palette**
- Background: `#FFFFFF` / `#F9FAFB` (app chrome)
- Surface/cards: `#FFFFFF` with `border: #E5E7EB`
- Primary text: `#111827`
- Secondary text: `#6B7280`
- Accent (default): `#4F46E5` (indigo) — user-overridable per template
- Success: `#10B981` · Warning: `#F59E0B` · Error: `#EF4444`

**Typography**
- UI font: Inter, sizes 12–14px body, 16–20px headers
- Preview fonts: template-dependent (Inter, Georgia/Lora for serif templates, Poppins for creative)

**Components & Micro-interactions**
- Soft shadows (`shadow-sm`/`shadow-md`), 8–12px border radius throughout
- Buttons: primary (filled accent), secondary (outline), ghost (icon-only actions)
- Toast notifications for save/export/errors (bottom-right, auto-dismiss)
- Skeleton loaders on initial load / template switch
- Subtle hover states (scale 1.01–1.02, shadow lift) on cards and buttons
- Autosave indicator in navbar ("Saved" with checkmark, fades after 2s)
- Keyboard shortcuts: Ctrl/Cmd+S (manual save), Ctrl/Cmd+Z (undo), Ctrl/Cmd+P (export PDF)

**Accessibility**
- All interactive elements keyboard-navigable, visible focus rings
- Sufficient color contrast (WCAG AA) even with custom accent colors — auto-adjust text contrast against chosen accent
- Form labels properly associated, ARIA live region announcing autosave status

---

## 8. Core Functionality

1. **Live Sync** — Zustand store as single source of truth; both panels subscribe reactively, no manual refresh
2. **Autosave** — debounced save to localStorage (or backend if authenticated) every ~1s of inactivity; visual "Saved" indicator
3. **Undo/Redo** — maintain a history stack (last ~30 actions) for the whole resume state
4. **Template Switching** — instant, non-destructive, data persists across templates
5. **PDF Export** — export exactly what's in the preview pane at print resolution (300dpi), correct A4 margins, selectable text (not a flattened image) where possible
6. **Import/Export JSON** — allow exporting resume data as `.json` and re-importing it later (portability, backup)
7. **Multiple Resume Profiles** — allow saving/naming multiple resume versions (e.g. "Frontend Resume", "Backend Resume") switchable from a dropdown
8. **Drag-and-drop reordering** — both top-level sections and entries within a section (experience bullets, skill tags, etc.)
9. **Section visibility toggle** — hide a section from the preview without deleting its data
10. **Optional AI assist hooks** (stub for future integration) — "Improve this bullet point" / "Shorten summary" buttons next to relevant textareas, wired to a placeholder API call

---

## 9. Component / File Structure

```
/app
  /builder
    page.tsx                 → main split-screen page
/components
  /layout
    Navbar.tsx
    SplitPane.tsx
  /form
    PersonalInfoForm.tsx
    SummaryForm.tsx
    ExperienceForm.tsx
    EducationForm.tsx
    SkillsForm.tsx
    ProjectsForm.tsx
    CertificationsForm.tsx
    LanguagesForm.tsx
    AwardsForm.tsx
    CustomSectionForm.tsx
    AccordionSection.tsx     → reusable wrapper
    RepeatableEntryCard.tsx  → reusable wrapper
  /preview
    PreviewCanvas.tsx
    ZoomControls.tsx
    templates/
      MinimalTemplate.tsx
      ModernTemplate.tsx
      ProfessionalTemplate.tsx
      CreativeTemplate.tsx
      CompactTemplate.tsx
      ATSTemplate.tsx
  /ui                         → shadcn primitives
/store
  resumeStore.ts              → Zustand store + persistence
/lib
  pdfExport.ts
  validation.ts (zod schemas)
  colorContrast.ts
/types
  resume.ts                   → shared TypeScript interfaces
```

---

## 10. Responsive Behavior Summary

| Breakpoint | Behavior |
|---|---|
| ≥1024px | Full split screen, sticky preview |
| 768–1023px | Tabbed Edit/Preview toggle in navbar |
| <768px | Single-column form; floating "Preview" FAB opens full-screen modal preview |

---

## 11. Nice-to-Have (Stretch Goals)

- Dark mode toggle (light mode remains default)
- LinkedIn profile JSON import to auto-fill fields
- ATS score checker (keyword match against a pasted job description)
- Resume analytics (word count, action-verb usage suggestions)
- Shareable public link (read-only hosted view of a resume)
- Cover letter builder using the same personal info

---

## 12. Acceptance Criteria

- [ ] Typing in any left-panel field updates the right-panel preview with no visible lag (<100ms)
- [ ] All 6 templates render correctly with the same dataset, no broken layouts
- [ ] Switching templates never loses or corrupts data
- [ ] PDF export matches the on-screen preview pixel-for-pixel (correct A4 dimensions/margins)
- [ ] Empty sections never render visible blank headers in any template
- [ ] Fully keyboard-navigable; passes basic WCAG AA contrast checks
- [ ] Responsive correctly down to 375px width
- [ ] Refreshing the browser does not lose unsaved data (localStorage persistence works)
