import portrait from "@/assets/portrait.jpg";
import appPulse from "@/assets/app-pulse.jpg";
import appLedger from "@/assets/app-ledger.jpg";
import appStill from "@/assets/app-still.jpg";
import design1 from "@/assets/design-1.jpg";
import design2 from "@/assets/design-2.jpg";
import design3 from "@/assets/design-3.jpg";

export const profile = {
  name: "Nour Eldein Ahmed",
  handle: "@noureldein",
  location: "Mansoura, EG · Remote",
  email: "hello@noureldein.dev",
  primaryRole: "Growth Engineer",
  rotatingRoles: [
    "Growth Engineer",
    "Flutter Developer",
    "Automation Developer",
    "Graphic Designer",
    "Product Builder",
  ],
  bio: "Building software, automation systems, and digital experiences that help businesses grow and innovate.",
  portrait,
  available: true,
};

export const stats = [
  { label: "Apps shipped", value: 14 },
  { label: "Automation flows", value: 60 },
  { label: "Active users reached", value: "120K+" },
  { label: "Years building", value: 6 },
];

/* ───────── Tech stack for marquee ───────── */

export const techStack = [
  { name: "Flutter", icon: "🦋" },
  { name: "Dart", icon: "🎯" },
  { name: "Firebase", icon: "🔥" },
  { name: "VS Code", icon: "💻" },
  { name: "Android Studio", icon: "🤖" },
  { name: "GitHub", icon: "🐙" },
  { name: "Figma", icon: "🎨" },
  { name: "Photoshop", icon: "🖼️" },
  { name: "Illustrator", icon: "✏️" },
  { name: "Unity", icon: "🎮" },
  { name: "JavaScript", icon: "⚡" },
  { name: "HTML", icon: "🌐" },
  { name: "CSS", icon: "🎭" },
];

export const marqueeWords = [
  "Flutter",
  "Dart",
  "Firebase",
  "Figma",
  "Automation",
  "Growth",
  "Design",
  "Product",
];

/* ───────── Organizations ───────── */

export const organizations = [
  { name: "Zoomin", type: "Company" },
  { name: "Mostaqal", type: "Platform" },
  { name: "Growfet", type: "Startup" },
  { name: "Refqaa", type: "Volunteer" },
  { name: "Bionic Team", type: "Team" },
  { name: "Mega Team", type: "Team" },
  { name: "Matrix Team", type: "Team" },
  { name: "Sonaa IT", type: "Company" },
  { name: "NASA Space Apps", type: "Competition" },
  { name: "Rowad", type: "Organization" },
];

/* ───────── Services ───────── */

