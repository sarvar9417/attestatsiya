# Exam UI Layout Design Specification

## Overview

The exam runner UI is redesigned into a three-column layout optimized for both desktop and mobile. The design follows the UX spec principles: one primary task per screen, mobile-first, keyboard accessible, and clear visual feedback.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER BAR (full width)                                           │
│  [Exam Type]  |  Question N/M  |  Timer  |  User Info  |  Saved  │
├────────────────────────────┬────────────────────────────────────────┤
│                            │                                        │
│   LEFT SIDEBAR             │        MAIN CONTENT AREA               │
│   (question navigator)     │        (question display)              │
│                            │                                        │
│  ┌─ Question Grid ──────┐  │  ┌─ Question Header ───────────────┐ │
│  │ 1  2  3  4  5  ...   │  │  │  Format Badge  │  Progress bar  │ │
│  │ 6  7  8  9  10 ...   │  │  │  Cognitive Level               │ │
│  │ ...                   │  │  └─────────────────────────────────┘ │
│  │                        │  │                                      │
│  │ Answered = green       │  │  ┌─ Question Stem ─────────────────┐ │
│  │ Unanswered = gray      │  │  │  (prompt, stimulus, content)    │ │
│  │ Current = blue ring    │  │  │                                  │ │
│  │ Flagged = amber        │  │  └─────────────────────────────────┘ │
│  │                          │  │                                      │
│  │ [Submit Answer] button  │  │  ┌─ Response Area ─────────────────┐ │
│  │                          │  │  │  (Y1/Y2/Y3 specific controls)  │ │
│  │                          │  │  │                                  │ │
│  │ ── Navigation ──        │  │  └─────────────────────────────────┘ │
│  │  [← Previous] [Next →]  │  │                                      │
│  │                          │  │  ┌─ Feedback / Message ───────────┐ │
│  │ [Finish Exam] button    │  │  │  (save status, error, feedback) │ │
│  │                          │  │  └─────────────────────────────────┘ │
│                            │                                        │
├────────────────────────────┴────────────────────────────────────────┤
│  FOOTER (optional: keyboard shortcuts help)                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Breakdown

### 1. Header Bar (Top, Full Width)

**Purpose:** Show exam context, progress, and time at a glance.

**Layout:** Flex row, items centered vertically.

| Element | Content | Styling |
|---|---|---|
| Exam Type Badge | "Attestatsiya mock sinovi" / "Modul sinovi" / "Mavzu sinovi" | Small pill badge, muted background |
| Question Counter | "Savol 3 / 50" | Bold, primary color |
| Timer | Clock icon + remaining time (MM:SS) | Monospace font; red when ≤5 min |
| User Info | Display name + role | Small text, right side |
| Save Status | "Saqlandi" / "Saqlanmoqda..." | Small indicator, green/amber |

**Mobile:** Collapsed into a compact bar with icons and tooltips.

---

### 2. Left Sidebar — Question Navigator

**Purpose:** Allow quick navigation between questions with visual status indicators.

**Layout:** Fixed width sidebar (220px on desktop), sticky on scroll.

#### Question Grid

```
┌─────────────────────────────────┐
│  Savollar (50)                  │
│                                 │
│  1  2  3  4  5  6  7  8  9  10 │
│  11 12 13 14 15 16 17 18 19 20 │
│  21 22 23 24 25 26 27 28 29 30 │
│  31 32 33 34 35 36 37 38 39 40 │
│  41 42 43 44 45 46 47 48 49 50 │
│                                 │
│  [ Yakunlash ]                   │
└─────────────────────────────────┘
```

#### Button States

| State | Background | Border | Text | Ring |
|---|---|---|---|---|
| **Current** | Primary-100 | Primary-500 (2px) | Primary-700 | Primary-500 (2px focus ring) |
| **Answered** | Emerald-100 | Emerald-300 | Emerald-700 | None |
| **Unanswered** | Gray-100 | Gray-200 | Gray-500 | None |
| **Flagged** | Amber-100 | Amber-300 | Amber-700 | None |
| **Not yet seen** | White | Gray-100 | Gray-400 | None |

#### Navigation Buttons

- **[← Oldingi]** — disabled on first question
- **[Keyingi →]** — disabled on last question
- **[Yakunlash]** — primary button, shows unanswered count warning if any

#### Keyboard Support

- `Left Arrow` → previous question
- `Right Arrow` → next question
- `1`–`9`, `0` → jump to question 1–10, 11–20 etc. (via grid number)
- `S` → save current answer
- `F` → finish exam

