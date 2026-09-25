import { ACADEMY_VENDORS } from "@/constants";

export interface GapStat {
  label: string;
  value: number;
}

export const READINESS_GAP: GapStat[] = [
  { label: "Can build a technical product", value: 86 },
  { label: "Actually launch a company", value: 9 },
];

export interface OutcomeSlice {
  label: string;
  value: number;
}

export const OUTCOME_DISTRIBUTION: OutcomeSlice[] = [
  { label: "Founders", value: 38 },
  { label: "Professionals", value: 47 },
  { label: "Both (later)", value: 15 },
];

export interface CohortPoint {
  cohort: string;
  mvps: number;
  funded: number;
}

export const COHORT_GROWTH: CohortPoint[] = [
  { cohort: "2026", mvps: 12, funded: 3 },
  { cohort: "2027", mvps: 18, funded: 6 },
  { cohort: "2028", mvps: 24, funded: 9 },
  { cohort: "2029", mvps: 31, funded: 14 },
];

export interface FlywheelPhase {
  phase: string;
  weeks: string;
  subtitle: string;
  points: string[];
  deliverable: string;
  icon: string;
}

export const FLYWHEEL: FlywheelPhase[] = [
  {
    phase: "DEVELOP",
    weeks: "8 WEEKS",
    subtitle: "Build Your Foundation.",
    points: [
      "Technical core: Software development,AI,cloud basics, cybersecurity fundamentals",
      "Startup 101: Customer discovery, MVP definition, unit economics",
      "Portfolio project + GitHub documentation",
      "Soft skills: Pitch structure, team collaboration"
    ],
    deliverable: "Pitch deck v1 + deployed portfolio project + customer interviews",
    icon: "Lightbulb",
  },
  {
    phase: "Build",
    weeks: "Weeks 4–9",
    subtitle: "Turn Your Project into a Product",
    points: [
      "Hands-on MVP development sprints",
      "Cloud credits & technical mentorship",
      "Security audit + OWASP testing",
      "User testing with real users, documented feedback"
    ],
    deliverable: "Deployed MVP + user feedback report + pitch deck v2",
    icon: "Hammer",
  },
  {
    phase: "LAUNCH",
    weeks: "4 weeks, rolling",
    subtitle: "Get Funded. Get Your First Customer.",
    points: [
      "Micro-grants for top graduates",
      "Angel network pitch sessions with investors",
      "Corporate pilot introductions for paid pilots",
      "Grant application support",
    ],
    deliverable: "Micro-grant or pilot secured + live pitch to angels + grant submitted",
    icon: "Rocket",
  },
  {
    phase: "Show",
    weeks: "1 week event + lifetime alumni",
    subtitle: "Take the Stage. Or Take a Job. Or Both.. Or Both.",
    points: [
      "STRIDE X Student Edition: Pitch to real VCs and corporate leads",
      "Demo Day: End-of-cohort pitch competition with prizes",
      "Career fair with corporate employers",
      "Alumni network: Lifetime access to mentors, deals, co-founders",
    ],
    deliverable: " Pitched to real investors + job offer (optional) + alumni community access",
    icon: "Trophy",
  },
];

export type CellValue = boolean | string;

export interface ComparisonRow {
  feature: string;
  uni: CellValue;
  online: CellValue;
  weekend: CellValue;
  innovera: CellValue;
}

export const COMPARISON: ComparisonRow[] = [
  {
    feature: "Teaches business skills",
    uni: false,
    online: false,
    weekend: "48h only",
    innovera: true,
  },
  {
    feature: "Provides cloud credits",
    uni: false,
    online: false,
    weekend: false,
    innovera: true,
  },
  {
    feature: "Gives micro-grants",
    uni: false,
    online: false,
    weekend: false,
    innovera: true,
  },
  {
    feature: "Pitches to real VCs",
    uni: false,
    online: false,
    weekend: "Once",
    innovera: "Repeated",
  },
  {
    feature: "Corporate pilot intro",
    uni: false,
    online: false,
    weekend: false,
    innovera: true,
  },
  {
    feature: "Job placement if startup fails",
    uni: false,
    online: false,
    weekend: false,
    innovera: true,
  },
  {
    feature: "Accredited certification",
    uni: "Degree",
    online: false,
    weekend: false,
    innovera: true,
  },
  {
    feature: "Lifetime alumni network",
    uni: false,
    online: false,
    weekend: false,
    innovera: true,
  },
];

export interface Pathway {
  title: string;
  points: string[];
  icon: string;
  tone: "accent" | "primary";
}

export const PATHWAYS: Pathway[] = [
  {
    title: "Path 1 · Launch Your Startup",
    icon: "Rocket",
    tone: "accent",
    points: [
      "Leave with a funded, live product",
      "Micro-grant and/or pilot customer",
      "Ongoing alumni & investor support",
      "Co-founder matching from your cohort",
    ],
  },
  {
    title: "Path 2 · Get Hired as a Builder",
    icon: "Briefcase",
    tone: "primary",
    points: [
      "Backup job offers from partner companies",
      "A portfolio-grade MVP to show employers",
      "Proof you can ship under real constraints",
      "Direct intros to hiring engineering teams",
    ],
  },
];

