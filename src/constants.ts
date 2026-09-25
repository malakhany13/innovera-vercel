import { Target, Eye, Shield, Users, Zap, Globe, Award, Briefcase, MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Instagram, Code, GraduationCap, HeartPulse, Landmark, Building, ShoppingCart, Handshake, Building2, CalendarDays, Brain, Server, Calendar } from 'lucide-react';
const clientsImg = "/assets/clients.png";
const eventsImg = "/assets/events.png";
const partnersImg = "/assets/partners.png";
export const offices = [
  {
    country: "Egypt",
    city: "Cairo",
    type: "Headquarters",
    address: "Administrative building no. 5 Zizinia compound, fifth settlement, New Cairo, Cairo",
    phone: "",
    email: "info@innoveracorp.com",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&q=80&w=800"
  },
  {
    country: "Saudi Arabia",
    city: "Geddah",
    type: "Regional Office",
    address: "King Fahd Road, Olaya District, Geddah",
    phone: "+20 103 1119 000",
    email: "info@innoveracorp.com",
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800"
  },
  {
    country: "Oman",
    city: "Muscat",
    type: "Regional Office",
    address: "Sultan Qaboos Street, Muscat",
    phone: "+20 103 1117 000",
    email: "info@innoveracorp.com",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  }
];

export const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/innovera", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/innovera", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com/innovera", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/innovera", label: "Instagram" }
];
export const branches = [
  {
    city: "Cairo, Egypt",
    address: "Administrative building no. 5 Zizinia compound, fifth settlement, New Cairo, Cairo",
    phone: "+20 10 70008672",
    type: "Global Headquarters"
  },
  {
    city: "Geddah, Saudi Arabia",
    address: "King Fahd Road, Olaya District, Geddah",
    phone: "+20 103 1119 000",
    type: "Regional Office"
  },
  {
    city: "Muscat, Oman",
    address: "Sultan Qaboos Street, Muscat",
    phone: "+20 103 1117 000",
    type: "Regional Office"
  }
];
export const events = [
  {
    id: 1,
    title: "Cairo ICT 2026",
    date: "November 2026",
    location: "Egypt International Exhibition Center, Cairo",
    description: "Join Innovera at the leading technology exhibition and conference in Africa and the Middle East. We will be showcasing our latest AI and Cybersecurity solutions.",
    content: "Cairo ICT is the premier technology event in the Middle East and Africa. Innovera will be participating with a massive pavilion showcasing our latest innovations in Artificial Intelligence, Cybersecurity, and Enterprise Solutions.\n\nVisitors will have the opportunity to interact with our experts, attend live demonstrations of our zero-trust security architecture, and explore how our AI-driven predictive maintenance tools are revolutionizing the industrial sector.\n\nDon't miss our CEO's keynote speech on the future of digital transformation in Egypt and the region.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    category: "Exhibition",
    link: "https://cairoict.com/"
  },
  {
    id: 2,
    title: "LEAP 2026",
    date: "August 31 - September 3, 2026",
    location: "Riyadh, Saudi Arabia",
    description: "Described as the 'CES of the Middle East', LEAP is a massive global tech event where billions in deals are made.",
    content: "Innovera is proud to be part of LEAP 2026 in Riyadh, Saudi Arabia. As the region rapidly accelerates its digital transformation under Vision 2030, LEAP serves as the ultimate gathering for tech innovators and investors.\n\nWe will be unveiling our new suite of localized AI models designed specifically for the Arabic language, alongside our enterprise-grade cloud security solutions. Our team will be available for B2B meetings to discuss strategic partnerships and large-scale deployments.\n\nJoin us at the Saudi capital to witness the future of technology unfold.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
    category: "Global Tech Event",
    link: "https://www.onegiantleap.com/"
  },
  {
    id: 3,
    title: "GITEX Global 2026",
    date: "December 7-11, 2026",
    location: "Dubai Exhibition Centre - Expo City, UAE",
    description: "The oldest and most renowned technology conference in the region, moving to a massive new venue in 2026.",
    content: "GITEX Global remains the cornerstone of the Middle East's technology calendar. In 2026, the event moves to the expansive Dubai Exhibition Centre at Expo City, and Innovera will be there with our largest presence yet.\n\nWe will be demonstrating our cutting-edge Smart City Data Platforms and Financial Fraud Detection Systems. Our experts will host daily workshops on migrating legacy systems to modern microservices architectures.\n\nConnect with our leadership team to explore how Innovera can accelerate your organization's digital journey.",
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800",
    category: "Conference",
    link: "https://www.gitex.com/"
  },
  {
    id: 4,
    title: "EVIS - Electric Vehicle Innovation Summit",
    date: "May 20-22, 2026",
    location: "Al Manara International Conference Center, Cairo",
    description: "Exploring the future of e-mobility in Egypt. Innovera presents intelligent charging infrastructure and AI-driven fleet management solutions.",
    content: "The Electric Vehicle Innovation Summit (EVIS) is the premier platform for the e-mobility sector in the region. Innovera is at the forefront of this revolution, providing the critical software infrastructure needed to support smart charging networks.\n\nAt EVIS, we will showcase our AI-driven fleet management solutions that optimize routing, predict maintenance needs, and manage energy consumption for electric vehicle fleets. We will also present our secure payment gateway integrations designed specifically for EV charging stations.\n\nJoin us to discuss the future of sustainable transportation and smart mobility.",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800",
    category: "Summit",
    link: "https://evs-electrify.com/"
  },
  {
    id: 5,
    title: "RiseUp Summit",
    date: "First Half of 2026",
    location: "Cairo, Egypt",
    description: "The ultimate gathering for startups and entrepreneurs in the MENA region, full of energy, networking, and innovation.",
    content: "RiseUp Summit is the beating heart of the MENA startup ecosystem. Innovera is committed to supporting the next generation of tech leaders, and we are thrilled to sponsor and participate in this vibrant event.\n\nOur senior engineers and executives will be holding mentorship sessions for early-stage startups, focusing on scalable architecture, cybersecurity best practices, and AI integration. We will also be scouting for innovative startups to join our technology incubator program.\n\nIf you're a founder, developer, or content creator looking for inspiration and connections, the RiseUp Summit is the place to be.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
    category: "Startup Summit",
    link: "https://riseupsummit.com/"
  },
  {
    id: 6,
    title: "Web Summit Qatar",
    date: "February 2026",
    location: "Doha, Qatar",
    description: "The Middle Eastern edition of the world's largest technology conference, bringing global tech leaders to the region.",
    content: "Web Summit Qatar brings the unparalleled scale and networking opportunities of the global Web Summit to the Middle East. Innovera will be participating to connect with international partners and showcase our regional expertise.\n\nWe will be highlighting our successes in enterprise ERP modernization and digital health records ecosystems. The summit provides a unique platform to discuss global tech trends and how they apply to the unique challenges and opportunities in the MENA region.",
    image: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800",
    category: "Global Tech Event",
    link: "https://qatar.websummit.com/"
  },
  {
    id: 7,
    title: "EGYPES",
    date: "March 30 - April 1, 2026",
    location: "Egypt International Exhibition Center, Cairo",
    description: "The Egypt Energy Show, focusing on the future of energy, oil, gas, and the transition to sustainable solutions.",
    content: "EGYPES is a critical event for the energy sector. Innovera provides essential digital transformation services to energy companies, helping them optimize operations and secure critical infrastructure.\n\nAt EGYPES 2026, we will demonstrate our IoT security frameworks and predictive maintenance AI models specifically tailored for the oil, gas, and renewable energy sectors. Learn how our solutions can reduce downtime and protect against sophisticated cyber threats targeting industrial control systems.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    category: "Energy & Tech",
    link: "https://www.egypes.com/"
  },
  {
    id: 8,
    title: "DevOpsDays Cairo",
    date: "September 26-27, 2026",
    location: "Cairo, Egypt",
    description: "A worldwide series of technical conferences covering software development, IT infrastructure operations, and the intersection between them.",
    content: "DevOpsDays Cairo is a must-attend event for software engineers, system administrators, and IT leaders. Innovera's engineering team will be actively participating, sharing our experiences in building resilient, scalable cloud architectures.\n\nWe will be hosting technical talks on automating security within the CI/CD pipeline (DevSecOps) and managing microservices at scale. This is a fantastic opportunity to deep-dive into technical challenges and learn from the best in the local community.",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=800",
    category: "Technical Conference",
    link: "https://devopsdays.org/events/2026-cairo/welcome/"
  }
];
export const albums = [
  {
    id: "fitic-ev-2025",
    title: "FITIC EVs 2025 Award",
    cover: "https://drive.google.com/thumbnail?id=1LZMt-bsRkIhH7FLo-QVM9lva97-W0Whf&sz=w1200",
    images: [
      { url: "https://drive.google.com/thumbnail?id=1LZMt-bsRkIhH7FLo-QVM9lva97-W0Whf&sz=w1200", title: "FITIC EVs 2025 Excellence Award" }
    ]
  },
  {
    id: "ciso-connect-egypt",
    title: "CISO Connect Egypt",
    cover: "https://drive.google.com/thumbnail?id=16aL7C4zk9Uy1MiQzzWXCjA7cqPG64eNT&sz=w1200",
    images: [
      { url: "https://drive.google.com/thumbnail?id=16aL7C4zk9Uy1MiQzzWXCjA7cqPG64eNT&sz=w1200", title: "Innovera at CISO Connect Egypt" }
    ]
  },
  {
    id: "egyptian-engineers-syndicate",
    title: "Egyptian Engineers Syndicate Agreement",
    cover: "https://drive.google.com/thumbnail?id=1xov6pLIpPtQqPlL3SGIDmRRMnffvbX2k&sz=w1200",
    images: [
      { url: "https://drive.google.com/thumbnail?id=1xov6pLIpPtQqPlL3SGIDmRRMnffvbX2k&sz=w1200", title: "Egyptian Engineers Syndicate Agreement" }
    ]
  },
  {
    id: "egyptian-chinese-university",
    title: "Egyptian Chinese University Agreement",
    cover: "https://almolakhasalektesady.com/wp-content/uploads/2025/12/2addaa8b-8aaf-4ea7-a716-e39e2d67aa65-1140x570.jpeg",
    images: [
      { url: "https://almolakhasalektesady.com/wp-content/uploads/2025/12/2addaa8b-8aaf-4ea7-a716-e39e2d67aa65-1140x570.jpeg", title: "Egyptian Chinese University Agreement" }
    ]
  },
  {
    id: "cairo-ict-2025",
    title: "Cairo ICT 2025",
    cover: "https://drive.google.com/thumbnail?id=1HY4KXLWNoj3FQHzHzT-aybWAuB12-VUx&sz=w1200",
    images: [
      { url: "https://drive.google.com/thumbnail?id=1HY4KXLWNoj3FQHzHzT-aybWAuB12-VUx&sz=w1200", title: "Cairo ICT 2025 - Day 1" },
      { url: "https://drive.google.com/thumbnail?id=1yplJyelrYX8iHmuM3TGIRm6BoScgYUJ5&sz=w1200", title: "Cairo ICT 2025 - Partnerships" },
      { url: "https://drive.google.com/thumbnail?id=1cFtFhyIUXnu6Cg_RgNRtRWhluyDK7uFJ&sz=w1200", title: "Cairo ICT 2025 - Exhibition" }
    ]
  },
  {
    id: "infrastructure",
    title: "Company & Infrastructure",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    images: [
      { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", title: "Team Collaboration" },
      { url: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&q=80&w=800", title: "Cairo Headquarters" },
      { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", title: "Oman Office" },
      { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800", title: "Server Infrastructure" },
      { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", title: "Tech Solutions" },
      { url: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800", title: "Riyadh Regional Office" }
    ]
  }
];
export const techPartners = [
  { name: "Partner 1", logo: "https://drive.google.com/thumbnail?id=15YavnOkVgaL7QdKigrr26cYvKuzuST7W&sz=w800" },
  { name: "Partner 2", logo: "https://drive.google.com/thumbnail?id=1ZRz5HFnPAcNkBHbTYjWgRuzXCxMHF2QQ&sz=w800" },
  { name: "Partner 3", logo: "https://drive.google.com/thumbnail?id=1bDwBxiCKLPgKr5jK_gt83Lm8kNWp_8Rf&sz=w800" },
  { name: "Partner 4", logo: "https://drive.google.com/thumbnail?id=1u6ayJ3M3ooDXQwvmrZJisAL71lxhOUII&sz=w800" },
  { name: "Partner 5" , logo: "https://drive.google.com/thumbnail?id=120j6lUoHAWALYPQC6AhdpqnJlKo6SVjv&sz=w800" },
  { name: "Partner 6", logo: "https://drive.google.com/thumbnail?id=1WNTV87fOQDHPCWxmFWwgRiWnzVgppnXX&sz=w800" },
  { name: "Partner 7", logo: "https://drive.google.com/thumbnail?id=1_mXbMVWH67kPq6DV4pDSGMzUlCntRjoZ&sz=w800" },
  { name: "Partner 8", logo: "https://drive.google.com/thumbnail?id=1hAiaeyKyMnXmmOvhSy5G46eH89Wmk5cO&sz=w800" },
  { name: "Partner 9", logo: "https://drive.google.com/thumbnail?id=16DITJY_SVGfJMLyO2vuL4mZem4boNVBB&sz=w800" },
  { name: "Partner 10", logo: "https://drive.google.com/thumbnail?id=1c3a2k3pOaLffoX9TWuwftREc5rMTaAwZ&sz=w800" },
  { name: "Partner 11 ", logo: "https://drive.google.com/thumbnail?id=1VT4LTWMFiDkWab2GL3a16tnQ3eQ0CALx&sz=w800" },
  { name: "Partner 12", logo: "https://drive.google.com/thumbnail?id=1vn7fuKbk-m2Xo2NxV_hhIyEIqythgfkI&sz=w800" },
  { name: "Partner 13", logo: "https://drive.google.com/thumbnail?id=1yVskLK3ZHXzu_ugoKkH4A46s2FFvyzzi&sz=w800" },
  { name: "Partner 14", logo: "https://drive.google.com/thumbnail?id=1B1giv3sm72OE-VRZWUuGLNfhPiZ_N7So&sz=w800" },
  { name: "Partner 15", logo: "https://drive.google.com/thumbnail?id=1YN-KIY1TMY7EOjf2BLpC53zBTEZ6cSBw&sz=w800" }
];
export const academyPartners = [
  { name: "Partner 1", logo: "https://drive.google.com/thumbnail?id=15YavnOkVgaL7QdKigrr26cYvKuzuST7W&sz=w800" },
  { name: "Partner 2", logo: "https://drive.google.com/thumbnail?id=1ZRz5HFnPAcNkBHbTYjWgRuzXCxMHF2QQ&sz=w800" },
  { name: "Partner 3", logo: "https://drive.google.com/thumbnail?id=1bDwBxiCKLPgKr5jK_gt83Lm8kNWp_8Rf&sz=w800" },
  { name: "Partner 4", logo: "https://drive.google.com/thumbnail?id=1u6ayJ3M3ooDXQwvmrZJisAL71lxhOUII&sz=w800" },
  { name: "Partner 6", logo: "https://drive.google.com/thumbnail?id=1WNTV87fOQDHPCWxmFWwgRiWnzVgppnXX&sz=w800" },
 
 
];
  export const industries = [
  { name: "Technology & Software", icon: Code },
  { name: "Education", icon: GraduationCap },
  { name: "Healthcare", icon: HeartPulse },
  { name: "Banking & Financial Services", icon: Landmark },
  { name: "Public Sector", icon: Building },
  { name: "Retail & E-commerce", icon: ShoppingCart }
];

export const heroImages = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070"
];

export const homeBranches = [
  {
    country: "Egypt",
    city: "Cairo",
    type: "Headquarters",
    description: "Center of Excellence for AI, Innovation, and Regional Strategy Leadership.",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&q=80&w=800",
    address: "Administrative building no. 5 Zizinia compound, fifth settlement, New Cairo, Cairo",
    phone: "+20 10 70008672",
    email: "info@innoveracorp.com"
  },
  {
    country: "Saudi Arabia",
    city: "Geddah",
    type: "Regional Office",
    description: "Supporting national digital transformation and collaborating with government entities and companies.",
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800",
    address: "King Fahd Road, Olaya District, Geddah",
    phone: "+20 103 1119 000",
    email: "info@innoveracorp.com"
  },
  {
    country: "Oman",
    city: "Muscat",
    type: "Regional Office",
    description: "Focusing on technological empowerment, institutional transformation, and human capital development.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    address: "Sultan Qaboos Street, Muscat",
    phone: "+20 103 1117 000",
    email: "info@innoveracorp.com"
  }
];
export const sections = [
  {
    title: "Our Partners",
    icon: Handshake,
    image: partnersImg,
    description: "We collaborate with global technology leaders to deliver best-in-class security solutions."
  },
 
  {
    title: "Our Clients",
    icon: Building2,
    image: clientsImg,
    description: "Trusted by leading organizations across the MENA region."
  },
  {
    title: "Our Events",
    icon: CalendarDays,
    image: eventsImg,
    description: "Highlights from our recent global tech events and conferences."
  }
];

export const solutions = [
  {
    title: "AI, Data & Intelligent Automation",
    category: "Automation",
    group: "Core Services",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "AI-powered solutions that automate workflows, generate insights, and improve decision-making.",
    features: [
      "AI Models & Predictive Analytics",
      "Big Data Strategy & Implementation",
      "Intelligent Process Automation (RPA)",
      "Natural Language Processing Solutions",
      "Business Intelligence Dashboards",
      "Custom AI Consulting & Roadmaps"
    ]
  },
  {
    title: "Cybersecurity & Digital Resilience",
    category: "Security",
    group: "Core Services",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Security solutions that protect networks, cloud environments, and critical operations.",
    features: [
      "Zero Trust Architecture Implementation",
      "Cloud & Network Security",
      "Managed Security Operations (SOC)",
      "Vulnerability & Penetration Testing",
      "Incident Response & Cyber Forensics",
      "Governance, Risk, and Compliance (GRC)"
    ]
  },
  {
    title: "Software, Cloud & Infrastructure",
    category: "Infrastructure",
    group: "Core Services",
    icon: Server,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Integrated software, cloud, and infrastructure services built for performance and continuity.",
    features: [
      "Enterprise Cloud Migration (AWS, Azure)",
      "Microservices & APIs Integration",
      "Data Center Modernization",
      "Custom DevOps & CI/CD Pipelines",
      "Infrastructure as Code (IaC)",
      "Disaster Recovery Planning"
    ]
  },
  {
    title: "Digital Platforms & Business Products",
    category: "Platforms",
    group: "Core Services",
    icon: Code,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Digital platforms that streamline operations, enhance productivity, and support growth.",
    features: [
      "Full-Stack Custom App Development",
      "Scalable SaaS Architectures",
      "Mobile Applications (iOS & Android)",
      "UI/UX Research & Design",
      "Legacy System Modernization",
      "Product Strategy & Roadmap"
    ]
  },
  {
    title: "Consulting & Transformation Advisory",
    category: "Consulting",
    group: "Core Services",
    icon: Briefcase,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Strategic advisory services that guide digital transformation and technology adoption.",
    features: [
      "Digital Transformation Strategies",
      "Technology Risk Assessments",
      "Enterprise Architecture Design",
      "IT Cost Optimization & FinOps",
      "Business Continuity Planning",
      "Change Management & Training"
    ]
  },
  {
    title: "Outsourcing & Managed Operations",
    category: "Operations",
    group: "Core Services",
    icon: Users,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Flexible outsourcing models that extend capacity, provide expertise, and maintain service quality.",
    features: [
      "IT Staff Augmentation",
      "Dedicated Development Teams",
      "Managed Service Desk (L1/L2/L3)",
      "Network Operations Center (NOC)",
      "Project Management Outsourcing",
      "SLA-Backed Performance Management"
    ]
  },
  {
    title: "Events & Conference Delivery",
    category: "Events",
    group: "Specialized Services",
    icon: Calendar,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "End-to-end event support covering planning, execution, content, logistics, and digital coverage.",
    features: [
      "Strategic Event Planning",
      "Venue Management & Logistics",
      "Content Curation & Production",
      "Digital Coverage & Broadcasting",
      "Speaker Management",
      "Post-Event Analytics"
    ]
  },
  {
    title: "International Admission Support",
    category: "Admissions",
    group: "Specialized Services",
    icon: GraduationCap,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Structured admission support that simplifies documentation, applications, and follow-up.",
    features: [
      "University Selection Consulting",
      "Application Preparation",
      "Scholarship Assistance",
      "Visa & Immigration Guidance",
      "Pre-departure Orientation",
      "Student Accommodation Support"
    ]
  },
  {
    title: "Strategic Partnerships",
    category: "Partnerships",
    group: "Strategic Initiatives",
    icon: Handshake,
    color: "text-brand-cyan",
    bgColor: "bg-brand-cyan/10",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "We build partnerships that strengthen capabilities and expand impact.",
    features: [
      "Global Technology Alliances",
      "Academic Collaborations",
      "Public-Private Partnerships",
      "Joint Go-To-Market Strategies",
      "Ecosystem Development",
      "Knowledge Transfer Programs"
    ]
  },
  {
    title: "Innovation and R&D",
    category: "Innovation",
    group: "Strategic Initiatives",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "We turn emerging technologies into practical, scalable solutions.",
    features: [
      "Proof of Concept (PoC) Development",
      "Applied AI & Machine Learning Research",
      "IoT & Edge Computing Innovations",
      "Blockchain Applications",
      "Technology Incubation",
      "Prototyping Labs"
    ]
  },
  {
    title: "Regional Growth and Market Enablement",
    category: "Growth",
    group: "Strategic Initiatives",
    icon: Globe,
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "We expand our reach through scalable solutions across Egypt and the MENA region.",
    features: [
      "Market Entry Strategy",
      "Localization & Compliance",
      "Regional Office Setup",
      "Channel Partner Development",
      "Cross-border scaling",
      "Cultural Integration"
    ]
  },
  {
    title: "Industry Engagement and Initiatives",
    category: "Engagement",
    group: "Strategic Initiatives",
    icon: Building2,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "We connect innovation with market needs through knowledge-driven initiatives.",
    features: [
      "Industry Think Tanks",
      "Sector-specific Roundtables",
      "Public Awareness Campaigns",
      "Skill Development Programs",
      "Hackathons & Innovation Challenges",
      "Thought Leadership Publications"
    ]
  }
];

export const projects = [
  {
    title: "National Cybersecurity Framework",
    client: "Government Entity",
    description: "Designed and implemented a comprehensive cybersecurity framework for a major government sector, ensuring data sovereignty and resilience against advanced threats.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tags: ["Cybersecurity", "Governance", "Infrastructure"]
  },
  {
    title: "AI-Powered Predictive Maintenance",
    client: "Industrial Leader",
    description: "Developed a machine learning solution that predicts equipment failure with 95% accuracy, reducing downtime and maintenance costs significantly.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    tags: ["AI", "IoT", "Automation"]
  },
  {
    title: "Smart City Data Platform",
    client: "Urban Development Co.",
    description: "Built a scalable data lake and analytics platform to manage real-time data from millions of sensors across a new administrative capital.",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800",
    tags: ["Big Data", "Cloud", "Smart City"]
  },
  {
    title: "Enterprise ERP Modernization",
    client: "Retail Giant",
    description: "Migrated a legacy ERP system to a modern microservices architecture, improving performance by 300% and enabling real-time inventory tracking.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["Software Dev", "Cloud", "Microservices"]
  },
  {
    title: "Financial Fraud Detection System",
    client: "Leading Bank",
    description: "Implemented a real-time fraud detection engine using deep learning to identify suspicious transactions with minimal false positives.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    tags: ["FinTech", "AI", "Security"]
  },
  {
    title: "Digital Health Records Ecosystem",
    client: "Healthcare Provider",
    description: "Created a secure, interoperable health records platform that connects multiple hospitals and clinics, improving patient care coordination.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    tags: ["Healthcare", "Software Dev", "Security"]
  }
];
export const VENDORS = {
  AICERTS: { name: "AI CERTs", logo: "https://cdn.aicerts.ai/wp-content/uploads/2025/12/AI-CERTs-Logo-scaled.png" },
  PALO_ALTO: { name: "Palo Alto Networks", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/PaloAltoNetworks_2020_Logo.svg/1280px-PaloAltoNetworks_2020_Logo.svg.png" },
  FORTINET: { name: "Fortinet", logo: "https://techtorium.ac.nz/wp-content/uploads/2022/08/Fortinet-Logo.wine_.png" },
  INNOVERA: { name: "Innovera Academy", logo: "https://www.innoveracorp.com/images/logo.png" },
  COURSES_BY_INNOVERA: {
    name: "courses by innovera",
    logo: "/images/partners/courses-by-innovera.svg",
  },
  HANWHA: { name: "Hanwha", logo: "/images/partners/hanwha.png" },
  H3C: { name: "H3C", logo: "/images/partners/h3c.png" },
};
export const ACADEMY_VENDORS = {
  AICERTS: { name: "AI CERTs", logo: "https://cdn.aicerts.ai/wp-content/uploads/2025/12/AI-CERTs-Logo-scaled.png" },
  PALO_ALTO: { name: "Palo Alto Networks", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/PaloAltoNetworks_2020_Logo.svg/1280px-PaloAltoNetworks_2020_Logo.svg.png" },
  FORTINET: { name: "Fortinet", logo: "https://techtorium.ac.nz/wp-content/uploads/2022/08/Fortinet-Logo.wine_.png" },
  Cairo_University: { name: "Cairo University", logo: "https://static.cdnlogo.com/logos/c/33/cairo-university.svg" },
  AASTMT: { name: "AASTMT", logo: "https://upload.wikimedia.org/wikipedia/commons/d/da/AASTMT_Logo.png" },
  Engineering_Syndicate: { name: "Engineering Syndicate", logo: "https://i0.wp.com/eamc-engs.org/wp-content/uploads/2015/02/eea.jpg?ssl=1" },
};
export const TRACKS = [
  {
    id: "AI & Machine Learning",
    title: "AI & Machine Learning",
    description: "Master the future with foundational and applied AI, machine learning, and generative AI skills.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    icon: Brain,
    color: "from-purple-600 to-indigo-600",
    partner: "AI CERTs & Innovera Academy"
  },
  {
    id: "Cybersecurity",
    title: "Cybersecurity",
    description: "Defend networks and organizations with multi-vendor defense strategies and operations.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    icon: Shield,
    color: "from-blue-600 to-cyan-600",
    partner: "Palo Alto / Fortinet & Innovera Academy"
  },
  {
    id: "Software Development",
    title: "Software Development",
    description: "Build scalable applications, collaborate in squads, and create immersive game experiences.",
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800",
    icon: Code,
    color: "from-emerald-500 to-teal-600",
    partner: "Innovera Academy & Innovera Labs"
  },
  {
    id: "Professional & Business Skills",
    title: "Professional Skills",
    description: "Enhance digital marketing, entrepreneurship, and workplace readiness for the digital age.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    icon: Users,
    color: "from-orange-500 to-amber-600",
    partner: "Innovera Academy & Innovera Business"
  }
];