---

### 3. Main Content Area — Question Display

**Purpose:** Show the current question with its type-specific interaction controls.

#### Question Header Section

```
┌─────────────────────────────────────────────────────────────┐
│ [Y1]  Bilish  │  Difficulty: ●●○○○  │  M01.03            │
│ ─────────────────────────────────────────────────────────── │
│  "Informatika, axborot, ma'lumot va bilim tushunchalarini │
│   farqlash."                                               │
└─────────────────────────────────────────────────────────────┘
```

| Element | Description |
|---|---|
| Format Badge | Y1 (green), Y2 (blue), Y3 (purple) |
| Cognitive Level | "Bilish", "Qo'llash", "Mulohaza" |
| Difficulty | 1–5 dot indicator |
| Module/Construct Code | e.g., "M01.03" |
| Prompt | The question text, rendered as markdown |

#### Response Area (Type-Specific)

**Y1 — Single Choice (MCQ)**

```
┌─────────────────────────────────────────────────────────────┐
│  ○  A) Informatika — bilish va hisoblash fani              │
│  ●  B) Informatika — axborotni qidirish va tahlil qilish  │
│  ○  C) Informatika — dasturlash tillari                   │
│  ○  D) Informatika — kompyuter tizimlari                   │
│                                                             │
│  [ Javobni saqlash ]                                       │
└─────────────────────────────────────────────────────────────┘
```

- Radio buttons with custom styling
- Options displayed as clickable cards/rows
- Selected option highlighted with primary border
- Keyboard: arrow keys to navigate options, Enter to select

**Y2 — Matching**

```
┌─────────────────────────────────────────────────────────────┐
│  Left items (drag/drop or select)    │  Right items       │
│  ┌─────────────────────────┐         │  ┌───────────────┐  │
│  │ A) Kompyuter tizimi     │  ──→    │  │ Operatsion    │  │
│  │ B) Dasturiy ta'minot    │  ──→    │  │ tizim         │  │
│  │ C) Fayl tizimi          │  ──→    │  │ Dasturiy      │  │
│  │ D) Amaliy dastur        │  ──→    │  │ ta'minot      │  │
│  └─────────────────────────┘         │  └───────────────┘  │
│                                       │                     │
│  [ Javobni saqlash ]                  │                     │
└─────────────────────────────────────────────────────────────┘
```

- Left column: source items (always visible)
- Right column: target items in shuffled order
- Each left item has a dropdown/select to match with a right item
- Mobile: dropdown-based (no drag-and-drop)
- Desktop: optional drag-and-drop as enhancement

**Y3 — Ordering**

```
┌─────────────────────────────────────────────────────────────┐
│  Items to order (drag to reorder or use up/down buttons):  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. [Dasturlash tillari]  [↑] [↓]                   │    │
│  │ 2. [Dasturiy ta'minot]   [↑] [↓]                   │    │
│  │ 3. [Operatsion tizim]    [↑] [↓]                   │    │
│  │ 4. [Amaliy dastur]        [↑] [↓]                   │    │
│  │ 5. [Kompyuter tizimi]    [↑] [↓]                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [ Javobni saqlash ]                                       │
└─────────────────────────────────────────────────────────────┘
```

- Items displayed as a list with up/down arrow buttons
- Drag-and-drop optional (keyboard accessible alternative required)
- Each item has a grip handle for drag
- Mobile: up/down buttons only

---

### 4. Feedback / Message Area

**Location:** Below the response area, above navigation buttons.

| Message Type | Styling | Content |
|---|---|---|
| Save success | Green text + check icon | "Javob saqlandi" |
| Save in progress | Amber text + spinner | "Saqlanmoqda..." |
| Save error | Red text | "Saqlashda xato — qayta urinish" |
| Answer feedback (practice) | Green/red with explanation | "To'g'ri." / "Noto'g'ri." + explanation |
| Validation error | Amber text | "Javobni to'liq belgilang." |

---

### 5. Navigation Buttons (Bottom of Main Area)

```
┌─────────────────────────────────────────────────────────────┐
│  [ ← Oldingi ]          [ Javobni saqlash ]    [ Keyingi → ]│
└─────────────────────────────────────────────────────────────┘
```

- **Oldingi** — disabled on first question
- **Keyingi** — disabled on last question; also disabled if current answer not saved
- **Javobni saqlash** — disabled if answer incomplete or already saved
- **Yakunlash** — only in sidebar, not in main area

---

## Mobile Adaptation