export interface WalkAwayItem {
  title: string;
  desc: string;
  icon: string;
}

export const WALK_AWAY: WalkAwayItem[] = [
  {
    title: "Deployed MVP",
    desc: "URL, APK, or demo video — a real, working product ",
    icon: "Hammer",
  },
  {
    title: "Pitch Deck v2",
    desc: " Investor-ready, tested, refined",
    icon: "FileText",
  },
  {
    title: "Certified Founder Credential",
    desc: "AICERTS accredited",
    icon: "Award",
  },
  {
    title: "GitHub Portfolio",
    desc: "GitHub Portfolio",
    icon: "Github",
  },
  {
    title: "Lifetime Alumni Network",
    desc: "Community access for life",
    icon: "Users",
  },
  {
    title: "Demo Day Experience",
    desc: "Pitched to real VCs",
    icon: "Award",
  },
  {
    title: "User Feedback Report",
    desc: "Real users, documented insights",
    icon: "FileText",
  },
  {
    title: "Micro-grant or Pilot Customer",
    desc: "Non-dilutive funding or paid pilot",
    icon: "DollarSign",
  },
  {
    title: "Job Offer from Partner Company",
    desc: "From career fair (optional)",
    icon: "Briefcase",
  },
];

export const FOR_YOU: string[] = [
  "You are a university student or recent graduate in a technical field.",
  "You can already build — or are hungry to learn fast by building.",
  "You want to start a company but don't know the first business step.",
  "You can commit to evenings and weekends for 12–16 weeks.",
  "You want funding and a safety net, not just another certificate.",
];

export const NOT_FOR_YOU: string[] = [
  "You're looking for a passive, watch-only video course.",
  "You can't commit any consistent time over the program.",
  "You want a guaranteed job with zero effort or building.",
  "You're not willing to talk to real customers or ship in public.",
];

export interface Testimonial {
  name: string;
  school: string;
  quote: string;
  outcome: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mariam",
    school: "Cairo University · Cohort 1",
    quote:
      "I built an MVP for a cybersecurity monitoring tool. Innovera introduced me to a corporate client who paid for a pilot. I never thought my capstone project would become a business.",
    outcome: "Paid pilot with logistics company. Now raising pre-seed.",
  },
  {
    name: "Ahmed",
    school: "Alexandria University · Cohort 2",
    quote:
      "I failed at launching. But the career fair got me a job at a bank as a security analyst. I'm building savings to try again. Innovera didn't abandon me.",
    outcome: "Placed at commercial bank with competitive salary.",
  },
  {
    name: "Youssef & Team",
    school: "GUC · Cohort 1",
    quote:
      "The micro-grant was a game changer. It paid for our first servers and legal fees. We're now in an accelerator.",
    outcome: "Secured micro-grant + angel investment.",
  },
];

export interface Partner {
  name: string;
  logo?: string;
}

export const PARTNERS: Partner[] = [
  { name: "Cairo University",logo: ACADEMY_VENDORS.Cairo_University.logo },
  { name: "AASTMT",logo: ACADEMY_VENDORS.AASTMT.logo },
  { name: "Engineering Syndicate",logo: ACADEMY_VENDORS.Engineering_Syndicate.logo },
  { name: "AICERTS Accredited Training Provider", logo: ACADEMY_VENDORS.AICERTS.logo },
  { name: "Palo Alto Networks Authorized Partner", logo: ACADEMY_VENDORS.PALO_ALTO.logo },
  { name: "Fortinet Academic Partner", logo: ACADEMY_VENDORS.FORTINET.logo },
];



export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "How long is the program and what's the time commitment?",
    a: "Innovera Academy runs for 12–16 weeks. Sessions are held in the evenings and on weekends so you can participate alongside university or work, with roughly 10–15 hours per week including building time.",
  },
  {
    q: "Do I need a startup idea before I apply?",
    a: "No. The first phase of the flywheel is dedicated to problem discovery and idea validation. Plenty of students arrive with only the desire to build and leave with a validated, funded product.",
  },
  {
    q: "What does the funding look like — do you take equity?",
    a: "Top graduates receive non-dilutive micro-grants. We take no equity, and there is no repayment unless your startup later raises significant external funding.",
  },
  {
    q: "What if my startup doesn't work out?",
    a: "That's exactly why we built the backup job track. Partner companies actively hire our graduates, so you leave with a working MVP and a real job offer as a safety net.",
  },
  {
    q: "Who is eligible to apply?",
    a: "University students and recent graduates in technical fields who can build (or are eager to learn fast) and can commit to the evening-and-weekend schedule for the full program.",
  },
  {
    q: "How much does it cost?",
    a: "Reach out through the application form for current tuition, scholarship, and payment-plan details. We work hard to keep the program accessible to talented students.",
  },
];