export const services = [
  {
    n: "01",
    title: "Flutter App Development",
    body: "Cross-platform mobile apps with native polish — design systems, offline-first state, App Store / Play Store delivery.",
    tags: ["Flutter", "Dart", "Firebase", "Riverpod"],
    features: ["Custom UI/UX", "API Integration", "Push Notifications", "In-App Purchases"],
    timeline: "4-12 weeks",
    pricing: "Starting from $2,000",
  },
  {
    n: "02",
    title: "Business Automation",
    body: "Internal tools, scrapers, n8n / Make graphs, custom Python bots that quietly run a business.",
    tags: ["n8n", "Python", "Playwright", "Webhooks"],
    features: ["Workflow Automation", "Data Scraping", "Bot Development", "API Pipelines"],
    timeline: "2-6 weeks",
    pricing: "Starting from $1,500",
  },
  {
    n: "03",
    title: "Graphic & Brand Design",
    body: "Identity systems, app icons, posters and product visuals. Type-led, restrained, photographic.",
    tags: ["Figma", "Illustrator", "Type", "Motion"],
    features: ["Logo Design", "Brand Guidelines", "Marketing Materials", "Social Media Assets"],
    timeline: "1-4 weeks",
    pricing: "Starting from $800",
  },
  {
    n: "04",
    title: "UI/UX Design",
    body: "Beautiful, user-centered interfaces that convert visitors and delight users at every touchpoint.",
    tags: ["Figma", "Prototyping", "User Research", "Design Systems"],
    features: ["Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    timeline: "2-6 weeks",
    pricing: "Starting from $1,200",
  },
  {
    n: "05",
    title: "Custom Software",
    body: "Full-stack web solutions, dashboards, SaaS MVPs — from idea to launch with clean architecture.",
    tags: ["React", "Node.js", "Supabase", "Vercel"],
    features: ["Web Apps", "Admin Dashboards", "SaaS Platforms", "REST/GraphQL APIs"],
    timeline: "6-16 weeks",
    pricing: "Starting from $3,000",
  },
  {
    n: "06",
    title: "Consultation",
    body: "Strategic advice on product, tech stack, growth engineering and automation. One-on-one sessions.",
    tags: ["Strategy", "Growth", "Architecture", "Review"],
    features: ["Tech Stack Review", "Architecture Planning", "Growth Strategy", "Code Review"],
    timeline: "Per session",
    pricing: "Starting from $100/hr",
  },
];

export const featuredProjects = [
  {
    id: "pulse",
    name: "Pulse — habit OS",
    year: 2025,
    role: "Lead mobile + brand",
    summary: "A daily habits app that learns your rhythm. 38k MAU, 4.8★ App Store.",
    cover: appPulse,
    accent: "neon",
    category: "apps",
  },
  {
    id: "ledger",
    name: "Ledger Black",
    year: 2025,
    role: "Mobile + automation",
    summary: "Private finance dashboard with automated bank reconciliation pipelines.",
    cover: appLedger,
    accent: "neon",
    category: "apps",
  },
  {
    id: "still",
    name: "Still — focus timer",
    year: 2024,
    role: "Product + design",
    summary: "A meditation-paced focus app. Featured by Apple in 11 countries.",
    cover: appStill,
    accent: "amber",
    category: "apps",
  },
];

export const apps = [
  {
    id: "pulse",
    name: "Pulse",
    tagline: "Daily habits, learned.",
    icon: "◐",
    rating: 4.8,
    reviews: "2.1k",
    downloads: "120k+",
    category: "Health · Productivity",
    accent: "neon",
    cover: appPulse,
  },
  {
    id: "ledger",
    name: "Ledger Black",
    tagline: "Private money, public clarity.",
    icon: "◼",
    rating: 4.7,
    reviews: "812",
    downloads: "24k+",
    category: "Finance",
    accent: "neon",
    cover: appLedger,
  },
  {
    id: "still",
    name: "Still",
    tagline: "A timer that breathes with you.",
    icon: "◯",
    rating: 4.9,
    reviews: "5.4k",
    downloads: "210k+",
    category: "Mindfulness",
    accent: "amber",
    cover: appStill,
  },
];

export const designs = [
  { id: "d1", title: "Halftone — identity system", category: "Branding", cover: design1 },
  { id: "d2", title: "Spectra — editorial spread", category: "Editorial", cover: design2 },
  { id: "d3", title: "Lanture — logo suite", category: "Logos", cover: design3 },
];

/* ───────── Experience tabs ───────── */

export const workExperience = [
  {
    role: "Mobile Developer",
    company: "8shiver",
    period: "2024 — Present",
    location: "Remote",
    highlights: [
      "Building cross-platform mobile app from 0 to 1",
      "Owns product roadmap + design system",
      "Flutter, Firebase, Riverpod",
    ],
  },
  {
    role: "Automation Engineer",
    company: "Freelance",
    period: "2022 — Present",
    location: "Remote",
    highlights: [
      "60+ automation flows shipped",
      "n8n / Make / Python pipelines",
      "Saved clients 200+ hrs / month",
    ],
  },
  {
    role: "Graphic Designer",
    company: "Self-employed",
    period: "2020 — Present",
    location: "Mansoura, EG",
    highlights: [
      "Brand systems for 20+ startups",
      "App icons, posters, motion",
      "Figma / Illustrator / After Effects",
    ],
  },
  {
    role: "Product Engineer",
    company: "Ledger Black",
    period: "2023 — 2024",
    location: "Remote",
    highlights: [
      "Led mobile + automation stack",
      "Bank reconciliation pipeline",
      "24k+ downloads in 6 months",
    ],
  },
];

export const volunteerExperience = [
  {
    role: "Technical Lead",
    company: "Refqaa",
    period: "2023 — Present",
    location: "Mansoura, EG",
    highlights: [
      "Led technical team of 8 members",
      "Built internal management tools",
      "Organized tech workshops",
    ],
  },
  {
    role: "Design Lead",
    company: "Bionic Team",
    period: "2022 — 2023",
    location: "Mansoura, EG",
    highlights: [
      "Designed all team branding materials",
      "Created social media campaigns",
      "Mentored junior designers",
    ],
  },
];

export const internships = [
  {
    role: "Flutter Intern",
    company: "Sonaa IT",
    period: "2022",
    location: "Remote",
    highlights: [
      "Built 3 production features",
      "Learned enterprise Flutter patterns",
      "Contributed to CI/CD pipeline",
    ],
  },
  {
    role: "Design Intern",
    company: "Growfet",
    period: "2021",
    location: "Remote",
    highlights: [
      "Created UI components library",
      "Designed onboarding flow",
      "User research interviews",
    ],
  },
];

export const leadership = [
  {
    role: "Team Lead",
    company: "Mega Team",
    period: "2023 — Present",
    location: "Mansoura, EG",
    highlights: [
      "Leading cross-functional team of 12",
      "Sprint planning and retrospectives",
      "Delivered 4 successful projects",
    ],
  },
  {
    role: "Co-Founder",
    company: "Matrix Team",
    period: "2022 — 2023",
    location: "Mansoura, EG",
    highlights: [
      "Founded competitive programming team",
      "Organized local hackathons",
      "Grew community to 50+ members",
    ],
  },
];

// Backward compat
export const experiences = workExperience;

/* ───────── Skills ───────── */

export const skills = {
  Development: [
    { name: "Flutter / Dart", level: 95 },
    { name: "JavaScript / TypeScript", level: 80 },
    { name: "Python", level: 75 },
    { name: "Firebase", level: 90 },
    { name: "React", level: 70 },
    { name: "HTML / CSS", level: 85 },
  ],
  Design: [
    { name: "Figma", level: 92 },
    { name: "Adobe Photoshop", level: 85 },
    { name: "Adobe Illustrator", level: 88 },
    { name: "UI/UX Design", level: 80 },
    { name: "Motion Design", level: 65 },
  ],
  Automation: [
    { name: "n8n", level: 90 },
    { name: "Make (Integromat)", level: 85 },
    { name: "Python Bots", level: 80 },
    { name: "Web Scraping", level: 85 },
    { name: "API Integration", level: 90 },
  ],
  Marketing: [
    { name: "Growth Hacking", level: 75 },
    { name: "SEO", level: 70 },
    { name: "Content Strategy", level: 72 },
    { name: "Analytics", level: 78 },
  ],
  Leadership: [
    { name: "Team Management", level: 85 },
    { name: "Project Planning", level: 80 },
    { name: "Mentoring", level: 82 },
    { name: "Agile/Scrum", level: 78 },
  ],
  "Soft Skills": [
    { name: "Communication", level: 88 },
    { name: "Problem Solving", level: 92 },
    { name: "Time Management", level: 80 },
    { name: "Adaptability", level: 85 },
  ],
};

/* ───────── Certificates ───────── */

export const certificates = [
  {
    id: "cert-1",
    title: "Flutter Advanced Course",
    issuer: "Udemy",
    date: "2024",
    image: appPulse,
  },
  {
    id: "cert-2",
    title: "Google UX Design",
    issuer: "Google / Coursera",
    date: "2023",
    image: appLedger,
  },
  {
    id: "cert-3",
    title: "Python Automation",
    issuer: "Automate the Boring Stuff",
    date: "2023",
    image: appStill,
  },
  {
    id: "cert-4",
    title: "NASA Space Apps",
    issuer: "NASA",
    date: "2023",
    image: design1,
  },
  {
    id: "cert-5",
    title: "Firebase Fundamentals",
    issuer: "Google",
    date: "2022",
    image: design2,
  },
];

/* ───────── Volunteering ───────── */

export const volunteering = [
  {
    id: "vol-refqaa",
    organization: "Refqaa",
    role: "Technical Lead",
    period: "2023 — Present",
    description: "Community-driven organization focused on youth empowerment and tech education.",
    achievements: [
      "Led a team of 8 developers",
      "Built internal tools for 500+ members",
      "Organized 10+ tech workshops",
    ],
    responsibilities: ["Technical strategy", "Team recruitment", "Workshop planning"],
  },
  {
    id: "vol-bionic",
    organization: "Bionic Team",
    role: "Design Lead",
    period: "2022 — 2023",
    description: "Student engineering team building competitive robots and automation systems.",
    achievements: [
      "Designed complete brand identity",
      "Created team website",
      "Won regional design award",
    ],
    responsibilities: ["Brand design", "Social media", "Graphic design"],
  },
  {
    id: "vol-mega",
    organization: "Mega Team",
    role: "Team Lead",
    period: "2023 — Present",
    description: "Cross-functional technology team working on innovative software projects.",
    achievements: [
      "Delivered 4 successful projects",
      "Grew team from 5 to 12",
      "Established agile workflow",
    ],
    responsibilities: ["Sprint management", "Code review", "Architecture decisions"],
  },
  {
    id: "vol-matrix",
    organization: "Matrix Team",
    role: "Co-Founder",
    period: "2022 — 2023",
    description: "Competitive programming community focused on algorithms and problem-solving.",
    achievements: [
      "Grew community to 50+ members",
      "Organized 3 hackathons",
      "Members placed in ICPC",
    ],
    responsibilities: ["Community building", "Event planning", "Problem setting"],
  },
  {
    id: "vol-sonaa",
    organization: "Sonaa IT",
    role: "Volunteer Developer",
    period: "2022",
    description: "IT company providing pro-bono development for non-profit organizations.",
    achievements: [
      "Built 2 charity apps",
      "Trained 5 junior developers",
      "Improved deployment pipeline",
    ],
    responsibilities: ["Mobile development", "Code mentoring", "QA testing"],
  },
];

export const reviews = [
  {
    quote:
      "Nour shipped our v1 in six weeks. The app feels like it was made by a studio three times our size.",
    author: "Layla H.",
    role: "Founder, Pulse Health",
  },
  {
    quote: "Half developer, half designer, half operator — and somehow that adds up. Rare hire.",
    author: "Mostafa K.",
    role: "CTO, Ledger Black",
  },
  {
    quote: "The automation work paid for itself in the first month. He thinks in systems.",
    author: "Sara M.",
    role: "Ops Lead, Still",
  },
];