On mobile (≤768px), the layout changes to a single column:

```
┌─────────────────────────────────┐
│  HEADER (compact)               │
│  [Q 3/50] [Timer 45:23] [Save] │
├─────────────────────────────────┤
│                                 │
│  ┌─ Question Navigator (drawer)│
│  │  Grid of 50 small buttons   │
│  │  [Open] [Close]             │
│  └─────────────────────────────┘
│                                 │
│  ┌─ Question Header ──────────┐ │
│  │  [Y1] [Bilish] [M01.03]   │ │
│  └─────────────────────────────┘ │
│                                 │
│  ┌─ Question Stem ────────────┐ │
│  │  "Informatika, axborot..." │ │
│  └─────────────────────────────┘ │
│                                 │
│  ┌─ Response Area ────────────┐ │
│  │  ○ A) ...                  │ │
│  │  ● B) ...                  │ │
│  │  ○ C) ...                  │ │
│  │  ○ D) ...                  │ │
│  └─────────────────────────────┘ │
│                                 │
│  ┌─ Feedback ─────────────────┐ │
│  │  Javob saqlandi ✓          │ │
│  └─────────────────────────────┘ │
│                                 │
│  [ ← Oldingi ] [ Keyingi → ]   │
│         [ Yakunlash ]           │
└─────────────────────────────────┘
```

- Navigator becomes a bottom sheet / drawer
- Question header and stem scroll together
- Response controls are full-width for touch
- Navigation buttons are sticky at bottom

---

## CSS / Tailwind Classes Reference

### Header Bar
```
flex flex-wrap items-center justify-between gap-3 px-4 py-3
bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700
```

### Sidebar
```
w-56 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
p-4 sticky top-20 self-start
```

### Question Grid Button
```
w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center
transition-colors duration-150
```

### Main Content Card
```
flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700
p-5 sm:p-6 shadow-sm
```

### Format Badge
```
inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono tracking-wider
bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400
```

### Navigation Button Row
```
flex flex-wrap items-center justify-between gap-3 mt-4 pt-4
border-t border-gray-100 dark:border-gray-700
```

### Save Button (Primary)
```
btn-primary inline-flex items-center gap-2 disabled:opacity-50
```

### Timer (Warning)
```
font-mono font-semibold text-sm
text-gray-700 dark:text-gray-300
when ≤300s: text-red-600 animate-pulse
```

---

## Accessibility Requirements

1. **Keyboard navigation** — All interactive elements reachable via Tab
2. **Focus visible** — Clear focus ring on all interactive elements
3. **ARIA labels** — Question buttons have `aria-label="Savol N, javob saqlangan"`
4. **Live region** — `aria-live="polite"` on feedback area for screen readers
5. **Color not sole indicator** — Status also indicated by icon + text
6. **Reduced motion** — `prefers-reduced-motion` respected for animations
7. **Zoom 200%** — Layout remains usable at 200% zoom
8. **Timer announcement** — Screen reader announcement at 10 min and 1 min remaining

---

## Interaction Flow

```
User opens exam
  → Header shows exam type, question 1/N, timer, save status
  → Sidebar shows all question numbers, #1 highlighted (current)
  → Main area shows question 1 stem + response controls

User answers question 1
  → Clicks option → selection highlighted
  → Clicks "Javobni saqlash"
  → Button shows "Javob saqlandi" (green check)
  → Sidebar button #1 turns green (answered)
  → "Keyingi →" button becomes active

User clicks "Keyingi →"
  → Main area transitions to question 2
  → Sidebar #2 highlighted (current)
  → If question 2 was previously answered, show saved answer
  → If not, show empty response controls

User clicks "Yakunlash"
  → If unanswered questions exist → confirmation dialog
  → If all answered → submit exam
  → Show loading spinner
  → Transition to result page
```

---

## Design Notes

1. **One task per screen** — The main area shows only the current question, nothing else.
2. **Progress is visible but not distracting** — Header counter + sidebar grid provide progress context.
3. **Save is explicit** — User must click "Javobni saqlash" (autosave is a separate concern, not shown in this layout).
4. **No answer leakage** — Correct answer is never shown until exam is finished.
5. **Mobile-first** — Single column on small screens, sidebar + main on large screens.
6. **Dark mode** — All colors have dark mode equivalents via Tailwind dark: prefix.
7. **Font** — Use the project's existing font stack (Inter via Tailwind config).
8. **Spacing** — Consistent 4px/8px/12px/16px/24px/32px spacing scale.
