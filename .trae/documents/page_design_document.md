# Page Design Document

## 1. Layout Overview
A clean, professional, and focus-oriented interface.
- **Header:** Application Title "Technical-Industry Semantic Translation Assistant".
- **Main Content:** Two-column layout (on large screens) or Stacked (on mobile).
  - **Top/Left:** Input Area.
  - **Bottom/Right:** Output Area (Split into two sub-columns).

## 2. Detailed Components

### 2.1 Header
- Title: "Tech-Industry Translator" (Simple, Bold).
- Subtitle: "Turn technical details into business value."

### 2.2 Input Area
- Large Textarea: Placeholder "Paste your raw technical description here... (e.g., internal wiki, experiment logs)".
- Action Bar:
  - Primary Button: "Generate" (Prominent, maybe with an icon).
  - Clear Button: "Clear".

### 2.3 Output Area
- **Container:** A split view with two distinct cards.
- **Card 1: Technical Fidelity Version (Internal)**
  - Header: "Technical Fidelity (Internal Check)" - maybe with a shield or lock icon.
  - Style: Neutral background (gray/zinc), monospaced font for code/data if needed.
  - Content: Bullet points highlighting Prerequisites, Boundaries, Uncertainties.
  - Footer: "Copy" button.
- **Card 2: Industry/Business Version (External)**
  - Header: "Industry/Business (External)" - maybe with a briefcase or presentation icon.
  - Style: Highlighted background (light blue/indigo tint), professional serif or sans-serif.
  - Content: Bullet points highlighting Value, Scenarios, Staged Results.
  - Footer: "Copy" button.

### 2.4 Loading State
- While generating, disable input and show a skeleton loader or a progress animation in the output cards.

## 3. Color Palette
- Base: Slate/Zinc (Professional, Clean).
- Primary Action: Indigo/Blue.
- Secondary/Output Backgrounds: White with subtle borders/shadows.
