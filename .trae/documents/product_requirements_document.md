# Technical-Industry Semantic Translation Assistant MVP PRD

## 1. Product Background (Why)
In technical and industrial docking scenarios (Research <-> Enterprise, Tech <-> Business, R&D <-> Decision Making), "understanding bias" rather than "technical capability" is the biggest obstacle to cooperation.
Typical problems include:
- Technical side expression is too academic/detailed, industry side cannot understand or grasp the value.
- Industry side only cares about ROI/Landing, ignoring technical prerequisites and uncertainties.
- Tech BD/Strategy Heads need to repeatedly "revise one draft many times", consuming extreme energy.
- Current work highly relies on personal experience, not scalable or replicable.

## 2. Product Goal (What)
**Core Goal:** Help "Technical-Industry Translation Roles" generate a "directly usable external expression version" with one input.

**Success Criteria (MVP):**
- Users are willing to write to this tool before writing to people.
- Single external material modification rounds are significantly reduced.
- Users start to precipitate their own "expression templates".

## 3. Target User (Who)
**Unique Target User (MVP Only):** "Translation Roles" between technology and industry.
- Tech BD
- Strategic Cooperation Heads
- R&D Docking / Platform External Interface People

**User Characteristics:**
- Can understand technology but may not write "industry language".
- Familiar with industry but don't want to make mistakes in technical accuracy.
- High frequency output: Solution Description / Cooperation Communication / Roadshow Materials / External Emails.

## 4. Core Scenarios (Where)
- **Scenario 1: Technical Solution -> Enterprise Cooperation Communication**
  - Input: Raw technical description (Tech-heavy)
  - Output: Enterprise understandable, decidable version
- **Scenario 2: Research Results -> Business Expression**
  - Input: Research progress / Experimental results
  - Output: Industry value + Landing boundary explanation
- **Scenario 3: Internal Tech Consensus -> External Speech**
  - Input: Internal discussion draft / Minutes
  - Output: Materials directly sendable externally

## 5. MVP Scope
### 5.1 Single Input -> Dual Output (Minimalist)
**Input (Only One):**
- A paragraph of "Real thoughts / Technical description".
- No structure or polishing required.

**Output (Fixed 2 Types):**
1.  **Industry/Business Version:**
    - Emphasize: Value, Application Scenarios, Staged Results.
    - Weaken: Technical details (but not distorted).
2.  **Technical Fidelity Version:**
    - Clarify: Prerequisites, Technical Boundaries, Uncertainties.
    - Used for: Internal verification / Tech side confirmation.

**Note:** MVP does not do 4 roles or complex configurations.

### 5.2 Mandatory Semantic Constraints (Core Differentiator)
System MUST:
- ❌ Not exaggerate results.
- ❌ Not hide key prerequisites.
- ✅ Clearly distinguish: Verified Facts, Engineering Assumptions, Business Potential (Inference).

### 5.3 Output Directly Usable
Each output must be:
- Directly copy-pasteable (Email / Lark / PPT).
- Clear structure (Bullet points).
- No secondary "translation" needed.

## 6. UX Flow
1. User pastes raw technical description.
2. Clicks [Generate External Expression].
3. Page displays side-by-side:
   - Left: Technical Fidelity Version.
   - Right: Industry/Business Version.
4. Support:
   - One-click copy.
   - Minor rewrite and regenerate.

## 7. Non-Functional Constraints (MVP Boundaries)
**Explicitly NOT Doing:**
- ❌ Auto search information.
- ❌ Complex knowledge base connection.
- ❌ Multi-person collaboration.
- ❌ Permissions / Project Management.

## 8. Technical Implementation Principles (How)
**Model Layer:**
- Based on LiteLLM (Unified API).
- Default single model (Stable, Low cost).
- Reserve possibility for multi-model.

**Prompt Principles:**
- Explicit Role: "Technical-Industry Translator".
- Explicit Duty: "Do not add facts, only reorganize expression".
- Fixed output structure, avoid free play.

## 9. Metrics
**Core Metric:** User retention (repeat usage).
**Auxiliary Metrics:** Copy rate, Average modification count.
