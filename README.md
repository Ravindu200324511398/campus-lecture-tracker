# 🎓 Campus Lecture & Attendance Tracker PRO v4

[![Live Demo](https://img.shields.io/badge/Vercel-Live--Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://attendance-tracker-lyart-xi.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ravindu200324511398/campus-lecture-tracker)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, high-contrast, feature-rich Academic Attendance & GPA Management System designed for university students. Keep track of lecture notes, calculate safe class skips, forecast your attendance percentage, track exam deadlines, and monitor your projected GPA.

🌐 **Live Production App**: [https://attendance-tracker-lyart-xi.vercel.app](https://attendance-tracker-lyart-xi.vercel.app)

---

## 🌟 Key Features

### 📊 1. Attendance Performance Ring & Bunk Calculator
- **Visual Progress Ring**: SVG progress ring displaying your real-time attendance rate.
- **Bunk Calculator**: Automatically calculates how many classes you can safely skip while staying above your target percentage (e.g. 80%), or how many consecutive classes you MUST attend to recover from low attendance.

### 🎓 2. Built-in Degree Curricula Presets (8 Full Semesters)
Instant 1-click preset import for 8 semesters (Level 1 Semester 1 to Level 4 Semester 2) across 6 major degree programs:
- 🤖 **BSc (Hons) in Artificial Intelligence (AI)**
- 💻 **BSc (Hons) in Information Technology (IT)**
- 📊 **BSc (Hons) in IT & Management (ITM)**
- 🖥️ **BSc (Hons) in Computer Science (CS)**
- ⚡ **BSc (Hons) in Software Engineering (SE)**
- 📈 **BSc (Hons) in Data Science (DS)**
- 🎨 **Custom / Other Degrees**: Manually add custom modules, credits, and target grades.

### 🎯 3. "What-If" Scenario Forecast Simulator
- Test hypothetical attendance outcomes before making decisions.
- Input future classes attended or missed to immediately view the impact on your module score and safety threshold.

### 🏆 4. Academic Achievements & Gamified Streaks
- Earn 4 unlockable badges based on your performance:
  - 🛡️ **Bunk Proof**: All modules maintained above target percentage.
  - 🏆 **GPA Titan**: Projected GPA $\ge 3.7$.
  - 🔥 **Iron Scholar**: 5+ class attendance streak.
  - 📝 **Note Master**: 5+ detailed lecture notes recorded.

### 📝 5. Rich Lecture Notes, Code Snippets & Action Items
- Record lecture notes, key takeaways (`💡`), and code snippets formatted in `JetBrains Mono`.
- Track homework assignments and action items per session with checklist completion.
- Tag and search through all lecture notes instantly.

### 📱 6. Mobile Responsive Navigation & Drawer
- Seamless slide-out side navigation drawer on mobile devices (`< 768px`).
- Widescreen full-width responsive grid layout.

### 🎨 7. Multi-Theme Engine
- 🌌 **Cyberpunk Dark**: Vibrant neon glow dark theme.
- 🌙 **Midnight Blue**: Deep indigo academic aesthetic.
- ☀️ **Light Academic Mode**: Clean, high-contrast, professional light theme.

### 🍬 8. SweetAlert2 Popups & Full Undo/Redo Engine
- Dark-styled custom SweetAlert confirmation dialogues for module deletions, sessions, and backups.
- Full state history stack supporting `Cmd+Z` / `Ctrl+Z` (Undo) and `Cmd+Shift+Z` / `Ctrl+Y` (Redo).

### 📦 9. Data Portability
- Export & Import JSON backups.
- Download CSV performance reports containing module codes, attendance counts, target percentages, and status alerts.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Icon Library**: Lucide React
- **Alert System**: SweetAlert2
- **Deployment**: Vercel Platform

---

## 💻 Local Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ravindu200324511398/campus-lecture-tracker.git
   cd campus-lecture-tracker
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` or `http://localhost:5174` in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🚀 Deployment

### Deploying to Vercel via CLI

```bash
npx vercel --prod
```

### Deploying via GitHub Integration

1. Push changes to the `main` branch on GitHub.
2. Link the repository to [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically deploys every new commit!

---

## 📁 Repository Structure

```
campus-lecture-tracker/
├── src/
│   ├── App.jsx         # Main React Application (Dashboard, Week View, Analytics, Modals)
│   ├── main.jsx        # React DOM Entry Point
│   └── index.css       # Full-width global layout rules
├── index.html          # Main HTML entry file
├── vercel.json         # Vercel SPA routing and build configuration
├── package.json        # Dependencies and scripts
└── README.md           # Documentation
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
