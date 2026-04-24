# Product Planning

The first phase of Design OS establishes the foundation for your product. Complete these steps before designing any screens.

## 1. Product Vision (`@00-product-vision`)

Define your product's core identity. The agent will ask you about:

- **Product name** — A clear, memorable name
- **Description** — 1-3 sentences capturing the essence
- **Problems & solutions** — What pain points you're addressing and how
- **Key features** — The main capabilities that make this possible

Share any notes, ideas, or rough thoughts you have about what you're building. The agent will ask clarifying questions through interactive multiple-choice prompts, then generate the overview once you've confirmed direction.

**Creates:** `product/product-overview.md`

## 2. Product Roadmap (`@01-product-roadmap`)

Define the main sections (features/areas) of your product. The agent will ask you about:

- **Section names** — Clear, descriptive titles for each area
- **Section descriptions** — What each section covers
- **Priority order** — Which sections to build first

The agent reviews your product overview for context and asks clarifying questions before generating the roadmap.

**Creates:** `product/product-roadmap.md`

## 3. Data Shape (`@02-data-shape`)

Sketch out the core entities ("nouns") and their relationships. The agent will ask you about:

- **Entity names** — The core things users interact with
- **Descriptions** — What each entity represents
- **Relationships** — How entities connect to each other

The agent reviews your product overview and roadmap for context and asks clarifying questions before generating the data shape.

**Creates:** `product/data-shape/data-shape.md`

## 4. Design System (`@03-design-system`)

Define your visual identity and brand personality:

### Brand Resources (Optional)

Place existing brand assets in `product/design-system/resources/`:

- Logos (SVG, PNG)
- Style guides (PDF, images)
- Screenshot examples

The agent will analyze these to extract colors, fonts, and brand characteristics.

### Colors

Select from Tailwind's built-in color palette:

- **Primary** — Main accent for buttons, links, key actions (e.g., `blue`, `indigo`, `emerald`, `lime`)
- **Secondary** — Complementary accent for tags, highlights (e.g., `violet`, `amber`, `teal`)
- **Neutral** — Backgrounds, text, borders (e.g., `slate`, `gray`, `zinc`, `stone`)

### Typography

Select from Google Fonts:

- **Heading** — For titles and section headers (e.g., `DM Sans`, `Inter`, `Space Grotesk`)
- **Body** — For paragraphs and UI text (e.g., `Inter`, `Source Sans 3`, `Nunito Sans`)
- **Mono** — For code and technical content (e.g., `JetBrains Mono`, `Fira Code`)

### Brand Identity (Optional)

- **Personality** — Brand adjectives (e.g., "professional", "playful", "minimalist")
- **Voice** — Tone for UI copy (e.g., "friendly", "formal", "technical")
- **UI Style** — Component preferences (border radius, shadows, density)

**Creates:** `product/design-system/design-system.json`, `product/design-system/design-system.md`

The agent will suggest options based on your product type and help you find a combination that fits.

**Creates:** `product/design-system/colors.json`, `product/design-system/typography.json`

## 5. Application Shell (`@04-design-shell`)

Design the persistent navigation and layout that wraps all your sections. Choose from common patterns:

- **Sidebar Navigation** — Vertical nav on the left, content on the right. Best for dashboard-style tools, admin panels, apps with many sections.
- **Top Navigation** — Horizontal nav at top, content below. Best for simpler apps, marketing-style products, fewer sections.
- **Minimal Header** — Just logo + user menu. Best for single-purpose tools, wizard-style flows.

You'll also define:

- User menu placement and contents
- Responsive behavior (how it adapts on mobile)
- Any additional nav items (Settings, Help, etc.)

The shell is implemented as React components that will wrap your section screen designs.

**Creates:**

- `product/shell/spec.md` — Shell specification
- `src/shell/components/AppShell.tsx` — Main shell wrapper
- `src/shell/components/MainNav.tsx` — Navigation component
- `src/shell/components/UserMenu.tsx` — User menu component
- `src/shell/ShellPreview.tsx` — Preview wrapper for Design OS

## What's Next

With the foundation established, you're ready to design individual sections. See [Designing Sections](design-section.md) for the next steps.
