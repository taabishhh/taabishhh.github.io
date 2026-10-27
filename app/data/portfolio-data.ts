export type Link = { label: string; href: string };

export type Role = {
  org: string;
  team: string;
  title: string;
  period: string;
  place: string;
  points: string[];
  stack: string[];
};

export type Project = {
  id: string;
  name: string;
  period: string;
  kind: string;
  problem: string;
  built: string;
  result: string;
  stack: string[];
  links: Link[];
  figure:
    | { type: "image"; src: string; alt: string; caption: string }
    | { type: "log"; caption: string; lines: string[] };
};

export const profile = {
  name: "Taabish Sutriwala",
  short: "Taabish",
  role: "Software Engineer",
  tagline: "Software engineer building cloud, mobile and AI systems.",
  intro:
    "I currently lead development of a clinical gait-analysis platform at the University of Illinois Chicago, turning raw patient video into joint angles researchers can trust. Before that I spent two years shipping IoT-connected Flutter apps at Capgemini.",
  status: "Open to software engineering roles",
  location: "USA",
  email: "taabish10s@gmail.com",
  phone: "+1 (872) 279-0652",
  github: "https://github.com/taabishhh",
  linkedin: "https://www.linkedin.com/in/taabish/",
  site: "https://taabish.tech",
};

export const roles: Role[] = [
  {
    org: "University of Illinois Chicago",
    team: "Cognitive, Motor & Balance Rehabilitation Lab",
    title: "Research Specialist (Software Development)",
    period: "Feb 2025 — Present",
    place: "USA",
    points: [
      "Lead development of the lab's clinical gait-analysis platform, from the video pipeline to the app researchers use every day.",
      "Built a Python pipeline that extracts joint markers from video and computes biomechanical angles; containerized it on AWS ECS/ECR with Lambda + S3 triggers, cutting processing from 15 to 3 minutes.",
      "Shipped a cross-platform Flutter app (Cognito, API Gateway, DynamoDB) to Google Play and the App Store for clinical testing.",
      "Designed a HIPAA-compliant S3 + IAM architecture for sensitive patient video; GitHub Actions CI/CD cut release cycles by 60%.",
      "Own technical decisions, mentor Research Assistants on related projects, and contribute technical input to grant applications.",
    ],
    stack: ["Python", "OpenCV", "AWS ECS/ECR", "Lambda", "S3", "DynamoDB", "Cognito", "Flutter", "GitHub Actions"],
  },
  {
    org: "Capgemini",
    team: "Medical & Life Sciences",
    title: "Senior Software Engineer",
    period: "Jul 2022 — Jul 2024",
    place: "Mumbai, India",
    points: [
      "Shipped production Flutter apps for iOS and Android; optimized state management and paginated APIs cut response handling time by 30%.",
      "Engineered BLE pairing and MQTT real-time messaging for 15+ IoT device types, reducing sync latency by about 40%.",
      "Built over-the-air firmware updates via Firebase Cloud Messaging, so devices update from the app in under 10 minutes instead of one by one by hand.",
      "Led CI/CD and release pipelines on Bitbucket, running Play closed testing and TestFlight, and enforced secure coding with unit and integration tests.",
    ],
    stack: ["Flutter", "Dart", "BLE", "MQTT", "Firebase", "Bitbucket", "TestFlight"],
  },
];

