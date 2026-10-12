# SignBridge 🤟

An accessible **Indian Sign Language (ISL)** learning platform built for the College Hackathon '26.

SignBridge bridges everyday communication barriers between hearing individuals and Deaf/Hard-of-Hearing people in educational institutions, healthcare centers, workplaces, and public spaces through structured video lessons, a searchable sign dictionary, camera-based self-practice, and active-recall quizzes.

---

## 🌟 Key Features

1. **Structured Video Lessons**:
   - 40 standardized ISL vocabulary signs categorized into:
     - Everyday Communication
     - People & Family
     - Food & Drinks
     - Places
     - Actions
     - Questions
   - Playable reference videos with replay, loop, and slow-motion (0.5x, 0.75x, 1.0x) playback.
   - Context descriptions and example sentences.

2. **Searchable Sign Dictionary**:
   - Instant search across words, categories, and tags.
   - Category filtering pills.
   - Bookmark favorites and view recent signs.

3. **Camera-Based Self-Practice Studio**:
   - Side-by-side comparison of user webcam recording against the expert reference video.
   - 100% private and in-browser: clips are processed in browser memory and never uploaded to any server.
   - Discard, retake, and replay options.

4. **Interactive Recall Quizzes**:
   - Multiple-choice questions with video prompts.
   - Instant feedback and correct answer explanations.
   - Score logging saved locally.

5. **Local Progress & Personalization**:
   - Lesson completion tracking, quiz history, and favorite bookmarks stored in `localStorage`.
   - Predefined avatar selector and learner profile.

6. **Future Dataset Integration Architecture**:
   - Data-driven content service (`src/services/signService.js`) decoupled from presentation UI.
   - Strict schema validation and duplicate detection engine (`src/data/datasetSchema.js`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Running Locally

1. Clone or navigate to the repository:
   ```bash
   git clone https://github.com/bhavana2504-cse/SignBridge-Mission-26.git
   cd SignBridge-Mission-26
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
├── public/
│   └── videos/              # Reference video clips for all 40 ISL signs
├── src/
│   ├── components/
│   │   ├── common/          # Header, Footer, VideoPlayer, SignCard, Modal, Icons
│   │   ├── home/            # HeroBanner, QuickStats, Pillars, FeaturedSigns
│   │   ├── lessons/         # Module catalog, LessonViewer
│   │   ├── dictionary/      # Search bar, Filter chips, Results grid
│   │   ├── quiz/            # Quiz setup, Video questions, Scorecard
│   │   ├── practice/        # Split-screen webcam practice & recording
│   │   └── progress/        # Progress dashboard, Profile, Dataset hub
│   ├── data/
│   │   ├── signVocabulary.js# 40 signs data with categories & usage notes
│   │   ├── videoMapping.js  # Word-to-filename central mapping
│   │   └── datasetSchema.js # Validation rules and schema specs
│   ├── services/
│   │   ├── signService.js   # Content queries, search, and filtering
│   │   ├── storageService.js# LocalStorage persistence manager
│   │   └── futureDatasetService.js # Ingestion auditor
│   ├── styles/
│   │   ├── index.css        # Design tokens, typography, and reset
│   │   └── App.css          # Component layout and responsive styling
│   ├── App.jsx              # Application router and modal container
│   └── main.jsx             # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## ♿ Accessibility & Standards

- **Color Contrast**: Compliant with WCAG 2.1 AA standards.
- **Focus Indicators**: Visible focus outlines for keyboard navigation.
- **Respectful Terminology**: Thoughtful, inclusive language designed for accessibility.
- **Offline & Local-First**: No external API keys or cloud databases required.

---

## 📄 License
ISC License - Built for College Hackathon '26.
