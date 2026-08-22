import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  CalendarDays, CheckCircle2, XCircle, Circle, MinusCircle, Clock, Plus, X,
  Trash2, Tag as TagIcon, ListChecks, StickyNote, Search, TrendingUp,
  BookOpen, ChevronLeft, ChevronRight, AlertTriangle, GraduationCap,
  LayoutDashboard, CalendarClock, Layers, Pencil, Loader2, Check,
  Undo2, Redo2, Sparkles, Filter, ChevronFirst, ChevronLast, ArrowRight,
  Activity, Flame, Target, Download, Upload, FileSpreadsheet, ShieldAlert,
  Moon, Sun, Palette, Award, Calendar, Cpu, Code2, Database, Terminal, Menu as MenuIcon,
  BarChart3, Sliders, Zap, CheckSquare, Code, Lightbulb, Trophy, Image as ImageIcon
} from "lucide-react";

// Storage polyfill for web browsers
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    get: async (key) => {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    },
    set: async (key, value) => {
      localStorage.setItem(key, value);
    },
  };
}

const fireSwal = (opts) => {
  if (typeof window !== "undefined" && window.Swal) {
    return window.Swal.fire({
      background: "#0c0e1f",
      color: "#e2e8f0",
      confirmButtonColor: "#7c5cff",
      cancelButtonColor: "#ff5c8d",
      customClass: { popup: "swal-dark-popup" },
      ...opts
    });
  } else {
    if (opts.showCancelButton) {
      const confirmed = window.confirm(`${opts.title || ""}\n\n${opts.text || ""}`);
      return Promise.resolve({ isConfirmed: confirmed });
    } else {
      window.alert(`${opts.title || ""}\n\n${opts.text || ""}`);
      return Promise.resolve({ isConfirmed: true });
    }
  }
};

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
const STORAGE_KEY = "attendance-notes-state-v14";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function mod(code, name, creditsOrType = 3, typeVal = "C") {
  let credits = 3;
  let type = "C";
  if (typeof creditsOrType === "number") {
    credits = creditsOrType;
    type = typeVal;
  } else if (typeof creditsOrType === "string") {
    type = typeVal;
  }
  return { code, name, credits, type };
}

const DEGREE_META = {
  AI: { name: "BSc (Hons) in Artificial Intelligence", short: "AI", color: "violet", icon: Cpu },
  IT: { name: "BSc (Hons) in Information Technology", short: "IT", color: "teal", icon: GraduationCap },
  ITM: { name: "BSc (Hons) in IT & Management", short: "IT&M", color: "coral", icon: Layers },
  CUSTOM: { name: "Other / Custom Degree", short: "Custom", color: "amber", icon: BookOpen },
};

const CURRICULA = {
  AI: [
    {
      id: "AI-L1S1", label: "Level 1 - Semester 1", modules: [
        mod("CM1210", "Introduction to Intelligent Machines", 3), mod("CM1220", "Fundamentals of Machines", 3),
        mod("CM1230", "Foundations of Artificial Intelligence", 3), mod("IN1331", "Microcontroller Based System Design", 3),
        mod("IN1321", "Computer Organization", 3), mod("IN1101", "Programming Fundamentals", 3),
        mod("IS1011", "English", 2), mod("CM1900", "Intelligent Machines Inspirational Project", 2),
      ]
    },
    {
      id: "AI-L1S2", label: "Level 1 - Semester 2", modules: [
        mod("CM1410", "Probability and Statistics", 3), mod("CM1310", "Linear Algebra and Calculus", 3),
        mod("IN1401", "Fundamentals of Databases", 3), mod("IN1111", "Data Structures and Algorithms I", 3),
        mod("IN1501", "Data Communication", 3), mod("IN1621", "Web Technologies", 3),
      ]
    },
    {
      id: "AI-L2S1", label: "Level 2 - Semester 1", modules: [
        mod("CM2510", "Modern Approach to Artificial Intelligence", 3), mod("IN2311", "Operating Systems", 3),
        mod("IN2211", "Object-oriented Analysis and Design", 3), mod("IN2201", "Software Engineering", 3),
        mod("IN2101", "Object-Oriented Programming", 3), mod("IS1101", "Principles of Management", 2),
        mod("CM2900", "Industry Based AI Software Project", 3),
      ]
    },
    {
      id: "AI-L2S2", label: "Level 2 - Semester 2", modules: [
        mod("CM2420", "Statistical Inference", 3), mod("CM2320", "Mathematical Methods", 3),
        mod("CM2520", "Deductive Reasoning and Logic Programming", 3), mod("IN2111", "Data Structures and Algorithms II", 3),
        mod("IN2511", "Computer Networks", 3), mod("IN2601", "Computer Graphics", 3), mod("IN2401", "Database Management Systems", 3),
      ]
    },
    {
      id: "AI-L3S1", label: "Level 3 - Semester 1", modules: [
        mod("CM3610", "Expert Systems", 3), mod("CM3230", "Automata Theory", 3), mod("CM3710", "Artificial Neural Networks", 3),
        mod("CM3720", "Machine Learning", 3), mod("CM3810", "Fuzzy Logic", 3), mod("CM3630", "Multi Agent System", 3),
        mod("IN2321", "Computer Architecture", 3), mod("IS3700", "IT Project Management", 3),
      ]
    },
    {
      id: "AI-L3S2", label: "Level 3 - Semester 2", modules: [
        mod("CM3900", "Independent Study in AI", 3), mod("CM3530", "Research Methods", 3),
        mod("CM3620", "Natural Language Processing", 3), mod("CM3820", "Evolutionary Computing", 3),
        mod("IS4430", "Social Aspect of IT", 2), mod("IN3410", "Data Mining and Data Warehousing", 3),
      ]
    },
    {
      id: "AI-L4S1", label: "Level 4 - Semester 1", modules: [
        mod("CM4650", "Semantic Web & Ontological Modelling", 3), mod("CM4730", "Deep Learning", 3),
        mod("CM4150", "Recommender Systems", 3), mod("CM4560", "Philosophy of Science", 2),
        mod("CM4900", "Research Project in AI", 6), mod("IN4630", "Game Theory", 3),
      ]
    },
    {
      id: "AI-L4S2", label: "Level 4 - Semester 2", modules: [
        mod("IS4600", "IT Quality Assurance", 3), mod("IS3450", "Business and Entrepreneurship", 3),
        mod("CM4670", "Quantum Computing", 3), mod("CM4740", "Deep Reinforcement Learning", 3),
        mod("IN4550", "Cyber Security", 3), mod("IN4770", "Cloud Computing", 3),
      ]
    },
  ],
  IT: [
    {
      id: "IT-L1S1", label: "Level 1 - Semester 1", modules: [
        mod("CM1111", "Fundamentals of Mathematics", 3), mod("IN1311", "Digital System Design", 3),
        mod("IN1101", "Programming Fundamentals", 3), mod("IN1321", "Computer Organization", 3),
        mod("IN1611", "Multimedia Technologies", 3), mod("IN1901", "Microcontroller Based Project", 3),
        mod("IS1011", "English", 2),
      ]
    },
    {
      id: "IT-L1S2", label: "Level 1 - Semester 2", modules: [
        mod("CM1131", "Elements of Probability and Statistics", 3), mod("IN1401", "Fundamentals of Databases", 3),
        mod("IN1501", "Data Communication", 3), mod("IN1111", "Data Structures and Algorithms 1", 3),
        mod("IN1621", "Web Technologies", 3), mod("IS1101", "Principles of Management", 2),
      ]
    },
    {
      id: "IT-L2S1", label: "Level 2 - Semester 1", modules: [
        mod("CM2131", "Essentials of Mathematical Methods", 3), mod("IN2101", "Object Oriented Programming", 3),
        mod("IN2211", "Object-Oriented Analysis and Design", 3), mod("IN2201", "Software Engineering", 3),
        mod("IN2321", "Computer Architecture", 3), mod("IN2311", "Operating System", 3),
      ]
    },
    {
      id: "IT-L2S2", label: "Level 2 - Semester 2", modules: [
        mod("CM2111", "Statistical Inference", 3), mod("IN2601", "Computer Graphics", 3),
        mod("IN2111", "Data Structures and Algorithms II", 3), mod("IN2511", "Computer Networks", 3),
        mod("IN2401", "Database Management Systems", 3), mod("IS2211", "Fundamentals of Business Economics", 2),
      ]
    },
    {
      id: "IT-L3S1", label: "Level 3 - Semester 1", modules: [
        mod("CM3311", "Artificial Intelligence", 3), mod("CM3211", "Automata Theory", 3),
        mod("IN3111", "Network Programming", 3), mod("IN3101", "Enterprise Application Development", 3),
        mod("IN3700", "Human Computer Interaction", 3), mod("IS3610", "Management Information Systems", 3),
      ]
    },
    {
      id: "IT-L3S2", label: "Level 3 - Semester 2", modules: [
        mod("CM3321", "Logic Programming & AI Systems", 3), mod("IN3901", "Independent Study", 3),
        mod("IN3910", "Research Methodology", 3), mod("IN3410", "Data Mining and Warehousing", 3),
        mod("IS3450", "Business and Entrepreneurship", 3), mod("IN3001", "Industrial Training", 6),
      ]
    },
    {
      id: "IT-L4S1", label: "Level 4 - Semester 1", modules: [
        mod("CM4371", "Machine Learning & Pattern Recognition", 3), mod("IN4911", "Comprehensive Group Project", 6),
        mod("IN4210", "Advanced Software Engineering", 3), mod("IS3700", "IT Project Management", 3),
      ]
    },
    {
      id: "IT-L4S2", label: "Level 4 - Semester 2", modules: [
        mod("IN4921", "Individual Research Project", 6), mod("IN4770", "Cloud Computing", 3),
        mod("IN4550", "Cyber Security", 3), mod("IN4740", "UI/UX Engineering", 3),
      ]
    },
  ],
  ITM: [
    {
      id: "ITM-L1S1", label: "Level 1 - Semester 1", modules: [
        mod("IN1120", "Structured Programming I", 3), mod("IN1301", "Digital Systems and Digital Computers", 3),
        mod("IN1601", "Multimedia Technologies and Web Design", 3), mod("IS1901", "Microcontroller ICT Project", 2),
        mod("IS1101", "Principles of Management", 3), mod("CM1121", "Essentials of Mathematics", 3), mod("IS1011", "English", 2),
      ]
    },
    {
      id: "ITM-L1S2", label: "Level 1 - Semester 2", modules: [
        mod("IN1130", "Structured Programming II", 3), mod("IN1401", "Fundamentals of Databases", 3),
        mod("IS1110", "Business Foundation", 3), mod("IS1910", "Industry Reconnaissance and Engagement", 2),
        mod("CM1131", "Elements of Probability and Statistics", 3),
      ]
    },
    {
      id: "ITM-L2S1", label: "Level 2 - Semester 1", modules: [
        mod("IN2110", "Fundamentals of OOP", 3), mod("IN2120", "Web Programming", 3),
        mod("IN2201", "Software Engineering", 3), mod("IS2901", "Software Development Project", 3),
        mod("IN2211", "OOAD", 3), mod("IS2200", "Principles of Marketing", 3),
      ]
    },
    {
      id: "ITM-L2S2", label: "Level 2 - Semester 2", modules: [
        mod("IN2610", "Graphic Design and Development", 3), mod("IN2410", "Database Systems", 3),
        mod("IN2301", "Essentials of Computer Architecture", 3), mod("IN2121", "Data Structures and Algorithms I", 3),
        mod("IS2310", "Business Law and Taxation", 3), mod("IS2230", "Economic Applications", 3),
      ]
    },
    {
      id: "ITM-L3S1", label: "Level 3 - Semester 1", modules: [
        mod("IN3311", "Operating Systems", 3), mod("IN3530", "Data Communication & Computer Networks", 3),
        mod("CM3311", "Artificial Intelligence", 3), mod("IS3610", "Management Information Systems", 3),
        mod("IS3700", "IT Project Management", 3),
      ]
    },
    {
      id: "ITM-L3S2", label: "Level 3 - Semester 2", modules: [
        mod("IS3001", "Scientific Communication", 2), mod("IS3500", "Research Methodology", 3),
        mod("IN3410", "Data Mining and Data Warehousing", 3), mod("IS3000", "Industrial Training", 6),
      ]
    },
    {
      id: "ITM-L4S1", label: "Level 4 - Semester 1", modules: [
        mod("IS4650", "Software Management", 3), mod("IS4600", "IT Quality Assurance", 3),
        mod("IS4440", "Professional Practice", 2), mod("IS4660", "Corporate Information Security", 3),
      ]
    },
    {
      id: "ITM-L4S2", label: "Level 4 - Semester 2", modules: [
        mod("IS4990", "Comprehensive Group Project", 6), mod("IN4740", "UI/UX Engineering", 3),
        mod("IN4560", "Information Security", 3), mod("IN4770", "Cloud Computing", 3),
      ]
    },
  ],
  CS: [
    {
      id: "CS-L1S1", label: "Level 1 - Semester 1", modules: [
        mod("CS1010", "Discrete Mathematics", 3), mod("CS1020", "Programming Fundamentals", 3),
        mod("CS1030", "Computer Systems Architecture", 3), mod("CS1040", "Linear Algebra for Computing", 3),
        mod("IS1011", "Academic English", 2),
      ]
    },
    {
      id: "CS-L1S2", label: "Level 1 - Semester 2", modules: [
        mod("CS1110", "Data Structures & Algorithms 1", 3), mod("CS1120", "Object-Oriented Programming", 3),
        mod("CS1130", "Multivariable Calculus", 3), mod("CS1140", "Probability & Statistics", 3),
        mod("CS1150", "Database Systems Fundamentals", 3),
      ]
    },
    {
      id: "CS-L2S1", label: "Level 2 - Semester 1", modules: [
        mod("CS2010", "Data Structures & Algorithms 2", 3), mod("CS2020", "Operating Systems Engineering", 3),
        mod("CS2030", "Advanced Computer Architecture", 3), mod("CS2040", "Software Engineering Principles", 3),
      ]
    },
    {
      id: "CS-L2S2", label: "Level 2 - Semester 2", modules: [
        mod("CS2110", "Computer Networks & Protocols", 3), mod("CS2120", "Theory of Computation & Automata", 3),
        mod("CS2130", "Full-Stack Web Engineering", 3), mod("CS2140", "Systems Programming in C/C++", 3),
      ]
    },
    {
      id: "CS-L3S1", label: "Level 3 - Semester 1", modules: [
        mod("CS3010", "Artificial Intelligence & Logic", 3), mod("CS3020", "Compiler Construction & Design", 3),
        mod("CS3030", "Database Management Systems", 3), mod("CS3040", "Parallel & Distributed Computing", 3),
      ]
    },
    {
      id: "CS-L3S2", label: "Level 3 - Semester 2", modules: [
        mod("CS3110", "Software Architecture & Design Patterns", 3), mod("CS3120", "Computer & Network Security", 3),
        mod("CS3130", "Research Methods in CS", 3), mod("CS3000", "Industrial Internship", 6),
      ]
    },
    {
      id: "CS-L4S1", label: "Level 4 - Semester 1", modules: [
        mod("CS4010", "Machine Learning & Pattern Recognition", 3), mod("CS4020", "Distributed Systems Engineering", 3),
        mod("CS4900", "Capstone Research Project I", 6), mod("CS4030", "Computer Vision & Image Processing", 3),
      ]
    },
    {
      id: "CS-L4S2", label: "Level 4 - Semester 2", modules: [
        mod("CS4110", "Cloud Native Infrastructure", 3), mod("CS4120", "Deep Learning Architectures", 3),
        mod("CS4910", "Capstone Research Project II", 6), mod("CS4130", "Natural Language Processing", 3),
      ]
    },
  ],
  SE: [
    {
      id: "SE-L1S1", label: "Level 1 - Semester 1", modules: [
        mod("SE1010", "Software Engineering Fundamentals", 3), mod("SE1020", "Programming I (Python/Java)", 3),
        mod("SE1030", "Discrete Mathematics for Software", 3), mod("SE1040", "Web Foundations (HTML/CSS/JS)", 3),
        mod("IS1011", "Professional Communication", 2),
      ]
    },
    {
      id: "SE-L1S2", label: "Level 1 - Semester 2", modules: [
        mod("SE1110", "Programming II (Advanced OOP)", 3), mod("SE1120", "Data Structures & Algorithms", 3),
        mod("SE1130", "Database Systems Design", 3), mod("SE1140", "UI/UX Design & Prototyping", 3),
      ]
    },
    {
      id: "SE-L2S1", label: "Level 2 - Semester 1", modules: [
        mod("SE2010", "Object-Oriented Analysis & Design", 3), mod("SE2020", "Operating Systems Architecture", 3),
        mod("SE2030", "Algorithm Analysis & Complexity", 3), mod("SE2040", "Software Requirements Engineering", 3),
      ]
    },
    {
      id: "SE-L2S2", label: "Level 2 - Semester 2", modules: [
        mod("SE2110", "Software Architecture & Frameworks", 3), mod("SE2120", "Database Engineering & SQL", 3),
        mod("SE2130", "Computer Networks & APIs", 3), mod("SE2140", "Software Testing & Quality Assurance", 3),
      ]
    },
    {
      id: "SE-L3S1", label: "Level 3 - Semester 1", modules: [
        mod("SE3010", "Agile Project Management & Scrum", 3), mod("SE3020", "Enterprise Application Development", 3),
        mod("SE3030", "DevOps & CI/CD Pipelines", 3), mod("SE3040", "Mobile Application Development", 3),
      ]
    },
    {
      id: "SE-L3S2", label: "Level 3 - Semester 2", modules: [
        mod("SE3110", "Software Security & Vulnerability Analysis", 3), mod("SE3120", "Research & Technical Writing", 3),
        mod("SE3000", "Software Industry Internship", 6),
      ]
    },
    {
      id: "SE-L4S1", label: "Level 4 - Semester 1", modules: [
        mod("SE4010", "Cloud Native Software Engineering", 3), mod("SE4020", "Microservices & Distributed Systems", 3),
        mod("SE4900", "Software Engineering Capstone I", 6),
      ]
    },
    {
      id: "SE-L4S2", label: "Level 4 - Semester 2", modules: [
        mod("SE4110", "Software Metrics & Quality Management", 3), mod("SE4120", "High Performance Computing", 3),
        mod("SE4910", "Software Engineering Capstone II", 6),
      ]
    },
  ],
  DS: [
    {
      id: "DS-L1S1", label: "Level 1 - Semester 1", modules: [
        mod("DS1010", "Introduction to Data Science", 3), mod("DS1020", "Programming for Data Science (Python)", 3),
        mod("DS1030", "Calculus & Analytical Geometry", 3), mod("DS1040", "Linear Algebra for Data Science", 3),
        mod("IS1011", "Technical Communication", 2),
      ]
    },
    {
      id: "DS-L1S2", label: "Level 1 - Semester 2", modules: [
        mod("DS1110", "Probability & Mathematical Statistics", 3), mod("DS1120", "Data Structures & File Formats", 3),
        mod("DS1130", "Database Systems & SQL", 3), mod("DS1140", "R Programming & Exploratory Data Analysis", 3),
        mod("DS1150", "Data Visualization & Dashboards", 3),
      ]
    },
    {
      id: "DS-L2S1", label: "Level 2 - Semester 1", modules: [
        mod("DS2010", "Statistical Inference & Hypothesis Testing", 3), mod("DS2020", "Data Mining & Knowledge Discovery", 3),
        mod("DS2030", "Applied Econometrics & Regression", 3), mod("DS2040", "Machine Learning I (Supervised)", 3),
      ]
    },
    {
      id: "DS-L2S2", label: "Level 2 - Semester 2", modules: [
        mod("DS2110", "Big Data Analytics & Hadoop/Spark", 3), mod("DS2120", "Data Engineering & ETL Pipelines", 3),
        mod("DS2130", "Mathematical Optimization", 3), mod("DS2140", "Time Series Analysis & Forecasting", 3),
      ]
    },
    {
      id: "DS-L3S1", label: "Level 3 - Semester 1", modules: [
        mod("DS3010", "Deep Learning & Neural Networks", 3), mod("DS3020", "Natural Language Processing (NLP)", 3),
        mod("DS3030", "Feature Engineering & Selection", 3), mod("DS3040", "Business Intelligence & Decision Analytics", 3),
      ]
    },
    {
      id: "DS-L3S2", label: "Level 3 - Semester 2", modules: [
        mod("DS3110", "Research Methods in Data Science", 3), mod("DS3120", "Cloud Data Warehousing (Snowflake/BigQuery)", 3),
        mod("DS3000", "Data Science Industry Internship", 6),
      ]
    },
    {
      id: "DS-L4S1", label: "Level 4 - Semester 1", modules: [
        mod("DS4010", "Reinforcement Learning & AI", 3), mod("DS4020", "Computer Vision & Spatial Analytics", 3),
        mod("DS4900", "Data Science Thesis Project I", 6),
      ]
    },
    {
      id: "DS-L4S2", label: "Level 4 - Semester 2", modules: [
        mod("DS4110", "AI Ethics, Bias & Governance", 3), mod("DS4120", "Distributed Processing & MLOps", 3),
        mod("DS4910", "Data Science Thesis Project II", 6),
      ]
    },
  ],
};

