# Usage

Design OS uses Copilot agents to guide you through the design process. Each agent is a conversation—the AI asks questions, you provide direction, and together you shape your product.

## How to Use Agents

1. Open **Copilot Chat** in VS Code
2. Select an agent from the **agent dropdown** (e.g., `@00-product-vision`)
3. Send a message to start the conversation (e.g., "Let's define my product vision")
4. Answer the agent's questions and provide feedback

Each agent focuses on one specific task. Complete that task, then move to the next agent.

## The Design Workflow

Design OS follows a structured sequence. Each step builds on the previous one.

### Phase 1: Product Planning

Before designing any screens, establish the foundation:

1. **Product Vision** (`@00-product-vision`) — Define your product name, description, problems, and features
2. **Product Roadmap** (`@01-product-roadmap`) — Define the main sections/areas of your product
3. **Data Shape** (`@02-data-shape`) — Sketch out core entities and relationships
4. **Design System** (`@03-design-system`) — Define visual identity and brand personality
5. **Application Shell** (`@04-design-shell`) — Design navigation and layout

See [Product Planning](product-planning.md) for details on each agent.

### Phase 2: Section Design

Once the foundation is set, work through each section:

1. **Shape the Section** (`@05-shape-section`) — Define scope and requirements
2. **Sample Data** (`@06-sample-data`) — Generate sample data and TypeScript types
3. **Design the Screen** (`@07-design-screen`) — Build the actual React components
4. **Capture Screenshots** (`@08-screenshot-design`) — Document the design (optional)

Repeat for each section in your roadmap.

See [Designing Sections](design-section.md) for details on each agent.

### Phase 3: Stakeholder Review

Once all sections are designed, assemble a clickdummy for stakeholder feedback:

1. **Clickdummy** (`@09-clickdummy`) — Assemble a navigable prototype with all sections

Share `/clickdummy` with stakeholders (POs, UI/UX designers) to gather feedback. Iterate on designs as needed before final export.

### Phase 4: Export

When stakeholders have signed off:

1. **Export** (`@10-export-product`) — Generate the complete handoff package

See [Export](export.md) for details on what's included and how to use it.

## Quick Reference

| Agent                   | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `@00-product-vision`    | Define product name, description, problems, and features |
| `@01-product-roadmap`   | Define main sections/areas of the product                |
| `@02-data-shape`        | Sketch out core entities and relationships               |
| `@03-design-system`     | Define visual identity and brand personality             |
| `@04-design-shell`      | Design navigation and layout                             |
| `@05-shape-section`     | Define a section's scope and requirements                |
| `@06-sample-data`       | Generate sample data and TypeScript types                |
| `@07-design-screen`     | Create screen design components                          |
| `@08-screenshot-design` | Capture screenshots                                      |
| `@09-clickdummy`        | Assemble navigable clickdummy for stakeholder demos      |
| `@10-export-product`    | Generate the complete handoff package                    |

## Tips

- **Follow the sequence** — Each step builds on the previous. Don't skip ahead.
- **Be specific** — The more detail you provide, the better the output.
- **Iterate** — Each agent is a conversation. Refine until you're happy.
- **Restart the dev server** — After creating new components, restart to see changes.
