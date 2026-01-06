# Technical Architecture Document

## 1. System Overview
The application is a web-based tool built with React for the frontend and Express.js for the backend. It leverages LiteLLM for text generation logic.

## 2. Tech Stack
- **Frontend:**
  - React (Vite)
  - TypeScript
  - Tailwind CSS (Styling)
  - Lucide React (Icons)
  - Zustand (State Management)
  - Axios/Fetch (API Communication)
- **Backend:**
  - Node.js
  - Express.js
  - TypeScript
  - LiteLLM API Integration

## 3. Architecture Design
### 3.1 Frontend Architecture
- **Pages:** Single Page Application (SPA) with a main dashboard.
- **Components:**
  - `InputSection`: Text area for raw technical description.
  - `OutputSection`: Dual pane display for "Technical Fidelity" and "Industry/Business" versions.
  - `ActionButtons`: Generate, Copy, Clear.
- **State Management:** Zustand store to handle input text, loading state, and generated outputs.

### 3.2 Backend Architecture
- **API Endpoints:**
  - `POST /api/translate`: Accepts technical text, calls LiteLLM, and returns structured JSON with both versions.
- **Service Layer:**
  - `LiteLLMService`: Handles communication with LiteLLM API, including error handling and prompt construction.
- **Prompt Engineering:**
  - A robust system prompt to enforce the "Semantic Constraints" defined in PRD.

## 4. Data Flow
1. User inputs text in Frontend -> Frontend calls `POST /api/translate`.
2. Backend receives request -> Constructs Prompt -> Calls LiteLLM API.
3. LiteLLM returns generated text -> Backend parses/formats response -> Returns to Frontend.
4. Frontend updates state -> Renders outputs.

## 5. Security & Configuration
- API Keys for LiteLLM stored in environment variables (server-side).
- CORS configuration to allow frontend-backend communication.