export const projects: Project[] = [
  {
    id: "kube-agent",
    name: "Autonomous Kubernetes Incident Response Agent",
    period: "Jul — Aug 2026",
    kind: "AI · SRE · Infrastructure",
    problem:
      "On-call engineers lose minutes correlating logs and metrics before they even start fixing an outage.",
    built:
      "A LangGraph agent with an MCP server exposing kubectl, Helm and Prometheus. It diagnoses root causes and runs remediations through a safelisted policy layer. The cluster and monitoring stack are reproducible Terraform.",
    result:
      "MTTR fell from 16 to 3.5 min across 15 injected failures, with 93% successful auto-remediation and zero unauthorized actions.",
    stack: ["LangGraph", "MCP", "Kubernetes", "Helm", "Prometheus", "Grafana", "Terraform"],
    links: [
      { label: "View code", href: "https://github.com/taabishhh/ai-sre-agent.git" },
    ],
    figure: {
      type: "log",
      caption: "Fig. A: one simulated incident, condensed",
      lines: [
        "00:00  ALERT  checkout-api p99 latency > 2s",
        "00:14  agent  pull metrics · prometheus",
        "00:31  agent  pod restarts=7  reason=OOMKilled",
        "00:52  agent  root cause → memory limit 256Mi",
        "01:05  policy helm upgrade --set mem=512Mi  ✓ safelisted",
        "03:30  OK     latency nominal · incident closed",
      ],
    },
  },
  {
    id: "llm-cloud",
    name: "LLM in a Distributed Cloud Environment",
    period: "Sep — Dec 2024",
    kind: "Distributed systems · NLP",
    problem:
      "Preparing a 14 GB corpus and serving a conversational model is too slow and fragile on a single machine.",
    built:
      "A Hadoop/Spark + DeepLearning4J pipeline on EMR (BPE tokenization, Word2Vec, positional embeddings), plus a Scala chat microservice on Lambda, API Gateway, EC2, Bedrock and Ollama, served over gRPC in Docker.",
    result:
      "Preprocessing was 62% faster than single-node. Responses average 800 ms, and the service handles 300+ concurrent requests with 35% lower latency than REST.",
    stack: ["Scala", "Hadoop", "Spark", "AWS EMR", "Bedrock", "gRPC", "Docker"],
    links: [
      { label: "Code: Preprocessing", href: "https://github.com/taabishhh/LLM_Preprocessing" },
      { label: "Code: Training", href: "https://github.com/taabishhh/LLM_Training" },
      { label: "Code: Deployment", href: "https://github.com/taabishhh/LLM_Deployment" },
      { label: "Demo video", href: "https://www.youtube.com/watch?v=aUt2Pgsak_0" },
    ],
    figure: {
      type: "image",
      src: "/llm1.webp",
      alt: "Diagram of the tokenization and decoder-only transformer pipeline",
      caption: "Fig. B: tokens to embeddings to a decoder-only transformer",
    },
  },
  {
    id: "deepfake",
    name: "Deepfake Detection with Fairness-Aware Bias Mitigation",
    period: "Feb — May 2025",
    kind: "Computer vision · Responsible AI",
    problem:
      "A detector that is accurate on average can still fail some groups of people much more often than others.",
    built:
      "A two-stage CNN fine-tuned on 12,400 FaceForensics++ facial-region frames, audited with Fairlearn, then retrained with reweighing.",
    result:
      "84.1% accuracy. The racial subgroup gap shrank from 15.5 to 4.7 points and Equalized Odds Difference dropped 90%, with accuracy held at 83.6%.",
    stack: ["PyTorch", "OpenCV", "Fairlearn", "Scikit-learn", "Pandas"],
    links: [{ label: "View code", href: "https://github.com/taabishhh/deepfake-detection" }],
    figure: {
      type: "image",
      src: "/deepfake1.webp",
      alt: "Notebook output showing heatmaps over detected faces with real/fake predictions",
      caption: "Fig. C: attention heatmaps on real vs. fake frames",
    },
  },
  {
    id: "tpo",
    name: "Training & Placement Office Portal",
    period: "Jun — Jul 2022",
    kind: "Full-stack · Mobile",
    problem:
      "Placement staff tracked 45+ recruiting companies and hundreds of applications through spreadsheets and email.",
    built:
      "An admin web portal (React, Tailwind, Node.js, MongoDB) for posting openings, and a Flutter student app (GetX, Firebase Auth) running on the same backend.",
    result: "Used by 320+ students each placement cycle; manual application tracking down 40%.",
    stack: ["React", "Node.js", "MongoDB", "Flutter", "GetX", "Firebase"],
    links: [],
    figure: {
      type: "image",
      src: "/tpo-web1.webp",
      alt: "Admin portal listing job openings with role, location and deadline",
      caption: "Fig. D: admin view of live openings",
    },
  },
  {
    id: "cryptlert",
    name: "Cryptlert",
    period: "2021",
    kind: "Mobile",
    problem: "Checking crypto prices by hand all day is tedious.",
    built:
      "A Flutter app with Google Sign-In, real-time price tracking over REST and custom threshold alerts, on iOS and Android.",
    result: "My first app with the full loop of design, auth, live data and notifications.",
    stack: ["Flutter", "Dart", "Firebase", "REST"],
    links: [{ label: "View code", href: "https://github.com/Raunak-Taabish/crypto_alert" }],
    figure: {
      type: "image",
      src: "/cryptlert1.webp",
      alt: "Grid of Cryptlert app screens in dark mode",
      caption: "Fig. E: onboarding and main screens",
    },
  },
];

export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Dart", "Scala", "SQL"] },
  { group: "Cloud", items: ["AWS ECS / ECR / EC2", "Lambda", "S3", "API Gateway", "DynamoDB", "Cognito", "EMR", "Bedrock"] },
  { group: "Infra & DevOps", items: ["Docker", "Kubernetes", "Helm", "Terraform", "Prometheus", "Grafana", "GitHub Actions", "Bitbucket", "SourceTree"] },
  { group: "Mobile & Web", items: ["Flutter", "React", "Next.js", "Node.js", "Express", "Tailwind", "Material UI"] },
  { group: "Data & AI", items: ["LangGraph", "MCP", "PyTorch", "TensorFlow", "OpenCV", "Scikit-learn", "Fairlearn", "Spark", "Hadoop"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Firebase"] },
];

export const education = [
  {
    school: "University of Illinois Chicago",
    degree: "M.S. Computer Science",
    period: "2024 — May 2026",
    gpa: "3.89",
    detail: "Distributed Objects in Cloud Computing · Advanced DBMS · Advanced SE · Responsible Data Science · Deep Learning for CV · Reinforcement Learning",
  },
  {
    school: "University of Mumbai",
    degree: "B.E. Information Technology",
    period: "2019 — 2022",
    gpa: "3.67",
    detail: "DBMS · Advanced Data Management · Cloud Computing & Services",
  },
  {
    school: "Shri Bhagubhai Mafatlal Polytechnic",
    degree: "Diploma, Computer Engineering",
    period: "2016 — 2019",
    gpa: "3.62",
    detail: "",
  },
];