const MODULE_COLORS = ["violet", "teal", "coral", "amber", "sky", "rose", "lime", "indigo"];

const STATUS = {
  present: { label: "Present", icon: CheckCircle2, cls: "st-present" },
  absent: { label: "Absent", icon: XCircle, cls: "st-absent" },
  cancelled: { label: "Cancelled", icon: MinusCircle, cls: "st-cancelled" },
};

const GRADE_SCALE = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D": 1.0, "F": 0.0
};

function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function fmtDate(d) {
  return d.toISOString().slice(0, 10);
}
function fmtDateLabel(d) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
function fmtMonthYear(d) {
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function calculateBunk(present, marked, thresholdPct) {
  if (marked === 0) return { status: "safe", count: 0, label: "No classes marked yet" };
  const target = thresholdPct / 100;
  const currentRatio = present / marked;

  if (currentRatio >= target) {
    const safeSkips = Math.floor((present - target * marked) / target);
    return {
      status: "safe",
      count: safeSkips,
      label: safeSkips > 0 ? `Can miss ${safeSkips} more class${safeSkips > 1 ? 'es' : ''}` : "On the margin! Don't miss next class"
    };
  } else {
    const mustAttend = Math.ceil((target * marked - present) / (1 - target));
    return {
      status: "danger",
      count: mustAttend,
      label: `MUST attend next ${mustAttend} class${mustAttend > 1 ? 'es' : ''}`
    };
  }
}

function getDemoData() {
  const m1Id = "demo-mod-1";
  const m2Id = "demo-mod-2";
  const m3Id = "demo-mod-3";
  const m4Id = "demo-mod-4";

  const today = new Date();
  const d = (daysAgo) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  };

  const modules = [
    {
      id: m1Id, code: "CM3720", name: "Machine Learning & AI", credits: 3, grade: "A", color: "violet", threshold: 80,
      schedule: [{ id: "s1", day: 0, start: "09:00", end: "11:00", venue: "Auditorium A" }]
    },
    {
      id: m2Id, code: "IN2311", name: "Operating Systems", credits: 3, grade: "A", color: "teal", threshold: 80,
      schedule: [{ id: "s2", day: 1, start: "11:00", end: "13:00", venue: "Lab 3" }]
    },
    {
      id: m3Id, code: "IN2101", name: "Object-Oriented Programming", credits: 3, grade: "A-", color: "sky", threshold: 80,
      schedule: [{ id: "s3", day: 2, start: "14:00", end: "16:00", venue: "Lecture Hall 2" }]
    },
    {
      id: m4Id, code: "CM1210", name: "Intelligent Machines", credits: 3, grade: "B+", color: "coral", threshold: 75,
      schedule: [{ id: "s4", day: 3, start: "09:00", end: "11:00", venue: "Auditorium B" }]
    }
  ];

  const sessions = [
    {
      id: "sess-1", moduleId: m1Id, date: d(1), slotId: "s1", status: "present",
      takeaways: "Understand Gradient Descent optimization and Learning Rate tuning.",
      topics: ["Supervised Learning", "Linear Regression", "Gradient Descent"],
      note: "Professor covered cost function convergence. Recommended studying Chapter 3 of textbook.",
      codeSnippet: "def gradient_descent(X, y, lr=0.01, epochs=1000):\n    # W_new = W - lr * dJ/dW\n    pass",
      tags: ["Exam Topic", "Formula"],
      todos: [{ id: "t1", text: "Complete Assignment 1 on Linear Regression", done: false }]
    },
    {
      id: "sess-2", moduleId: m2Id, date: d(2), slotId: "s2", status: "present",
      takeaways: "Process synchronization using Semaphores and Mutex locks.",
      topics: ["Process Management", "Semaphores", "Deadlocks"],
      note: "Discussed Dining Philosophers problem and prevention techniques.",
      codeSnippet: "sem_wait(&mutex);\n// Critical Section\nsem_post(&mutex);",
      tags: ["Lab Practice"],
      todos: [{ id: "t2", text: "Implement Mutex C program in Lab 3", done: true }]
    },
    {
      id: "sess-3", moduleId: m3Id, date: d(3), slotId: "s3", status: "present",
      takeaways: "Polymorphism, Method Overriding vs Overloading in Java.",
      topics: ["Inheritance", "Interfaces", "Abstract Classes"],
      note: "Practiced factory design pattern implementations.",
      codeSnippet: "public interface Machine {\n    void execute();\n}",
      tags: ["OOP Core"],
      todos: []
    },
    {
      id: "sess-4", moduleId: m4Id, date: d(5), slotId: "s4", status: "absent",
      takeaways: "State Space Search & A* Search algorithm.",
      topics: ["Search Space", "Heuristic Functions"],
      note: "Missed due to campus event. Borrowed notes from Alex.",
      codeSnippet: "f(n) = g(n) + h(n)",
      tags: ["Missed Lecture"],
      todos: [{ id: "t3", text: "Read Chapter 4 on Heuristic Search", done: false }]
    }
  ];

  const deadlines = [
    { id: "dl-1", title: "Machine Learning Midterm Exam", moduleId: m1Id, dueDate: d(-5), type: "exam", done: false },
    { id: "dl-2", title: "OS Mutex C Programming Lab", moduleId: m2Id, dueDate: d(-2), type: "assignment", done: false },
    { id: "dl-3", title: "OOP Java Project Submission", moduleId: m3Id, dueDate: d(-10), type: "assignment", done: false }
  ];

  return { degree: "AI", modules, sessions, deadlines, theme: "cyberpunk" };
}

function emptyState() {
  return getDemoData();
}

export default function App() {
  const [state, setState] = useState(emptyState());
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [weekOffset, setWeekOffset] = useState(0);
  const [setupOpen, setSetupOpen] = useState(false);
  const [sessionModal, setSessionModal] = useState(null);
  const [moduleModal, setModuleModal] = useState(null);
  const [deadlineModal, setDeadlineModal] = useState(null);
  const [addOneOff, setAddOneOff] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const saveTimer = useRef(null);

  // Load SweetAlert2 CDN dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Swal) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
      document.head.appendChild(script);
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const commitState = useCallback((nextStateOrFn, actionName = "") => {
    setState((currentState) => {
      const nextState = typeof nextStateOrFn === "function" ? nextStateOrFn(currentState) : nextStateOrFn;
      setHistoryPast((past) => [...past.slice(-30), currentState]);
      setHistoryFuture([]);
      if (actionName) showToast(actionName);
      return nextState;
    });
  }, [showToast]);

  const undo = useCallback(() => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, historyPast.length - 1);
    setHistoryFuture((future) => [state, ...future]);
    setHistoryPast(newPast);
    setState(previous);
    fireSwal({ title: "Undo", text: "Action reverted successfully!", icon: "info", timer: 1500, showConfirmButton: false });
  }, [historyPast, state]);

  const redo = useCallback(() => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);
    setHistoryPast((past) => [...past, state]);
    setHistoryFuture(newFuture);
    setState(next);
    fireSwal({ title: "Redo", text: "Action reapplied successfully!", icon: "info", timer: 1500, showConfirmButton: false });
  }, [historyFuture, state]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if (isInput) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key.toLowerCase() === "z") {
        if (e.shiftKey) { e.preventDefault(); redo(); }
        else { e.preventDefault(); undo(); }
      } else if (modKey && e.key.toLowerCase() === "y") {
        e.preventDefault(); redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setState({
            degree: parsed.degree || null,
            modules: parsed.modules || [],
            sessions: parsed.sessions || [],
            deadlines: parsed.deadlines || [],
            theme: parsed.theme || "cyberpunk"
          });
        }
      } catch (e) {
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(state), false);
      } catch (e) {
        console.error("Save error:", e);
      }
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [state, loaded]);

  useEffect(() => {
    if (loaded && state.modules.length === 0) setSetupOpen(true);
  }, [loaded]);

  const modulesById = useMemo(() => {
    const m = {};
    state.modules.forEach((mo) => (m[mo.id] = mo));
    return m;
  }, [state.modules]);

  const sessionsByKey = useMemo(() => {
    const m = {};
    state.sessions.forEach((s) => (m[s.moduleId + "|" + s.date + "|" + s.slotId] = s));
    return m;
  }, [state.sessions]);

  const weekStart = useMemo(() => addDays(startOfWeek(new Date()), weekOffset * 7), [weekOffset]);
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const occurrencesByDate = useMemo(() => {
    const out = {};
    weekDates.forEach((d) => {
      const dayIdx = (d.getDay() + 6) % 7;
      const dateStr = fmtDate(d);
      const list = [];
      state.modules.forEach((mo) => {
        (mo.schedule || []).forEach((slot) => {
          if (slot.day === dayIdx) list.push({ module: mo, slot });
        });
      });
      state.sessions
        .filter((s) => s.date === dateStr && s.slotId.startsWith("adhoc-"))
        .forEach((s) => {
          const mo = modulesById[s.moduleId];
          if (mo) list.push({ module: mo, slot: { id: s.slotId, day: dayIdx, start: s.adhocTime || "", venue: s.adhocVenue || "", adhoc: true } });
        });
      list.sort((a, b) => (a.slot.start || "").localeCompare(b.slot.start || ""));
      out[dateStr] = list;
    });
    return out;
  }, [weekDates, state.modules, state.sessions, modulesById]);

  const stats = useMemo(() => {
    const perModule = {};
    state.modules.forEach((mo) => (perModule[mo.id] = { present: 0, absent: 0, cancelled: 0, marked: 0 }));
    state.sessions.forEach((s) => {
      if (!perModule[s.moduleId]) return;
      if (s.status === "present") { perModule[s.moduleId].present++; perModule[s.moduleId].marked++; }
      else if (s.status === "absent") { perModule[s.moduleId].absent++; perModule[s.moduleId].marked++; }
      else if (s.status === "cancelled") { perModule[s.moduleId].cancelled++; }
    });
    let totalPresent = 0, totalMarked = 0;
    Object.values(perModule).forEach((v) => { totalPresent += v.present; totalMarked += v.marked; });
    const overallPct = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : null;
    return { perModule, overallPct, totalMarked, totalPresent };
  }, [state.modules, state.sessions]);

  // GPA Calculation
  const gpaStats = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    state.modules.forEach((mo) => {
      if (mo.grade && GRADE_SCALE[mo.grade] !== undefined) {
        const credits = Number(mo.credits) || 3;
        totalCredits += credits;
        totalPoints += GRADE_SCALE[mo.grade] * credits;
      }
    });
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;
    return { gpa, totalCredits };
  }, [state.modules]);

  // Streak & Badge Calculations
  const streakAndBadges = useMemo(() => {
    const sortedSessions = [...state.sessions]
      .filter((s) => s.status === "present" || s.status === "absent")
      .sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    for (let s of sortedSessions) {
      if (s.status === "present") streak++;
      else break;
    }

    const badges = [
      {
        id: "bunk_proof", label: "Bunk Proof", icon: ShieldAlert, earned: state.modules.length > 0 && state.modules.every((m) => {
          const s = stats.perModule[m.id];
          return !s || s.marked === 0 || (s.present / s.marked) >= (m.threshold || 80) / 100;
        }), desc: "All modules above target"
      },
      { id: "gpa_titan", label: "GPA Titan", icon: Award, earned: gpaStats.gpa !== null && parseFloat(gpaStats.gpa) >= 3.7, desc: "Projected GPA >= 3.7" },
      { id: "iron_scholar", label: "Iron Scholar", icon: Flame, earned: streak >= 5, desc: "5+ Class Attendance Streak" },
      { id: "note_master", label: "Note Master", icon: StickyNote, earned: state.sessions.filter((s) => s.note || (s.topics && s.topics.length)).length >= 5, desc: "Recorded 5+ Lecture Notes" }
    ];

    return { streak, badges };
  }, [state.sessions, state.modules, stats, gpaStats]);

  const pendingTodos = useMemo(() => {
    const items = [];
    state.sessions.forEach((s) => {
      (s.todos || []).forEach((t) => {
        if (!t.done) items.push({ ...t, sessionId: s.id, moduleId: s.moduleId, date: s.date });
      });
    });
    items.sort((a, b) => a.date.localeCompare(b.date));
    return items;
  }, [state.sessions]);

  const notesFeed = useMemo(() => {
    let items = state.sessions.filter((s) => (s.topics && s.topics.length) || (s.tags && s.tags.length) || s.note || s.takeaways || s.codeSnippet);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((s) => {
        const mo = modulesById[s.moduleId];
        const hay = [mo?.name, mo?.code, s.note, s.takeaways, s.codeSnippet, ...(s.topics || []), ...(s.tags || []), ...(s.todos || []).map((t) => t.text)]
          .filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      });
    }
    return items.sort((a, b) => b.date.localeCompare(a.date));
  }, [state.sessions, search, modulesById]);

  // Data Export & Import Handlers with SweetAlert
  const exportBackupJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `attendance_tracker_backup_${fmtDate(new Date())}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    fireSwal({ title: "Backup Complete!", text: "Your data has been exported to JSON.", icon: "success" });
  };

  const exportCSVReport = () => {
    let csvStr = "Module Code,Module Name,Present,Total Marked,Attendance %,Target %,Status,Grade,Credits\n";
    state.modules.forEach((mo) => {
      const s = stats.perModule[mo.id] || { present: 0, marked: 0 };
      const pct = s.marked > 0 ? Math.round((s.present / s.marked) * 100) : "N/A";
      const bunk = calculateBunk(s.present, s.marked, mo.threshold || 80);
      csvStr += `"${mo.code || ""}","${mo.name}",${s.present},${s.marked},${pct}%,${mo.threshold || 80}%,"${bunk.label}","${mo.grade || "N/A"}",${mo.credits || 3}\n`;
    });
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvStr);
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `attendance_report_${fmtDate(new Date())}.csv`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    fireSwal({ title: "Report Exported!", text: "CSV Attendance report has been downloaded.", icon: "success" });
  };

  const loadDemoData = () => {
    commitState(getDemoData(), "Loaded sample demo data");
    fireSwal({ title: "Demo Data Loaded! 🎉", text: "Sample modules, lecture notes, and deadlines loaded. You can explore all features or click Reset to start fresh anytime.", icon: "success" });
  };

  const clearAllData = async () => {
    const res = await fireSwal({
      title: "Clear All Data & Reset?",
      text: "This will remove all sample modules, lecture notes, and deadlines so you can start completely fresh with your own courses.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reset Everything",
      confirmButtonColor: "#ff5c8d"
    });
    if (res.isConfirmed) {
      commitState({ degree: null, modules: [], sessions: [], deadlines: [], theme: state.theme || "cyberpunk" }, "Reset all data");
      fireSwal({ title: "Reset Complete!", text: "All data cleared. You can now import your curriculum or add modules!", icon: "success" });
    }
  };

  const importBackupJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedState = JSON.parse(event.target.result);
        if (importedState && Array.isArray(importedState.modules)) {
          commitState(importedState, "Backup restored successfully");
          fireSwal({ title: "Restored!", text: "Your backup was successfully imported.", icon: "success" });
        } else {
          fireSwal({ title: "Invalid File!", text: "The selected file is not a valid backup JSON.", icon: "error" });
        }
      } catch (err) {
        fireSwal({ title: "Import Error", text: "Failed to parse the backup file.", icon: "error" });
      }
    };
    reader.readAsText(file);
  };

  function upsertSession(partial) {
    commitState((st) => {
      const idx = st.sessions.findIndex((s) => s.moduleId === partial.moduleId && s.date === partial.date && s.slotId === partial.slotId);
      const sessions = [...st.sessions];
      if (idx >= 0) sessions[idx] = { ...sessions[idx], ...partial };
      else sessions.push({ id: uid(), status: null, topics: [], todos: [], tags: [], note: "", takeaways: "", codeSnippet: "", ...partial });
      return { ...st, sessions };
    }, "Attendance status updated");
  }

  async function deleteSession(id) {
    const res = await fireSwal({
      title: "Delete Session?",
      text: "Are you sure you want to remove this lecture session and its notes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });
    if (res.isConfirmed) {
      commitState((st) => ({ ...st, sessions: st.sessions.filter((s) => s.id !== id) }), "Session deleted");
      fireSwal({ title: "Deleted!", text: "Session notes removed.", icon: "success", timer: 1500, showConfirmButton: false });
    }
  }

  function addModule(mo) {
    commitState((st) => ({ ...st, modules: [...st.modules, mo] }), `Module ${mo.code || mo.name} added`);
  }

  function updateModule(id, patch) {
    commitState((st) => ({ ...st, modules: st.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)) }), "Module updated");
  }

  async function removeModule(id) {
    const mo = modulesById[id];
    const res = await fireSwal({
      title: `Remove ${mo?.name || 'Module'}?`,
      text: "This will remove the module and all associated lecture records!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove module"
    });
    if (res.isConfirmed) {
      commitState((st) => ({
        ...st,
        modules: st.modules.filter((m) => m.id !== id),
        sessions: st.sessions.filter((s) => s.moduleId !== id)
      }), "Module removed");
      fireSwal({ title: "Removed!", text: "Module has been removed.", icon: "success", timer: 1500, showConfirmButton: false });
    }
  }

  function addDeadline(deadline) {
    commitState((st) => ({ ...st, deadlines: [...(st.deadlines || []), { ...deadline, id: uid(), done: false }] }), "Exam / Assignment added");
    fireSwal({ title: "Deadline Saved!", text: `${deadline.title} added to your schedule.`, icon: "success" });
  }

  function toggleDeadline(id) {
    commitState((st) => ({
      ...st,
      deadlines: (st.deadlines || []).map((d) => d.id === id ? { ...d, done: !d.done } : d)
    }), "Deadline status updated");
  }

  async function deleteDeadline(id) {
    const res = await fireSwal({
      title: "Remove Deadline?",
      text: "Are you sure you want to delete this deadline?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete"
    });
    if (res.isConfirmed) {
      commitState((st) => ({ ...st, deadlines: (st.deadlines || []).filter((d) => d.id !== id) }), "Deadline removed");
    }
  }

  function applyTemplate(degreeKey, blockId) {
    const block = CURRICULA[degreeKey]?.find((b) => b.id === blockId);
    if (!block) return;
    const compulsory = block.modules.filter((m) => m.type === "C");
    const newMods = compulsory.map((m, i) => ({
      id: uid(), code: m.code, name: m.name, credits: m.credits || 3, grade: "A",
      color: MODULE_COLORS[(state.modules.length + i) % MODULE_COLORS.length],
      threshold: 80, schedule: [],
    }));
    commitState((st) => ({ ...st, degree: degreeKey, modules: [...st.modules, ...newMods] }), `Loaded ${block.label} modules`);
    setSetupOpen(false);
    setTab("modules");
    fireSwal({ title: "Curriculum Loaded!", text: `Loaded ${newMods.length} modules from ${block.label}.`, icon: "success" });
  }

  function toggleTodo(sessionId, todoId) {
    commitState((st) => ({
      ...st,
      sessions: st.sessions.map((s) => s.id === sessionId
        ? { ...s, todos: s.todos.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t)) }
        : s),
    }), "Task status changed");
  }

  function setTheme(t) {
    commitState((st) => ({ ...st, theme: t }), `Theme switched to ${t}`);
  }

  if (!loaded) {
    return (
      <div className="app">
        <style>{CSS}</style>
        <div className="loading"><Loader2 className="spin" size={36} /><span>Loading Next-Gen Portal…</span></div>
      </div>
    );
  }

  return (
    <div className={`app theme-${state.theme || 'cyberpunk'}`}>
      <style>{CSS}</style>
      <div className="bg" />

      <input type="file" ref={fileInputRef} onChange={importBackupJSON} accept=".json" style={{ display: "none" }} />

      <header className="header">
        <div className="brand">
          <div className="logo-icon"><GraduationCap size={22} /></div>
          <span>Lecture Tracker <span className="pro-badge">PRO v4</span></span>
        </div>

        {/* Desktop Header Navigation */}
        <nav className="navtabs desktop-nav">
          <button className={"tab" + (tab === "dashboard" ? " active" : "")} onClick={() => setTab("dashboard")}><LayoutDashboard size={15} /> Dashboard</button>
          <button className={"tab" + (tab === "week" ? " active" : "")} onClick={() => setTab("week")}><CalendarClock size={15} /> Week View</button>
          <button className={"tab" + (tab === "analytics" ? " active" : "")} onClick={() => setTab("analytics")}><BarChart3 size={15} /> Analytics & Goal Simulator</button>
          <button className={"tab" + (tab === "deadlines" ? " active" : "")} onClick={() => setTab("deadlines")}><Calendar size={15} /> Exams ({(state.deadlines || []).filter(d => !d.done).length})</button>
          <button className={"tab" + (tab === "modules" ? " active" : "")} onClick={() => setTab("modules")}><Layers size={15} /> Modules ({state.modules.length})</button>
        </nav>

        <div className="undo-redo-toolbar desktop-nav">
          <div className="theme-toggle">
            <button className={"theme-btn" + (state.theme === "cyberpunk" ? " active" : "")} onClick={() => setTheme("cyberpunk")} title="Cyberpunk Dark"><Sparkles size={14} /></button>
            <button className={"theme-btn" + (state.theme === "midnight" ? " active" : "")} onClick={() => setTheme("midnight")} title="Midnight Blue"><Moon size={14} /></button>
            <button className={"theme-btn" + (state.theme === "light" ? " active" : "")} onClick={() => setTheme("light")} title="Light Academic"><Sun size={14} /></button>
          </div>

          <div className="history-group">
            <button className="history-btn" onClick={undo} disabled={historyPast.length === 0} title="Undo (Cmd+Z / Ctrl+Z)">
              <Undo2 size={15} />
              {historyPast.length > 0 && <span className="history-count">{historyPast.length}</span>}
            </button>
            <button className="history-btn" onClick={redo} disabled={historyFuture.length === 0} title="Redo (Cmd+Shift+Z / Ctrl+Y)">
              <Redo2 size={15} />
              {historyFuture.length > 0 && <span className="history-count">{historyFuture.length}</span>}
            </button>
          </div>

          <div className="action-group">
            <button className="history-btn glow-border" onClick={exportBackupJSON} title="Backup Data to JSON">
              <Download size={14} /> Backup
            </button>
            <button className="history-btn" onClick={() => fileInputRef.current?.click()} title="Restore Data from JSON">
              <Upload size={14} /> Restore
            </button>
            <button className="history-btn" onClick={exportCSVReport} title="Export CSV Report">
              <FileSpreadsheet size={14} /> CSV
            </button>
            <button className="history-btn" onClick={loadDemoData} title="Load Sample Demo Data">
              <Sparkles size={14} /> Demo
            </button>
            <button className="history-btn danger" onClick={clearAllData} title="Clear All Data & Reset">
              <Trash2 size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button className="mobile-menu-trigger icon-btn" onClick={() => setMobileMenuOpen(true)}>
          <MenuIcon size={22} />
        </button>
      </header>

      {/* Mobile Slide-Out Side Navigation Drawer */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(false)}>
        <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <div className="brand">
              <div className="logo-icon"><GraduationCap size={20} /></div>
              <span>Menu</span>
            </div>
            <button className="icon-btn" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
          </div>

          <div className="drawer-body">
            <div className="drawer-section-title">Navigation</div>
            <button className={"drawer-nav-item" + (tab === "dashboard" ? " active" : "")} onClick={() => { setTab("dashboard"); setMobileMenuOpen(false); }}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button className={"drawer-nav-item" + (tab === "week" ? " active" : "")} onClick={() => { setTab("week"); setMobileMenuOpen(false); }}>
              <CalendarClock size={18} /> Week View
            </button>
            <button className={"drawer-nav-item" + (tab === "analytics" ? " active" : "")} onClick={() => { setTab("analytics"); setMobileMenuOpen(false); }}>
              <BarChart3 size={18} /> Analytics & Simulator
            </button>
            <button className={"drawer-nav-item" + (tab === "deadlines" ? " active" : "")} onClick={() => { setTab("deadlines"); setMobileMenuOpen(false); }}>
              <Calendar size={18} /> Exams & Assignments ({(state.deadlines || []).filter(d => !d.done).length})
            </button>
            <button className={"drawer-nav-item" + (tab === "modules" ? " active" : "")} onClick={() => { setTab("modules"); setMobileMenuOpen(false); }}>
              <Layers size={18} /> Enrolled Modules ({state.modules.length})
            </button>

            <div className="drawer-divider" />

            <div className="drawer-section-title">Appearance Theme</div>
            <div className="drawer-theme-grid">
              <button className={"drawer-theme-btn" + (state.theme === "cyberpunk" ? " active" : "")} onClick={() => setTheme("cyberpunk")}>
                <Sparkles size={16} /> Cyberpunk
              </button>
              <button className={"drawer-theme-btn" + (state.theme === "midnight" ? " active" : "")} onClick={() => setTheme("midnight")}>
                <Moon size={16} /> Midnight
              </button>
              <button className={"drawer-theme-btn" + (state.theme === "light" ? " active" : "")} onClick={() => setTheme("light")}>
                <Sun size={16} /> Light
              </button>
            </div>

            <div className="drawer-divider" />

            <div className="drawer-section-title">History & Data Actions</div>
            <div className="drawer-actions-grid">
              <button className="drawer-action-btn" onClick={undo} disabled={historyPast.length === 0}>
                <Undo2 size={16} /> Undo ({historyPast.length})
              </button>
              <button className="drawer-action-btn" onClick={redo} disabled={historyFuture.length === 0}>
                <Redo2 size={16} /> Redo ({historyFuture.length})
              </button>
              <button className="drawer-action-btn primary" onClick={loadDemoData}>
                <Sparkles size={16} /> Load Demo Data
              </button>
              <button className="drawer-action-btn" onClick={exportBackupJSON}>
                <Download size={16} /> Backup JSON
              </button>
              <button className="drawer-action-btn" onClick={() => { setMobileMenuOpen(false); fileInputRef.current?.click(); }}>
                <Upload size={16} /> Restore JSON
              </button>
              <button className="drawer-action-btn" onClick={exportCSVReport}>
                <FileSpreadsheet size={16} /> Export CSV
              </button>
              <button className="drawer-action-btn" style={{ color: "#ff5c8d" }} onClick={clearAllData}>
                <Trash2 size={16} /> Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="toast-banner">
          <Sparkles size={15} /> {toastMessage}
        </div>
      )}

      <main className="container tab-anim">
        {tab === "dashboard" && (
          <Dashboard
            state={state} stats={stats} gpaStats={gpaStats} streakAndBadges={streakAndBadges} pendingTodos={pendingTodos} notesFeed={notesFeed}
            modulesById={modulesById} search={search} setSearch={setSearch}
            onToggleTodo={toggleTodo}
            onOpenSession={(s) => {
              const mo = modulesById[s.moduleId];
              setSessionModal({ moduleId: s.moduleId, date: s.date, slotId: s.slotId, moduleName: mo?.name, time: "" });
            }}
            onSetup={() => setSetupOpen(true)}
            onAddOneOff={() => setAddOneOff(true)}
            onAddDeadline={() => setDeadlineModal(true)}
            onLoadDemo={loadDemoData}
          />
        )}

        {tab === "week" && (
          <WeekView
            weekStart={weekStart} weekDates={weekDates} occurrencesByDate={occurrencesByDate}
            sessionsByKey={sessionsByKey} onPrev={() => setWeekOffset((w) => w - 1)} onNext={() => setWeekOffset((w) => w + 1)}
            onToday={() => setWeekOffset(0)}
            onOpen={(mo, slot, dateStr) => setSessionModal({ moduleId: mo.id, date: dateStr, slotId: slot.id, moduleName: mo.name, time: slot.start ? `${slot.start}${slot.end ? "–" + slot.end : ""}` : "" })}
            onAddOneOff={() => setAddOneOff(true)}
            empty={state.modules.length === 0}
          />
        )}

        {tab === "analytics" && (
          <AnalyticsView
            modules={state.modules} stats={stats} gpaStats={gpaStats} streakAndBadges={streakAndBadges}
          />
        )}

        {tab === "deadlines" && (
          <DeadlinesView
            deadlines={state.deadlines || []}
            modulesById={modulesById}
            onAddDeadline={() => setDeadlineModal(true)}
            onToggle={toggleDeadline}
            onDelete={deleteDeadline}
          />
        )}

        {tab === "modules" && (
          <ModulesView
            modules={state.modules} stats={stats} gpaStats={gpaStats}
            onAddTemplate={() => setSetupOpen(true)}
            onEdit={(m) => setModuleModal(m)}
            onAddCustom={() => setModuleModal({ id: null })}
            onRemove={removeModule}
          />
        )}
      </main>

      {setupOpen && (
        <SetupModal
          onClose={() => setSetupOpen(false)}
          onApply={applyTemplate}
          onSkip={() => { setSetupOpen(false); setModuleModal({ id: null }); }}
        />
      )}

      {moduleModal !== null && (
        <ModuleEditModal
          module={moduleModal.id ? state.modules.find((m) => m.id === moduleModal.id) : null}
          existingColorCount={state.modules.length}
          onClose={() => setModuleModal(null)}
          onSave={(data) => {
            if (data.id) updateModule(data.id, data);
            else addModule({ ...data, id: uid() });
            setModuleModal(null);
          }}
        />
      )}

      {deadlineModal && (
        <DeadlineEditModal
          modules={state.modules}
          onClose={() => setDeadlineModal(false)}
          onSave={(data) => { addDeadline(data); setDeadlineModal(false); }}
        />
      )}

      {sessionModal && (
        <SessionModal
          info={sessionModal}
          existing={sessionsByKey[sessionModal.moduleId + "|" + sessionModal.date + "|" + sessionModal.slotId]}
          onClose={() => setSessionModal(null)}
          onSave={(data) => { upsertSession({ ...sessionModal, ...data }); setSessionModal(null); }}
          onDelete={(id) => { deleteSession(id); setSessionModal(null); }}
        />
      )}

      {addOneOff && (
        <OneOffModal
          modules={state.modules}
          onClose={() => setAddOneOff(false)}
          onAdd={({ moduleId, date, time, venue }) => {
            upsertSession({ moduleId, date, slotId: "adhoc-" + uid(), adhocTime: time, adhocVenue: venue, status: null, topics: [], todos: [], tags: [], note: "", takeaways: "", codeSnippet: "" });
            setAddOneOff(false);
          }}
        />
      )}
    </div>
  );
}

function ProgressBar({ pct, warn }) {
  const p = pct == null ? 0 : Math.max(0, Math.min(100, pct));
  return (
    <div className="progress-outer">
      <div className={"progress-inner" + (warn ? " warn" : "")} style={{ width: p + "%" }} />
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft size={14} />
      </button>
      <span className="page-info">Page {currentPage} of {totalPages}</span>
      <button className="page-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function Dashboard({ state, stats, gpaStats, streakAndBadges, pendingTodos, notesFeed, modulesById, search, setSearch, onToggleTodo, onOpenSession, onSetup, onAddOneOff, onAddDeadline, onLoadDemo }) {
  const [todoPage, setTodoPage] = useState(1);
  const [notesPage, setNotesPage] = useState(1);

  const TODOS_PER_PAGE = 4;
  const NOTES_PER_PAGE = 4;

  const totalTodoPages = Math.ceil(pendingTodos.length / TODOS_PER_PAGE) || 1;
  const totalNotesPages = Math.ceil(notesFeed.length / NOTES_PER_PAGE) || 1;

  const paginatedTodos = useMemo(() => {
    const start = (todoPage - 1) * TODOS_PER_PAGE;
    return pendingTodos.slice(start, start + TODOS_PER_PAGE);
  }, [pendingTodos, todoPage]);

  const paginatedNotes = useMemo(() => {
    const start = (notesPage - 1) * NOTES_PER_PAGE;
    return notesFeed.slice(start, start + NOTES_PER_PAGE);
  }, [notesFeed, notesPage]);

  if (state.modules.length === 0) {
    return (
      <div className="empty-hero glass-card fadeInUp">
        <div className="hero-icon"><BookOpen size={48} /></div>
        <h2>No Modules Configured Yet</h2>
        <p>Import your degree curriculum, add modules manually, or load sample demo data to see how it works.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
          <button className="btn primary glow" onClick={onSetup}><Plus size={16} /> Import Curriculum</button>
          <button className="btn ghost" onClick={onLoadDemo}><Sparkles size={16} /> Load Sample Demo Data</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper fadeInUp">
      <div className="hero-banner glass-card">
        <img
          className="hero-cover-img"
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Academic Cover Banner"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="hero-mesh-art" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge float-glow"><Sparkles size={14} /> Academic Command Center</div>
          <h1 className="hero-title">Academic & Attendance Tracker</h1>
          <p className="hero-subtitle">
            Keep your attendance above target, simulate your GPA, and calculate safe skips for every module.
          </p>
          <div className="hero-actions">
            <button className="btn primary glow" onClick={onAddOneOff}><Plus size={16} /> Record Lecture</button>
            <button className="btn ghost" onClick={onAddDeadline}><Calendar size={16} /> Add Exam/Assignment</button>
            <button className="btn ghost" onClick={onSetup}><GraduationCap size={16} /> Curriculum Settings</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat-card">
            <div className="hstat-value">{gpaStats.gpa ? gpaStats.gpa : "N/A"}</div>
            <div className="hstat-label"><Award size={12} /> Projected GPA</div>
          </div>
          <div className="hero-stat-card">
            <div className="hstat-value">{stats.overallPct == null ? "100%" : stats.overallPct + "%"}</div>
            <div className="hstat-label"><Activity size={12} /> Overall Rate</div>
          </div>
          <div className="hero-stat-card">
            <div className="hstat-value">🔥 {streakAndBadges.streak}</div>
            <div className="hstat-label"><Flame size={12} /> Class Streak</div>
          </div>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="badge-bar glass-card margin-bottom">
        <div className="badge-title"><Trophy size={16} /> Academic Achievements</div>
        <div className="badge-grid">
          {streakAndBadges.badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.id} className={"badge-item" + (b.earned ? " earned" : " locked")}>
                <div className="badge-icon"><Icon size={18} /></div>
                <div>
                  <div className="badge-name">{b.label}</div>
                  <div className="badge-desc">{b.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dash-grid">
        <div className="card ring-card glass-card">
          <div className="card-title"><Activity size={16} /> Attendance Performance</div>
          <div className="ring-wrap">
            <svg viewBox="0 0 140 140" className="ring-svg">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c5cff" />
                  <stop offset="100%" stopColor="#34e5ff" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r="60" className="ring-bg" />
              <circle cx="70" cy="70" r="60" className={"ring-fg" + (stats.overallPct != null && stats.overallPct < 80 ? " danger" : "")}
                strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - (stats.overallPct || 0) / 100)} />
            </svg>
            <div className="ring-center">
              <span className="ring-value">{stats.overallPct == null ? "–" : stats.overallPct + "%"}</span>
              <span className="ring-label">Average Score</span>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-chip"><span>{stats.totalPresent}</span> <small>Present</small></div>
            <div className="stat-chip"><span>{stats.totalMarked}</span> <small>Marked</small></div>
            <div className="stat-chip"><span>{state.modules.length}</span> <small>Modules</small></div>
          </div>
        </div>

        <div className="card glass-card">
          <h3 className="card-title"><ShieldAlert size={16} /> Bunk Calculator & Module Health</h3>
          <div className="module-stat-list">
            {state.modules.map((mo) => {
              const s = stats.perModule[mo.id] || { present: 0, marked: 0 };
              const pct = s.marked > 0 ? Math.round((s.present / s.marked) * 100) : null;
              const warn = pct != null && pct < (mo.threshold || 80);
              const bunk = calculateBunk(s.present, s.marked, mo.threshold || 80);
              return (
                <div key={mo.id} className="module-stat-row">
                  <div className={"dot dot-" + mo.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="module-stat-name">{mo.name}</div>
                    <div className={"bunk-badge " + bunk.status}>{bunk.label}</div>
                  </div>
                  <div className="module-stat-pct">{pct == null ? "–" : pct + "%"}</div>
                  <ProgressBar pct={pct} warn={warn} />
                  {warn && <AlertTriangle size={14} className="warn-icon" title="Below attendance threshold!" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card glass-card">
          <div className="card-title-row">
            <h3 className="card-title"><ListChecks size={16} /> Action Items ({pendingTodos.length})</h3>
            <Pagination currentPage={todoPage} totalPages={totalTodoPages} onPageChange={(p) => setTodoPage(p)} />
          </div>
          {pendingTodos.length === 0 ? (
            <p className="muted-text">No pending action items! Everything caught up 🎉</p>
          ) : (
            <div className="todo-list">
              {paginatedTodos.map((t) => (
                <label key={t.id} className="todo-item">
                  <input type="checkbox" checked={t.done} onChange={() => onToggleTodo(t.sessionId, t.id)} />
                  <span>{t.text}</span>
                  <small>{modulesById[t.moduleId]?.name} · {fmtDateLabel(new Date(t.date))}</small>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="card wide glass-card">
          <div className="card-title-row">
            <h3 className="card-title"><StickyNote size={16} /> Lecture Notes & Summary</h3>
            <div className="header-controls">
              <div className="search-box">
                <Search size={14} />
                <input placeholder="Search notes, tags, modules…" value={search} onChange={(e) => { setSearch(e.target.value); setNotesPage(1); }} />
              </div>
              <Pagination currentPage={notesPage} totalPages={totalNotesPages} onPageChange={(p) => setNotesPage(p)} />
            </div>
          </div>
          {notesFeed.length === 0 ? (
            <p className="muted-text">No notes added yet. Mark attendance in the Week View to add lecture notes and topics.</p>
          ) : (
            <div className="notes-feed">
              {paginatedNotes.map((s) => (
                <div key={s.id} className="note-card" onClick={() => onOpenSession(s)}>
                  <div className="note-head">
                    <span className={"dot dot-" + (modulesById[s.moduleId]?.color || "violet")} />
                    <strong>{modulesById[s.moduleId]?.name}</strong>
                    <span className="note-date">{fmtDateLabel(new Date(s.date))}</span>
                  </div>
                  {s.takeaways && <div className="takeaways-box"><Lightbulb size={13} /> <span>{s.takeaways}</span></div>}
                  {s.topics && s.topics.length > 0 && <ul className="note-topics">{s.topics.slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}</ul>}
                  {s.note && <p className="note-text">{s.note}</p>}
                  {s.codeSnippet && <pre className="code-box"><code>{s.codeSnippet}</code></pre>}
                  {s.tags && s.tags.length > 0 && <div className="tag-row">{s.tags.map((t, i) => <span key={i} className="tag-chip">{t}</span>)}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalyticsView({ modules, stats, gpaStats, streakAndBadges }) {
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || "");
  const [simAttended, setSimAttended] = useState(5);
  const [simMissed, setSimMissed] = useState(0);

  const selectedModule = useMemo(() => modules.find((m) => m.id === selectedModuleId) || modules[0], [modules, selectedModuleId]);

  const simResult = useMemo(() => {
    if (!selectedModule) return null;
    const current = stats.perModule[selectedModule.id] || { present: 0, marked: 0 };
    const newPresent = current.present + Number(simAttended || 0);
    const newMarked = current.marked + Number(simAttended || 0) + Number(simMissed || 0);
    const newPct = newMarked > 0 ? Math.round((newPresent / newMarked) * 100) : 100;
    const isSafe = newPct >= (selectedModule.threshold || 80);
    return { currentPct: current.marked > 0 ? Math.round((current.present / current.marked) * 100) : 100, newPct, newPresent, newMarked, isSafe };
  }, [selectedModule, stats, simAttended, simMissed]);

  return (
    <div className="analytics-wrapper fadeInUp">
      <h2 className="section-title margin-bottom"><BarChart3 size={20} /> Analytics & Attendance Forecast Simulator</h2>

      <div className="dash-grid margin-bottom">
        {/* Module Attendance Bar Chart */}
        <div className="card glass-card">
          <h3 className="card-title"><TrendingUp size={16} /> Attendance Breakdown by Module</h3>
          <div className="bar-chart-container">
            {modules.map((mo) => {
              const s = stats.perModule[mo.id] || { present: 0, marked: 0 };
              const pct = s.marked > 0 ? Math.round((s.present / s.marked) * 100) : 0;
              return (
                <div key={mo.id} className="chart-bar-row">
                  <span className="chart-bar-label">{mo.code || mo.name.slice(0, 10)}</span>
                  <div className="chart-bar-track">
                    <div className={"chart-bar-fill dot-" + mo.color} style={{ width: pct + "%" }} />
                  </div>
                  <span className="chart-bar-val">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goal Simulator Card */}
        <div className="card glass-card">
          <h3 className="card-title"><Sliders size={16} /> "What-If" Scenario Simulator</h3>
          <p className="muted-text sm">Test how attending or missing future classes affects your attendance target.</p>

          <div className="field margin-top">
            <label>Select Module</label>
            <select value={selectedModuleId} onChange={(e) => setSelectedModuleId(e.target.value)}>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Future Classes Attended</label>
              <input type="number" min="0" max="30" value={simAttended} onChange={(e) => setSimAttended(e.target.value)} />
            </div>
            <div className="field">
              <label>Future Classes Missed</label>
              <input type="number" min="0" max="30" value={simMissed} onChange={(e) => setSimMissed(e.target.value)} />
            </div>
          </div>

          {simResult && (
            <div className={"sim-result-box " + (simResult.isSafe ? "safe" : "danger")}>
              <div className="sim-res-val">{simResult.currentPct}% → {simResult.newPct}%</div>
              <div className="sim-res-status">
                {simResult.isSafe ? `✅ Attendance remains SAFE above target (${selectedModule?.threshold || 80}%)` : `⚠️ Warning! Attendance drops BELOW target threshold`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeadlinesView({ deadlines, modulesById, onAddDeadline, onToggle, onDelete }) {
  return (
    <div className="fadeInUp">
      <div className="week-toolbar">
        <h2 className="section-title">Exams & Assignment Deadlines</h2>
        <button className="btn primary sm glow" onClick={onAddDeadline}><Plus size={14} /> Add Deadline</button>
      </div>

      {deadlines.length === 0 ? (
        <div className="empty-hero glass-card" style={{ padding: "40px 20px" }}>
          <Calendar size={36} />
          <p className="muted-text">No exams or assignment deadlines added yet.</p>
        </div>
      ) : (
        <div className="deadline-grid">
          {deadlines.map((d) => {
            const mo = modulesById[d.moduleId];
            const due = new Date(d.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            const isOverdue = diffDays < 0 && !d.done;

            return (
              <div key={d.id} className={"card deadline-card glass-card" + (d.done ? " is-done" : "") + (isOverdue ? " is-overdue" : "")}>
                <div className="deadline-head">
                  <span className={"type-badge " + (d.type || "assignment")}>{d.type || "assignment"}</span>
                  <button className="icon-btn danger" onClick={() => onDelete(d.id)}><Trash2 size={13} /></button>
                </div>
                <div className="deadline-title">{d.title}</div>
                <div className="deadline-module"><span className={"dot dot-" + (mo?.color || "violet")} /> {mo?.name || "General"}</div>
                <div className="deadline-footer">
                  <span className="deadline-date"><Clock size={12} /> {fmtDateLabel(due)} ({diffDays === 0 ? "Due Today" : diffDays > 0 ? `${diffDays} days left` : "Overdue"})</span>
                  <input type="checkbox" checked={d.done} onChange={() => onToggle(d.id)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WeekView({ weekStart, weekDates, occurrencesByDate, sessionsByKey, onPrev, onNext, onToday, onOpen, onAddOneOff, empty }) {
  const today = fmtDate(new Date());
  const [activeDayIdx, setActiveDayIdx] = useState(null);

  const scrollToDay = (idx) => {
    setActiveDayIdx(idx);
    const el = document.getElementById(`day-col-${idx}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="fadeInUp">
      <div className="week-toolbar">
        <div className="week-nav">
          <button className="icon-btn" onClick={onPrev} title="Previous Week"><ChevronLeft size={18} /></button>
          <span className="week-label">{fmtMonthYear(weekStart)}</span>
          <button className="icon-btn" onClick={onNext} title="Next Week"><ChevronRight size={18} /></button>
          <button className="btn ghost sm" onClick={onToday}>Today</button>
        </div>
        <button className="btn primary sm glow" onClick={onAddOneOff}><Plus size={14} /> Add One-Off Lecture</button>
      </div>

      {/* Mobile Quick Day Selector Pills */}
      <div className="mobile-day-strip">
        {weekDates.map((d, i) => {
          const dateStr = fmtDate(d);
          const isToday = dateStr === today;
          return (
            <button
              key={i}
              className={"mobile-day-pill" + (isToday ? " is-today" : "") + (activeDayIdx === i ? " active" : "")}
              onClick={() => scrollToDay(i)}
            >
              <span>{DAYS[i]}</span>
              <small>{fmtDateLabel(d).split(" ")[0]}</small>
            </button>
          );
        })}
      </div>

      {empty && <p className="muted-text" style={{ padding: "0 4px" }}>Add modules and set schedules in the "Modules" tab.</p>}
      <div className="week-grid">
        {weekDates.map((d, i) => {
          const dateStr = fmtDate(d);
          const occs = occurrencesByDate[dateStr] || [];
          return (
            <div key={i} id={`day-col-${i}`} className={"day-col" + (dateStr === today ? " is-today" : "")}>
              <div className="day-header"><span>{DAYS[i]}</span><span className="day-num">{fmtDateLabel(d)}</span></div>
              <div className="day-body">
                {occs.length === 0 && <div className="day-empty">– No Lectures Scheduled –</div>}
                {occs.map(({ module: mo, slot }) => {
                  const sess = sessionsByKey[mo.id + "|" + dateStr + "|" + slot.id];
                  const st = sess?.status ? STATUS[sess.status] : null;
                  const Icon = st ? st.icon : Circle;
                  const hasNotes = sess && ((sess.topics && sess.topics.length) || (sess.todos && sess.todos.length) || sess.note || sess.takeaways || sess.codeSnippet);
                  return (
                    <button key={slot.id} className={"occ-chip dot-" + mo.color + (st ? " " + st.cls : "")} onClick={() => onOpen(mo, slot, dateStr)}>
                      <Icon size={14} />
                      <span className="occ-name">{mo.name}</span>
                      {slot.start && <span className="occ-time"><Clock size={11} /> {slot.start}</span>}
                      {hasNotes && <StickyNote size={11} className="occ-note-flag" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModulesView({ modules, stats, gpaStats, onAddTemplate, onEdit, onAddCustom, onRemove }) {
  const [page, setPage] = useState(1);
  const MODULES_PER_PAGE = 6;
  const totalPages = Math.ceil(modules.length / MODULES_PER_PAGE) || 1;

  const paginatedModules = useMemo(() => {
    const start = (page - 1) * MODULES_PER_PAGE;
    return modules.slice(start, start + MODULES_PER_PAGE);
  }, [modules, page]);

  return (
    <div className="fadeInUp">
      <div className="week-toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 className="section-title">Enrolled Modules ({modules.length})</h2>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn ghost sm" onClick={onAddTemplate}><GraduationCap size={14} /> Import Curriculum</button>
          <button className="btn primary sm glow" onClick={onAddCustom}><Plus size={14} /> Add Module</button>
        </div>
      </div>

      {modules.length === 0 ? (
        <p className="muted-text">No modules added yet.</p>
      ) : (
        <div className="module-grid">
          {paginatedModules.map((mo) => (
            <div key={mo.id} className="card module-card glass-card">
              <div className="module-card-head">
                <span className={"dot dot-" + mo.color} />
                <div>
                  <div className="module-card-name">{mo.name}</div>
                  {mo.code && <div className="module-card-code">{mo.code} · {mo.credits || 3} Credits · Target: {mo.grade || "A"}</div>}
                </div>
                <div className="module-card-actions">
                  <button className="icon-btn" onClick={() => onEdit(mo)}><Pencil size={14} /></button>
                  <button className="icon-btn danger" onClick={() => onRemove(mo.id)}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="slot-list">
                {(mo.schedule || []).length === 0 && <span className="muted-text sm">No weekly slots scheduled</span>}
                {(mo.schedule || []).map((s) => (
                  <span key={s.id} className="slot-chip"><Clock size={11} /> {DAYS[s.day]} {s.start}{s.end ? "–" + s.end : ""}{s.venue ? " · " + s.venue : ""}</span>
                ))}
              </div>
              <div className="module-card-footer">
                <span className="muted-text sm">Attendance Target: {mo.threshold || 80}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SetupModal({ onClose, onApply, onSkip }) {
  const [degree, setDegree] = useState(null);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass-modal wide scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{degree ? `Select Semester for ${DEGREE_META[degree]?.short}` : "Select Your Degree Program"}</h3>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        {!degree ? (
          <div className="degree-grid">
            {Object.entries(DEGREE_META).filter(([k]) => k !== "CUSTOM").map(([k, v]) => {
              const IconComponent = v.icon || GraduationCap;
              return (
                <button key={k} className={"degree-card dot-" + v.color} onClick={() => setDegree(k)}>
                  <IconComponent size={24} />
                  <span>{v.short}</span>
                  <small>{v.name}</small>
                </button>
              );
            })}
            <button className="degree-card dot-amber" onClick={onSkip}>
              <Layers size={24} />
              <span>Custom</span>
              <small>Add modules manually</small>
            </button>
          </div>
        ) : (
          <div className="block-list">
            {CURRICULA[degree]?.map((b) => (
              <button key={b.id} className="block-row" onClick={() => onApply(degree, b.id)}>
                <span>{b.label}</span>
                <span className="muted-text sm">{b.modules.filter((m) => m.type === "C").length} core modules</span>
              </button>
            ))}
            <button className="btn ghost" style={{ marginTop: 12 }} onClick={() => setDegree(null)}>← Back to degree programs</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleEditModal({ module, existingColorCount, onClose, onSave }) {
  const [name, setName] = useState(module?.name || "");
  const [code, setCode] = useState(module?.code || "");
  const [credits, setCredits] = useState(module?.credits || 3);
  const [grade, setGrade] = useState(module?.grade || "A");
  const [color, setColor] = useState(module?.color || MODULE_COLORS[existingColorCount % MODULE_COLORS.length]);
  const [threshold, setThreshold] = useState(module?.threshold || 80);
  const [schedule, setSchedule] = useState(module?.schedule || []);
  const [error, setError] = useState("");

  function addSlot() {
    setSchedule((s) => [...s, { id: uid(), day: 0, start: "09:00", end: "", venue: "" }]);
  }
  function updateSlot(id, patch) {
    setSchedule((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function removeSlot(id) {
    setSchedule((s) => s.filter((x) => x.id !== id));
  }
  function save() {
    if (!name.trim()) { setError("Module name is required."); return; }
    onSave({ id: module?.id, name: name.trim(), code: code.trim(), credits: Number(credits) || 3, grade, color, threshold: Number(threshold) || 80, schedule });
    fireSwal({ title: "Module Saved!", text: `${name} has been configured.`, icon: "success" });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass-modal scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{module ? "Edit Module" : "Add New Module"}</h3>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="field"><label>Module Name</label><input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="e.g. Machine Learning" /></div>
        {error && <div className="field-error">{error}</div>}
        <div className="field-row">
          <div className="field"><label>Code (optional)</label><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CM3720" /></div>
          <div className="field"><label>Course Credits</label><input type="number" min="1" max="12" value={credits} onChange={(e) => setCredits(e.target.value)} /></div>
        </div>
        <div className="field-row">
          <div className="field"><label>Target Grade</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              {Object.keys(GRADE_SCALE).map((g) => <option key={g} value={g}>{g} ({GRADE_SCALE[g]} GPA)</option>)}
            </select>
          </div>
          <div className="field"><label>Attendance Target %</label><input type="number" min="0" max="100" value={threshold} onChange={(e) => setThreshold(e.target.value)} /></div>
        </div>
        <div className="field">
          <label>Color Theme</label>
          <div className="color-row">
            {MODULE_COLORS.map((c) => (
              <button key={c} className={"color-dot dot-" + c + (color === c ? " selected" : "")} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>
        <div className="field">
          <label>Weekly Schedule</label>
          {schedule.map((s) => (
            <div key={s.id} className="slot-edit-row">
              <select value={s.day} onChange={(e) => updateSlot(s.id, { day: Number(e.target.value) })}>
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
              <input type="time" value={s.start} onChange={(e) => updateSlot(s.id, { start: e.target.value })} />
              <input type="time" value={s.end} onChange={(e) => updateSlot(s.id, { end: e.target.value })} />
              <input placeholder="Venue" value={s.venue} onChange={(e) => updateSlot(s.id, { venue: e.target.value })} />
              <button className="icon-btn danger" onClick={() => removeSlot(s.id)}><Trash2 size={14} /></button>
            </div>
          ))}
          <button className="btn ghost sm" onClick={addSlot}><Plus size={13} /> Add Weekly Time Slot</button>
        </div>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary glow" onClick={save}><Check size={14} /> Save Module</button>
        </div>
      </div>
    </div>
  );
}

function DeadlineEditModal({ modules, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState(modules[0]?.id || "");
  const [dueDate, setDueDate] = useState(fmtDate(new Date()));
  const [type, setType] = useState("assignment");
  const [error, setError] = useState("");

  function save() {
    if (!title.trim() || !dueDate) { setError("Title and due date are required."); return; }
    onSave({ title: title.trim(), moduleId, dueDate, type });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass-modal scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h3>Add Exam / Deadline</h3><button className="icon-btn" onClick={onClose}><X size={16} /></button></div>
        <div className="field"><label>Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Midterm Exam / Assignment 1" /></div>
        {error && <div className="field-error">{error}</div>}
        <div className="field"><label>Module</label>
          <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            <option value="">General / None</option>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="field-row">
          <div className="field"><label>Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          <div className="field"><label>Category</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="exam">Exam / Test</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz / Lab</option>
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary glow" onClick={save}><Check size={14} /> Add Deadline</button>
        </div>
      </div>
    </div>
  );
}

function SessionModal({ info, existing, onClose, onSave, onDelete }) {
  const [status, setStatus] = useState(existing?.status || null);
  const [topics, setTopics] = useState(existing?.topics || []);
  const [topicInput, setTopicInput] = useState("");
  const [todos, setTodos] = useState(existing?.todos || []);
  const [todoInput, setTodoInput] = useState("");
  const [tags, setTags] = useState(existing?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [note, setNote] = useState(existing?.note || "");
  const [takeaways, setTakeaways] = useState(existing?.takeaways || "");
  const [codeSnippet, setCodeSnippet] = useState(existing?.codeSnippet || "");

  function addTopic() { if (topicInput.trim()) { setTopics((t) => [...t, topicInput.trim()]); setTopicInput(""); } }
  function addTodo() { if (todoInput.trim()) { setTodos((t) => [...t, { id: uid(), text: todoInput.trim(), done: false }]); setTodoInput(""); } }
  function addTag() { if (tagInput.trim()) { setTags((t) => [...t, tagInput.trim()]); setTagInput(""); } }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal wide glass-modal scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{info.moduleName}</h3>
            <small className="muted-text">{info.date} {info.time ? "· " + info.time : ""}</small>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="field">
          <label>Attendance Status</label>
          <div className="status-row">
            {Object.entries(STATUS).map(([key, v]) => {
              const Icon = v.icon;
              return (
                <button key={key} className={"status-btn " + v.cls + (status === key ? " selected" : "")} onClick={() => setStatus(status === key ? null : key)}>
                  <Icon size={16} /> {v.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="field">
          <label><Lightbulb size={13} /> Key Takeaways & Exam Tips</label>
          <input value={takeaways} onChange={(e) => setTakeaways(e.target.value)} placeholder="e.g. Important formula / Exam question covered" />
        </div>

        <div className="field">
          <label>Topics Covered</label>
          <div className="chip-list">{topics.map((t, i) => <span key={i} className="tag-chip">{t}<button onClick={() => setTopics(topics.filter((_, j) => j !== i))}><X size={11} /></button></span>)}</div>
          <div className="inline-add"><input value={topicInput} onChange={(e) => setTopicInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTopic()} placeholder="Add topic and press Enter" /><button className="btn ghost sm" onClick={addTopic}><Plus size={13} /></button></div>
        </div>

        <div className="field">
          <label>Action Items / Homework</label>
          <div className="todo-edit-list">
            {todos.map((t) => (
              <label key={t.id} className="todo-item">
                <input type="checkbox" checked={t.done} onChange={() => setTodos(todos.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))} />
                <span>{t.text}</span>
                <button className="icon-btn danger" onClick={() => setTodos(todos.filter((x) => x.id !== t.id))}><X size={12} /></button>
              </label>
            ))}
          </div>
          <div className="inline-add"><input value={todoInput} onChange={(e) => setTodoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} placeholder="Add action item and press Enter" /><button className="btn ghost sm" onClick={addTodo}><Plus size={13} /></button></div>
        </div>

        <div className="field">
          <label><Code size={13} /> Code Snippet / Key Formula</label>
          <textarea rows={2} value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)} placeholder="Paste code snippet or mathematical equation..." style={{ fontFamily: "'JetBrains Mono', monospace" }} />
        </div>

        <div className="field">
          <label>Lecture Notes</label>
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Lecture notes or quick summaries…" />
        </div>

        <div className="modal-actions">
          {existing && <button className="btn ghost danger" onClick={() => onDelete(existing.id)}><Trash2 size={14} /> Delete</button>}
          <div style={{ flex: 1 }} />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary glow" onClick={() => { onSave({ status, topics, todos, tags, note, takeaways, codeSnippet }); fireSwal({ title: "Saved!", text: "Lecture session updated.", icon: "success", timer: 1500, showConfirmButton: false }); }}><Check size={14} /> Save Session</button>
        </div>
      </div>
    </div>
  );
}

function OneOffModal({ modules, onClose, onAdd }) {
  const [moduleId, setModuleId] = useState(modules[0]?.id || "");
  const [date, setDate] = useState(fmtDate(new Date()));
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass-modal scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h3>Add One-Off Lecture</h3><button className="icon-btn" onClick={onClose}><X size={16} /></button></div>
        {modules.length === 0 ? <p className="muted-text">Please add a module first.</p> : (
          <>
            <div className="field"><label>Module</label>
              <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
                {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="field-row">
              <div className="field"><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div className="field"><label>Time (optional)</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
            </div>
            <div className="field"><label>Venue (optional)</label><input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Lab 3 / Room 101" /></div>
            {error && <div className="field-error">{error}</div>}
            <div className="modal-actions">
              <button className="btn ghost" onClick={onClose}>Cancel</button>
              <button className="btn primary glow" onClick={() => { if (!moduleId || !date) { setError("Module and Date are required."); return; } onAdd({ moduleId, date, time, venue }); fireSwal({ title: "Lecture Added!", text: "One-off session recorded.", icon: "success", timer: 1500, showConfirmButton: false }); }}><Check size={14} /> Add Lecture</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@500;600&display=swap');

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}
body { position: relative; overflow-x: hidden; overflow-y: auto; }

/* SweetAlert Custom Dark Styling */
.swal-dark-popup {
  border-radius: 20px !important;
  border: 1px solid rgba(124, 92, 255, 0.4) !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7) !important;
}

/* Micro Animation Keyframes */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes floatGlow {
  0%, 100% { transform: translateY(0); box-shadow: 0 0 15px rgba(124, 92, 255, 0.3); }
  50% { transform: translateY(-3px); box-shadow: 0 0 25px rgba(52, 229, 255, 0.5); }
}

@keyframes badgePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

.fadeInUp { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.float-glow { animation: floatGlow 3s ease-in-out infinite; }

.app {
  position: relative;
  min-height: 100vh;
  width: 100%;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding-bottom: 60px;
  transition: background 0.4s ease, color 0.4s ease;
}

/* Theme 1: Cyberpunk Dark */
.app.theme-cyberpunk {
  background: #060814;
  color: #e2e8f0;
}
.theme-cyberpunk .bg {
  position: fixed; inset: 0; z-index: -1;
  background:
    radial-gradient(circle at 12% 12%, rgba(124, 92, 255, 0.22), transparent 45%),
    radial-gradient(circle at 88% 8%, rgba(52, 229, 255, 0.18), transparent 45%),
    radial-gradient(circle at 50% 90%, rgba(255, 92, 141, 0.14), transparent 50%),
    #060814;
}

/* Theme 2: Midnight Blue */
.app.theme-midnight {
  background: #0b132b;
  color: #e0e6ed;
}
.theme-midnight .bg {
  position: fixed; inset: 0; z-index: -1;
  background:
    radial-gradient(circle at 20% 20%, rgba(28, 37, 65, 0.8), transparent 50%),
    radial-gradient(circle at 80% 10%, rgba(72, 149, 239, 0.15), transparent 45%),
    #0b132b;
}

/* Theme 3: Perfect High-Contrast Light Academic Mode */
.app.theme-light {
  background: #f1f5f9;
  color: #0f172a;
}
.theme-light .bg {
  position: fixed; inset: 0; z-index: -1;
  background:
    radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.12), transparent 45%),
    radial-gradient(circle at 85% 10%, rgba(14, 165, 233, 0.12), transparent 45%),
    #f1f5f9;
}
.theme-light .header {
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid #cbd5e1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}
.theme-light .brand { color: #0f172a; }
.theme-light .pro-badge {
  background: #e0f2fe;
  border-color: #0284c7;
  color: #0284c7;
  font-weight: 700;
}
.theme-light .navtabs {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
}
.theme-light .tab {
  color: #334155;
  font-weight: 600;
}
.theme-light .tab:hover {
  color: #0f172a;
  background: #e2e8f0;
}
.theme-light .tab.active {
  background: linear-gradient(135deg, #4f46e5, #0284c7);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.theme-light .theme-toggle {
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
}
.theme-light .theme-btn { color: #475569; }
.theme-light .theme-btn.active {
  background: #ffffff;
  color: #4f46e5;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.theme-light .history-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
}
.theme-light .history-btn:hover:not(:disabled) {
  background: #eef2ff;
  border-color: #6366f1;
  color: #4f46e5;
}
.theme-light .history-btn.glow-border {
  border-color: #0284c7;
  color: #0284c7;
  background: #f0f9ff;
}

.theme-light .section-title {
  color: #0f172a;
  font-weight: 700;
}

.theme-light .glass-card {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02);
}
.theme-light .glass-card:hover {
  border-color: #94a3b8;
}

.theme-light .hero-banner {
  background: linear-gradient(135deg, #e0e7ff 0%, #cff4fc 100%), #ffffff;
  border: 1px solid #a5b4fc;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.12);
}
.theme-light .hero-badge {
  background: rgba(79, 70, 229, 0.12);
  border-color: rgba(79, 70, 229, 0.3);
  color: #4338ca;
  font-weight: 700;
}
.theme-light .hero-title { color: #0f172a; }
.theme-light .hero-subtitle { color: #334155; font-weight: 500; }
.theme-light .hero-stat-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #cbd5e1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.theme-light .hstat-value { color: #0f172a; }
.theme-light .hstat-label { color: #475569; }

.theme-light .card-title { color: #0f172a; font-weight: 700; }
.theme-light .muted-text { color: #475569; }
.theme-light .muted-text.sm { color: #64748b; }

.theme-light .ring-bg { stroke: #e2e8f0; }
.theme-light .ring-value { color: #0f172a; }
.theme-light .ring-label { color: #475569; font-weight: 600; }

.theme-light .stat-chip {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
}
.theme-light .stat-chip span { color: #0f172a; }
.theme-light .stat-chip small { color: #475569; font-weight: 600; }

.theme-light .module-stat-name { color: #0f172a; font-weight: 600; }
.theme-light .module-stat-pct { color: #0f172a; }
.theme-light .progress-outer { background: #e2e8f0; }

.theme-light .module-card-name { color: #0f172a; font-weight: 700; }
.theme-light .module-card-code { color: #475569; font-weight: 600; }
.theme-light .slot-chip {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  font-weight: 500;
}

.theme-light .todo-item { color: #0f172a; font-weight: 500; }
.theme-light .todo-item small { color: #64748b; font-weight: 600; }

.theme-light .search-box {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
}
.theme-light .search-box input { color: #0f172a; font-weight: 500; }
.theme-light .search-box input::placeholder { color: #94a3b8; }

.theme-light .note-card {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.theme-light .note-card:hover {
  border-color: #6366f1;
  background: #faf5ff;
}
.theme-light .note-head { color: #0f172a; }
.theme-light .note-date { color: #64748b; font-weight: 600; }
.theme-light .note-topics { color: #1e293b; }
.theme-light .note-text { color: #334155; }
.theme-light .tag-chip {
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  color: #4338ca;
  font-weight: 600;
}

.theme-light .day-col {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}
.theme-light .day-col.is-today {
  background: #f0f9ff;
  border-color: #0284c7;
  box-shadow: 0 0 15px rgba(2, 132, 199, 0.15);
}
.theme-light .day-header { color: #475569; }
.theme-light .day-header span:first-child { color: #0f172a; font-weight: 700; }
.theme-light .occ-chip {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}
.theme-light .occ-chip:hover { border-color: #6366f1; background: #ffffff; }

.theme-light .btn.ghost {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}
.theme-light .btn.ghost:hover {
  background: #e2e8f0;
}
.theme-light .icon-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #1e293b;
}
.theme-light .icon-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.theme-light .pagination {
  background: #ffffff;
  border: 1px solid #cbd5e1;
}
.theme-light .page-btn { color: #1e293b; }
.theme-light .page-btn:hover:not(:disabled) { background: #f1f5f9; }
.theme-light .page-info { color: #475569; font-weight: 600; }

.theme-light input, .theme-light select, .theme-light textarea {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  font-weight: 500;
}
.theme-light input:focus, .theme-light select:focus, .theme-light textarea:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.theme-light .glass-modal {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
}
.theme-light .modal-head h3 { color: #0f172a; font-weight: 700; }
.theme-light .field label { color: #334155; font-weight: 700; }

.theme-light .degree-card {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}
.theme-light .degree-card:hover {
  background: #eef2ff;
  border-color: #6366f1;
}
.theme-light .degree-card span { color: #0f172a; }
.theme-light .degree-card small { color: #475569; }

.theme-light .block-row {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  font-weight: 600;
}
.theme-light .block-row:hover {
  background: #eef2ff;
  border-color: #6366f1;
}

.theme-light .status-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  font-weight: 600;
}

.theme-light .mobile-drawer {
  background: #ffffff;
  border-right-color: #cbd5e1;
  color: #0f172a;
}
.theme-light .drawer-nav-item {
  color: #334155;
}
.theme-light .drawer-nav-item:hover, .theme-light .drawer-nav-item.active {
  background: #eef2ff;
  color: #4f46e5;
}
.theme-light .drawer-divider { background: #e2e8f0; }
.theme-light .drawer-theme-btn {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}
.theme-light .drawer-theme-btn.active {
  background: #e0e7ff;
  border-color: #6366f1;
  color: #4338ca;
}
.theme-light .drawer-action-btn {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

.theme-light .badge-item.earned { background: #f0fdf4; border-color: #86efac; color: #166534; }
.theme-light .badge-item.locked { background: #f8fafc; border-color: #e2e8f0; color: #94a3b8; }
.theme-light .takeaways-box { background: #fefce8; border-color: #fef08a; color: #854d0e; }
.theme-light .code-box { background: #0f172a; color: #38bdf8; }

.loading {
  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 16px; color: #94a3b8; font-size: 15px;
}
.spin { animation: spin 1s linear infinite; color: #7c5cff; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Header Navigation - Full Screen Width Single Row */
/* Header Navigation - Responsive Multi-Group Toolbar */
.header {
  display: flex; align-items: center; justify-content: space-between; padding: 10px 24px; width: 100%; gap: 12px;
  background: rgba(10, 13, 28, 0.94); border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px); position: sticky; top: 0; z-index: 40; transition: all 0.3s ease; flex-wrap: wrap;
}

.brand { display: flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: #ffffff; flex-shrink: 0; }
.logo-icon {
  width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, #7c5cff, #34e5ff);
  display: flex; align-items: center; justify-content: center; color: #060814; box-shadow: 0 0 14px rgba(124, 92, 255, 0.45);
  transition: transform 0.3s ease;
}
.brand:hover .logo-icon { transform: rotate(10deg) scale(1.05); }

.pro-badge {
  font-size: 9.5px; font-family: 'JetBrains Mono', monospace; background: rgba(52, 229, 255, 0.15);
  border: 1px solid rgba(52, 229, 255, 0.4); color: #34e5ff; padding: 1px 5px; border-radius: 5px; vertical-align: middle;
}

.navtabs { display: flex; gap: 3px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); padding: 3px; border-radius: 12px; flex-shrink: 1; overflow-x: auto; }
.tab {
  display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 9px; border: none;
  background: transparent; color: #94a3b8; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); white-space: nowrap;
}
.tab:hover { color: #ffffff; background: rgba(255, 255, 255, 0.05); transform: translateY(-1px); }
.tab.active { background: linear-gradient(135deg, #7c5cff, #34e5ff); color: #060814; box-shadow: 0 3px 12px rgba(124, 92, 255, 0.35); }

.undo-redo-toolbar { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.history-group, .action-group { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }

.mobile-menu-trigger { display: none; }

.theme-toggle { display: flex; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 9px; padding: 2px; flex-shrink: 0; }
.theme-btn { background: none; border: none; color: #94a3b8; padding: 4px 7px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.theme-btn:hover { color: #ffffff; transform: scale(1.1); }
.theme-btn.active { background: rgba(124, 92, 255, 0.3); color: #34e5ff; }

.history-btn {
  display: inline-flex; align-items: center; gap: 4px; background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1); color: #cbd5e1; padding: 5px 9px; border-radius: 9px;
  font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); white-space: nowrap; flex-shrink: 0;
}
.history-btn:hover:not(:disabled) { background: rgba(124, 92, 255, 0.18); border-color: rgba(124, 92, 255, 0.4); color: #ffffff; transform: translateY(-1px); }
.history-btn:active:not(:disabled) { transform: scale(0.96); }
.history-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.history-btn.glow-border { border-color: rgba(52, 229, 255, 0.4); color: #34e5ff; }
.history-btn.danger { background: rgba(255, 92, 141, 0.12); border-color: rgba(255, 92, 141, 0.3); color: #ff5c8d; }
.history-btn.danger:hover:not(:disabled) { background: rgba(255, 92, 141, 0.25); border-color: rgba(255, 92, 141, 0.6); color: #ffffff; }
.history-count { background: rgba(124, 92, 255, 0.3); color: #d8b4fe; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; padding: 1px 4px; border-radius: 8px; }

/* Mobile Slide-Out Side Navigation Drawer */
.mobile-drawer-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
  z-index: 99; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
}
.mobile-drawer-overlay.open { opacity: 1; pointer-events: auto; }

.mobile-drawer {
  position: absolute; top: 0; left: 0; bottom: 0; width: 280px; max-width: 82vw;
  background: #090c1e; border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex; flex-direction: column; padding: 20px; transform: translateX(-100%);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 10px 0 40px rgba(0, 0, 0, 0.6);
  overflow-y: auto;
}
.mobile-drawer-overlay.open .mobile-drawer { transform: translateX(0); }

.drawer-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.drawer-body { display: flex; flex-direction: column; gap: 10px; }
.drawer-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin: 8px 0 4px; }
.drawer-nav-item {
  display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px; border-radius: 12px;
  background: transparent; border: none; color: #cbd5e1; font-size: 14px; font-weight: 600; cursor: pointer; text-align: left; transition: all 0.25s ease;
}
.drawer-nav-item:hover, .drawer-nav-item.active { background: linear-gradient(135deg, rgba(124, 92, 255, 0.25), rgba(52, 229, 255, 0.15)); color: #34e5ff; transform: translateX(4px); }
.drawer-divider { height: 1px; background: rgba(255, 255, 255, 0.08); margin: 12px 0; }

.drawer-theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.drawer-theme-btn {
  display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: #cbd5e1; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
}
.drawer-theme-btn:hover { transform: translateY(-2px); }
.drawer-theme-btn.active { background: rgba(124, 92, 255, 0.25); border-color: rgba(124, 92, 255, 0.5); color: #34e5ff; }

.drawer-actions-grid { display: flex; flex-direction: column; gap: 8px; }
.drawer-action-btn {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #e2e8f0; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
}
.drawer-action-btn:hover { transform: translateY(-1px); }
.drawer-action-btn.primary { background: linear-gradient(135deg, #7c5cff, #34e5ff); color: #060814; font-weight: 700; }

/* Achievement Badge Bar */
.badge-bar { margin-bottom: 20px; width: 100%; }
.badge-title { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; color: #ffffff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.badge-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.badge-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 16px; border: 1px solid; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.badge-item.earned { background: rgba(45, 212, 191, 0.12); border-color: rgba(45, 212, 191, 0.3); color: #2dd4bf; animation: badgePulse 2s ease-in-out infinite; }
.badge-item.earned:hover { transform: translateY(-3px) scale(1.02); }
.badge-item.locked { background: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.06); opacity: 0.4; }
.badge-icon { width: 34px; height: 34px; border-radius: 10px; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.badge-name { font-size: 13px; font-weight: 700; }
.badge-desc { font-size: 10px; opacity: 0.8; }

/* Analytics View Styles */
.analytics-wrapper { padding-top: 10px; width: 100%; }
.bar-chart-container { display: flex; flex-direction: column; gap: 14px; margin-top: 14px; }
.chart-bar-row { display: grid; grid-template-columns: 120px 1fr 50px; align-items: center; gap: 12px; font-size: 13px; }
.chart-bar-label { font-family: 'JetBrains Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chart-bar-track { height: 14px; border-radius: 8px; background: rgba(255, 255, 255, 0.07); overflow: hidden; }
.chart-bar-fill { height: 100%; border-radius: 8px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.chart-bar-val { font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: right; }

.sim-result-box { margin-top: 16px; padding: 16px; border-radius: 16px; border: 1px solid; text-align: center; transition: all 0.3s ease; }
.sim-result-box.safe { background: rgba(45, 212, 191, 0.12); border-color: rgba(45, 212, 191, 0.4); color: #2dd4bf; }
.sim-result-box.danger { background: rgba(255, 92, 141, 0.12); border-color: rgba(255, 92, 141, 0.4); color: #ff5c8d; }
.sim-res-val { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.sim-res-status { font-size: 13px; font-weight: 600; }

.takeaways-box { display: flex; align-items: center; gap: 8px; background: rgba(245, 197, 66, 0.15); border: 1px solid rgba(245, 197, 66, 0.3); color: #f5c542; padding: 8px 12px; border-radius: 10px; font-size: 12px; margin: 8px 0; }
.code-box { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 10px; color: #34e5ff; font-family: 'JetBrains Mono', monospace; font-size: 11px; overflow-x: auto; margin: 8px 0; }

.toast-banner {
  position: fixed; bottom: 24px; right: 24px; z-index: 100; display: flex; align-items: center; gap: 8px;
  background: rgba(10, 13, 28, 0.95); border: 1px solid rgba(124, 92, 255, 0.5); color: #34e5ff;
  padding: 11px 20px; border-radius: 14px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* Centered Max-Width Container for Widescreen Displays */
.container { width: 100%; max-width: 1440px; margin: 0 auto !important; padding: 24px 32px 40px; }
.margin-bottom { margin-bottom: 24px; }
.margin-top { margin-top: 18px; }

/* Hero Cover Banner - Edge to Edge Full Width */
.hero-banner {
  position: relative; overflow: hidden; border-radius: 20px; padding: 32px 28px; margin-bottom: 20px; width: 100%;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;
  background: linear-gradient(135deg, rgba(124, 92, 255, 0.3), rgba(52, 229, 255, 0.18)), #0c0f24;
  border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}
.hero-banner:hover { transform: translateY(-2px); box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5); }
.hero-cover-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: 0.28; mix-blend-mode: overlay; pointer-events: none;
}
.hero-mesh-art {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image: radial-gradient(rgba(124, 92, 255, 0.4) 1px, transparent 1px), radial-gradient(rgba(52, 229, 255, 0.3) 1px, transparent 1px);
  background-size: 24px 24px; background-position: 0 0, 12px 12px;
}
.hero-overlay { position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(52, 229, 255, 0.15), transparent 60%); pointer-events: none; }
.hero-content { position: relative; z-index: 2; max-width: 680px; }
.hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(124, 92, 255, 0.2); border: 1px solid rgba(124, 92, 255, 0.4); color: #d8b4fe; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
.hero-title { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: #ffffff; margin: 0 0 10px; letter-spacing: -0.5px; line-height: 1.2; }
.hero-subtitle { font-size: 15px; color: #cbd5e1; margin: 0 0 22px; line-height: 1.55; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

.hero-stats { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 12px; min-width: 250px; }
.hero-stat-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(16px); border-radius: 18px; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.hero-stat-card:hover { transform: translateY(-2px) scale(1.02); border-color: rgba(124, 92, 255, 0.4); background: rgba(255, 255, 255, 0.08); }
.hstat-value { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: #ffffff; }
.hstat-label { display: flex; align-items: center; gap: 5px; color: #94a3b8; font-size: 12px; font-weight: 600; }

.glass-card { background: rgba(255, 255, 255, 0.035); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 22px; padding: 24px; backdrop-filter: blur(24px); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease; }
.glass-card:hover { border-color: rgba(124, 92, 255, 0.3); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); }

.card.wide { grid-column: 1 / -1; }
.card-title { display: flex; align-items: center; gap: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 18px; }
.card-title-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
.card-title-row .card-title { margin: 0; }
.header-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

/* Dashboard Grid - Full Width 2-Column Responsive Layout */
.dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 480px), 1fr)); gap: 24px; width: 100%; }

/* Mobile Media Queries - Touch Optimized for Mobile Browsers */
@media (max-width: 768px) {
  .header { padding: 10px 14px; gap: 8px; }
  .brand { font-size: 16px; gap: 8px; }
  .logo-icon { width: 30px; height: 30px; border-radius: 8px; }
  .pro-badge { font-size: 9px; padding: 1px 4px; }
  .desktop-nav { display: none !important; }
  .mobile-menu-trigger { display: flex !important; }

  .container { padding: 14px 12px 36px; }
  .dash-grid { grid-template-columns: 1fr; gap: 14px; }

  .hero-banner { padding: 20px 16px; gap: 14px; border-radius: 16px; }
  .hero-title { font-size: 20px; margin-bottom: 6px; }
  .hero-subtitle { font-size: 12.5px; margin-bottom: 14px; line-height: 1.45; }
  .hero-actions { width: 100%; flex-direction: column; gap: 8px; }
  .hero-actions .btn { width: 100%; justify-content: center; padding: 10px 14px; font-size: 13px; }

  .hero-stats { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; min-width: auto; }
  .hero-stat-card { flex-direction: column; text-align: center; padding: 8px 4px; gap: 3px; border-radius: 12px; }
  .hstat-value { font-size: 16px; }
  .hstat-label { font-size: 9.5px; justify-content: center; gap: 3px; }

  .badge-bar { margin-bottom: 16px; padding: 16px 14px; }
  .badge-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .badge-item { padding: 8px 10px; gap: 8px; border-radius: 12px; }
  .badge-icon { width: 28px; height: 28px; border-radius: 8px; }
  .badge-name { font-size: 11.5px; }
  .badge-desc { font-size: 9px; }

  .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 10px; }
  .stat-chip { padding: 6px 4px; gap: 3px; border-radius: 10px; flex-direction: column; }
  .stat-chip span { font-size: 14px; }
  .stat-chip small { font-size: 10px; }

  .ring-wrap, .ring-svg { width: 130px; height: 130px; }
  .ring-value { font-size: 28px; }

  /* Mobile Day Selector Bar & Full-Width Vertical Cards */
  .mobile-day-strip {
    display: flex;
    gap: 6px;
    margin-bottom: 14px;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  .mobile-day-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 8px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #cbd5e1;
    font-size: 11px;
    cursor: pointer;
    flex: 1;
    min-width: 42px;
    transition: all 0.2s ease;
  }
  .mobile-day-pill span { font-weight: 700; }
  .mobile-day-pill small { font-size: 9px; opacity: 0.8; }
  .mobile-day-pill.is-today { border-color: rgba(124, 92, 255, 0.5); color: #34e5ff; }
  .mobile-day-pill.active { background: linear-gradient(135deg, #7c5cff, #34e5ff); color: #060814; border-color: transparent; }

  .week-toolbar { flex-direction: column; align-items: stretch; gap: 10px; margin: 12px 0 14px; }
  .week-nav { justify-content: space-between; width: 100%; }
  .week-label { font-size: 14px; min-width: auto; }
  .week-toolbar .btn { width: 100%; justify-content: center; }

  .week-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    width: 100% !important;
  }
  .day-col {
    width: 100% !important;
    min-width: 100% !important;
    flex: 1 1 100% !important;
    min-height: auto !important;
    padding: 14px 16px !important;
  }

  .chart-bar-row { grid-template-columns: 85px 1fr 40px; font-size: 11px; gap: 8px; }
  .module-grid { grid-template-columns: 1fr; gap: 14px; }
  .deadline-grid { grid-template-columns: 1fr; gap: 12px; }
}

@media (max-width: 500px) {
  .degree-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
  .degree-card { padding: 14px 8px; }
  .degree-card span { font-size: 13px; }
  .degree-card small { font-size: 10px; }
  .toast-banner { left: 10px; right: 10px; bottom: 10px; justify-content: center; text-align: center; font-size: 12px; padding: 9px 14px; }
  .glass-modal { padding: 16px 12px; border-radius: 18px; max-width: 95vw; }
  .slot-edit-row { grid-template-columns: 1fr 1fr; gap: 6px; }
  .slot-edit-row button { grid-column: 1 / -1; justify-self: flex-end; }
  .field-row { grid-template-columns: 1fr; gap: 10px; }
}

/* Pagination Controls */
.pagination { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 4px 8px; }
.page-btn { background: none; border: none; color: #cbd5e1; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
.page-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: #ffffff; transform: scale(1.1); }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-info { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8; }

/* Ring Meter */
.ring-card { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.ring-wrap { position: relative; width: 150px; height: 150px; }
.ring-svg { width: 150px; height: 150px; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: rgba(255, 255, 255, 0.07); stroke-width: 10; }
.ring-fg { fill: none; stroke: url(#ringGradient); stroke-width: 10; stroke-linecap: round; transition: stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.ring-fg.danger { stroke: #ff5c8d; }
.ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-value { font-family: 'JetBrains Mono', monospace; font-size: 34px; font-weight: 700; color: #ffffff; }
.stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  margin-top: 14px;
}

.stat-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 8px 12px;
  text-align: center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.stat-chip:hover {
  background: rgba(124, 92, 255, 0.12);
  border-color: rgba(124, 92, 255, 0.3);
  transform: translateY(-2px);
}
.stat-chip span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}
.stat-chip small {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

/* Bunk Badge & Module Stats */
.module-stat-list { display: flex; flex-direction: column; gap: 16px; }
.module-stat-row { display: grid; grid-template-columns: 12px 1fr 45px; align-items: center; gap: 10px; position: relative; transition: transform 0.2s ease; }
.module-stat-row:hover { transform: translateX(3px); }
.module-stat-name { font-size: 13px; font-weight: 600; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bunk-badge { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 6px; display: inline-block; margin-top: 2px; transition: transform 0.2s; }
.bunk-badge:hover { transform: scale(1.05); }
.bunk-badge.safe { background: rgba(45, 212, 191, 0.15); border: 1px solid rgba(45, 212, 191, 0.3); color: #2dd4bf; }
.bunk-badge.danger { background: rgba(255, 92, 141, 0.15); border: 1px solid rgba(255, 92, 141, 0.3); color: #ff5c8d; }

.module-stat-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; text-align: right; color: #cbd5e1; }
.module-stat-row .progress-outer { grid-column: 1 / -1; }
.warn-icon { position: absolute; right: -20px; top: 2px; color: #f5c542; }

.progress-outer { height: 7px; border-radius: 6px; background: rgba(255, 255, 255, 0.07); overflow: hidden; }
.progress-inner { height: 100%; background: linear-gradient(90deg, #34e5ff, #7c5cff); border-radius: 6px; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.progress-inner.warn { background: linear-gradient(90deg, #f5c542, #ff5c8d); }

.todo-list { display: flex; flex-direction: column; gap: 10px; min-height: 180px; }
.todo-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #cbd5e1; position: relative; padding-right: 20px; transition: transform 0.2s ease; }
.todo-item:hover { transform: translateX(3px); }
.todo-item input { accent-color: #7c5cff; width: 16px; height: 16px; cursor: pointer; flex-shrink: 0; transition: transform 0.2s ease; }
.todo-item input:hover { transform: scale(1.15); }
.todo-item small { position: absolute; right: 0; top: 2px; color: #64748b; font-size: 10px; }

.muted-text { color: #94a3b8; font-size: 13px; }
.muted-text.sm { font-size: 11px; }

.search-box { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 7px 12px; color: #94a3b8; width: 100%; max-width: 240px; transition: all 0.25s ease; }
.search-box:focus-within { border-color: rgba(124, 92, 255, 0.5); box-shadow: 0 0 12px rgba(124, 92, 255, 0.2); }
.search-box input { background: none; border: none; outline: none; color: #ffffff; font-size: 13px; width: 100%; }

.notes-feed { display: flex; flex-direction: column; gap: 12px; min-height: 220px; }
.note-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 14px 16px; cursor: pointer; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.note-card:hover { border-color: rgba(124, 92, 255, 0.4); transform: translateY(-3px) scale(1.01); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.note-head { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #ffffff; margin-bottom: 6px; }
.note-date { margin-left: auto; color: #94a3b8; font-size: 11px; font-family: 'JetBrains Mono', monospace; }
.note-topics { margin: 6px 0; padding-left: 18px; font-size: 12px; color: #cbd5e1; }
.note-text { font-size: 13px; color: #cbd5e1; margin: 6px 0; line-height: 1.4; }

.tag-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.tag-chip { display: inline-flex; align-items: center; gap: 4px; background: rgba(124, 92, 255, 0.15); border: 1px solid rgba(124, 92, 255, 0.3); color: #d8b4fe; font-size: 11px; padding: 3px 9px; border-radius: 20px; transition: transform 0.2s ease; }
.tag-chip:hover { transform: translateY(-1px); }
.tag-chip button { background: none; border: none; color: #d8b4fe; display: flex; cursor: pointer; padding: 0; }

/* Deadlines Tab */
.deadline-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 18px; margin-top: 14px; width: 100%; }
.deadline-card { position: relative; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.deadline-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
.deadline-card.is-done { opacity: 0.5; }
.deadline-card.is-overdue { border-color: rgba(255, 92, 141, 0.6); }
.deadline-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.type-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 7px; border-radius: 6px; }
.type-badge.exam { background: rgba(255, 92, 141, 0.2); color: #ff5c8d; border: 1px solid rgba(255, 92, 141, 0.4); }
.type-badge.assignment { background: rgba(52, 229, 255, 0.2); color: #34e5ff; border: 1px solid rgba(52, 229, 255, 0.4); }
.type-badge.quiz { background: rgba(245, 197, 66, 0.2); color: #f5c542; border: 1px solid rgba(245, 197, 66, 0.4); }
.deadline-title { font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 6px; }
.deadline-module { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
.deadline-footer { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #cbd5e1; }

.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; transition: transform 0.2s ease; }
.dot-violet { background: #9b8cff; box-shadow: 0 0 8px rgba(155, 140, 255, 0.5); }
.dot-teal { background: #2dd4bf; box-shadow: 0 0 8px rgba(45, 212, 191, 0.5); }
.dot-coral { background: #ff8a65; box-shadow: 0 0 8px rgba(255, 138, 101, 0.5); }
.dot-amber { background: #f5c542; box-shadow: 0 0 8px rgba(245, 197, 66, 0.5); }
.dot-sky { background: #4fc3f7; box-shadow: 0 0 8px rgba(79, 195, 247, 0.5); }
.dot-rose { background: #f06292; box-shadow: 0 0 8px rgba(240, 98, 146, 0.5); }
.dot-lime { background: #aed581; box-shadow: 0 0 8px rgba(174, 213, 129, 0.5); }
.dot-indigo { background: #7986cb; box-shadow: 0 0 8px rgba(121, 134, 203, 0.5); }

.empty-hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; padding: 70px 20px; color: #94a3b8; }
.hero-icon { width: 64px; height: 64px; border-radius: 20px; background: rgba(124, 92, 255, 0.15); border: 1px solid rgba(124, 92, 255, 0.3); display: flex; align-items: center; justify-content: center; color: #7c5cff; }
.empty-hero h2 { color: #ffffff; font-family: 'Space Grotesk', sans-serif; font-size: 20px; margin: 4px 0 0; }

.btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 12px; padding: 10px 18px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); font-family: inherit; }
.btn:active { transform: scale(0.96); }
.btn.primary { background: linear-gradient(135deg, #7c5cff, #34e5ff); color: #060814; }
.btn.primary.glow { box-shadow: 0 0 20px rgba(124, 92, 255, 0.4); }
.btn.primary.glow:hover { box-shadow: 0 0 28px rgba(124, 92, 255, 0.65); transform: translateY(-2px); }
.btn.ghost { background: rgba(255, 255, 255, 0.05); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.1); }
.btn.ghost:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-1px); }
.btn.ghost.danger { color: #ff8a8a; border-color: rgba(255, 107, 107, 0.3); }
.btn.sm { padding: 7px 14px; font-size: 12px; }

.icon-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.09); color: #cbd5e1; border-radius: 10px; padding: 7px; display: flex; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); flex-shrink: 0; }
.icon-btn:hover { background: rgba(255, 255, 255, 0.14); color: #ffffff; transform: scale(1.08); }
.icon-btn:active { transform: scale(0.95); }
.icon-btn.danger:hover { color: #ff8a8a; background: rgba(255, 107, 107, 0.15); }

.week-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin: 18px 0 18px; width: 100%; }
.week-nav { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.week-label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: #ffffff; font-size: 16px; min-width: 150px; }
.section-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; color: #ffffff; margin: 0; }

.week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; width: 100%; }

.day-col { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 16px; padding: 14px 12px; min-height: 160px; transition: all 0.25s ease; }
.day-col.is-today { border-color: rgba(124, 92, 255, 0.6); background: rgba(124, 92, 255, 0.08); box-shadow: inset 0 0 20px rgba(124, 92, 255, 0.15); }
.day-header { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; margin-bottom: 10px; font-weight: 500; }
.day-header span:first-child { color: #ffffff; font-weight: 700; }
.day-body { display: flex; flex-direction: column; gap: 8px; }
.day-empty { color: #475569; font-size: 12px; text-align: center; padding: 12px 0; }

.occ-chip { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 10px; padding: 8px 10px; font-size: 11px; color: #e2e8f0; cursor: pointer; text-align: left; width: 100%; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.occ-chip:hover { border-color: rgba(255, 255, 255, 0.3); transform: translateY(-2px) scale(1.02); box-shadow: 0 4px 12px rgba(0,0,0,0.25); }
.occ-name { flex: 1; min-width: 60px; font-weight: 500; }
.occ-time { display: flex; align-items: center; gap: 3px; color: #94a3b8; font-size: 10px; }
.occ-note-flag { color: #34e5ff; }
.occ-chip.st-present { border-color: rgba(45, 212, 191, 0.5); background: rgba(45, 212, 191, 0.12); color: #5eead4; }
.occ-chip.st-absent { border-color: rgba(255, 107, 107, 0.5); background: rgba(255, 107, 107, 0.12); color: #fca5a5; }
.occ-chip.st-cancelled { border-color: rgba(255, 255, 255, 0.15); opacity: 0.6; }

.module-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 20px; width: 100%; }
.module-card-head { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
.module-card-name { font-size: 15px; color: #ffffff; font-weight: 600; }
.module-card-code { font-size: 11px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
.module-card-actions { margin-left: auto; display: flex; gap: 6px; }

.slot-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.slot-chip { display: inline-flex; align-items: center; gap: 4px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #cbd5e1; padding: 4px 9px; border-radius: 8px; transition: transform 0.2s ease; }
.slot-chip:hover { transform: translateY(-1px); }

/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(3, 4, 12, 0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 60; padding: 16px; transition: opacity 0.3s ease; }
.glass-modal { background: #0c0e1f; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; padding: 26px; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6); }
.modal.wide { max-width: 580px; }
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.modal-head h3 { font-family: 'Space Grotesk', sans-serif; color: #ffffff; margin: 0; font-size: 18px; }

.field { margin-bottom: 18px; }
.field label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field-error { color: #ff8a8a; font-size: 12px; margin: -10px 0 12px; }

input, select, textarea { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 10px 14px; color: #ffffff; font-size: 13px; font-family: inherit; outline: none; transition: all 0.25s ease; }
input:focus, select:focus, textarea:focus { border-color: #7c5cff; box-shadow: 0 0 14px rgba(124, 92, 255, 0.35); }

.color-row { display: flex; gap: 10px; flex-wrap: wrap; }
.color-dot { width: 26px; height: 26px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.color-dot:hover { transform: scale(1.2); }
.color-dot.selected { border-color: #ffffff; transform: scale(1.25); }

.slot-edit-row { display: grid; grid-template-columns: 75px 80px 80px 1fr 32px; gap: 6px; margin-bottom: 8px; align-items: center; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; flex-wrap: wrap; }

.degree-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.degree-card { display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 18px; padding: 22px 14px; color: #ffffff; cursor: pointer; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.degree-card span { font-weight: 600; font-size: 15px; }
.degree-card small { color: #94a3b8; font-size: 11px; text-align: center; }
.degree-card:hover { border-color: rgba(124, 92, 255, 0.5); transform: translateY(-4px) scale(1.02); box-shadow: 0 10px 25px rgba(0,0,0,0.3); }

.block-list { display: flex; flex-direction: column; gap: 10px; }
.block-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 14px; padding: 14px 16px; color: #ffffff; font-size: 14px; cursor: pointer; text-align: left; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.block-row:hover { border-color: rgba(124, 92, 255, 0.5); transform: translateX(6px); background: rgba(124, 92, 255, 0.1); }

.status-row { display: flex; gap: 10px; flex-wrap: wrap; }
.status-btn { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 10px 16px; color: #cbd5e1; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.status-btn:hover { transform: translateY(-1px); }
.status-btn.st-present.selected { background: rgba(45, 212, 191, 0.2); border-color: #2dd4bf; color: #2dd4bf; }
.status-btn.st-absent.selected { background: rgba(255, 107, 107, 0.2); border-color: #ff6b6b; color: #ff8a8a; }
.status-btn.st-cancelled.selected { background: rgba(255, 255, 255, 0.15); border-color: #ffffff; color: #ffffff; }

.chip-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.inline-add { display: flex; gap: 8px; }
.todo-edit-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
.todo-edit-list .todo-item { padding-right: 0; }
.todo-edit-list .todo-item span { flex: 1; }
`;
