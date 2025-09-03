export type Experience = {
  title: string; company: string; date: string; points: string[];
  logoUrl?: string; // optional company mark
  bannerColor?: string; // e.g. '#0b3a8f'
}

export type Project = {
  name: string;
  blurb: string;
  tags: string[];
  link?: string;
  imageUrl?: string;
  videoUrl?: string;
  date: string;
}

export const experiences: Experience[] = [
  {
    title: "Software Engineer Intern",
    company: "Cedars-Sinai",
    date: "Mar 2025 – Present",
    bannerColor: "#1d2a52",
    logoUrl: "public/cedars_logo.png",
    points: [
      "Built a React Native app with Expo to allow doctors to review and visualize medical device test data.",
      "Developed a FastAPI (Python) backend to integrate microsecond-precise InfluxDB time-series data with test metadata from a MySQL database, enabling researchers to effectively search by subject attributes.",
      "Engineered a telemetry pipeline in C++ on an Arduino Giga R1 Wi-Fi to stream signal data over TCP, cutting app ingestion from 7 to 1.5 minutes, with data logged to InfluxDB on an AWS Timestream instance.",
      "Implemented a computer vision algorithm combining image segmentation, mask refinement, and multiple interpolation methods to restore oversaturated surgical images, recovering 47% of unusable data for analysis."
    ]
  },
  {
    title: "Software Engineer - DAQ Firmware",
    company: "UCLA Formula SAE",
    date: "Jun 2025 – Present",
    bannerColor: "#042c2b",
    logoUrl: "public/bfr_logo.png",
    points: [
      "Designing a race car data acquisition system using STM32-based sensors to collect vehicle data in real-time.",
      "Building a computer vision system into vehicle to measure slip angle, reduce costs, and improve performance.",
      "Built a timekeeper with React and Go to display real-time subteam work metrics and track build progress.",
    ]
  },
  {
    title: "Software Engineer - Data Visuals",
    company: "UCLA Formula SAE",
    date: "Jun 2024 – Jun 2025",
    bannerColor: "#042c2b",
    logoUrl: "public/bfr_logo.png",
    points: [
      "Automated CAN-bus sensor parsing on a Raspberry Pi CM4 using python-can, scripting startup routines to decode DBC messages, stream data into InfluxDB, and log backups to CSV on local memory.",
      "Built and deployed a RF telemetry service in Python to transmit sensor data to an RF receiver with sub-112 ms latency, running automatically on boot for continuous data flow.",
      "Spearheaded full-stack dashboard app with React, Node.js, and Grafana, enabling live diagnostics for the first time in team history and reducing data analysis time by 87% based on internal reports."
    ]
  },
  {
    title: "Software Engineer Intern",
    company: "Be Together Hub",
    date: "Jan 2025 – May 2025",
    bannerColor: "#1d2a52",
    logoUrl: "public/bth_logo.png",
    points: [
      "Created web pages using React for a Google-funded nonprofit, reducing UI bug reports by 24%.",
      "Designed responsive UI with Tailwind, ensuring therapy access for 673+ users across web and mobile."
    ]
  },
  {
    title: "Data Engineer",
    company: "Bruin Sports Analytics",
    date: "Sep 2024 – Present",
    bannerColor: "#042c2b",
    logoUrl: "public/bsa_logo.png",
    points: [
      "Scripted a HTML/CSS scouting report template for weekly analysis of upcoming tennis matches and opponents, presented directly to the UCLA D1 Tennis Team.",
      "Constructed a pandas-based ETL pipeline to ingest, clean, and normalize raw HTML from 47+ matches, eliminating over 53 hours of manual data acquisition and exporting analysis-ready CSVs for team analysts.",
      "Built a Selenium web scraper to traverse pages and extract match details, reducing analysis time by 73.1%."
    ]
  }
];

export type Education = {
  institution: string;
  degree: string;
  years: string;
  gpa: string;
  logoUrl?: string;
  details: string[];
}

export const education: Education[] = [
  {
    institution: "University of California, Los Angeles (UCLA)",
    degree: "Bachelor of Science in Computer Science",
    years: "2022-2026",
    gpa: "GPA 3.7",
    logoUrl: "public/ucla_logo.png",
    details: [
      "Technical Breadth in Technology Management",
      "Scientific Breadth in Electrical and Computer Engineering", 
    ]
  },
  {
    institution: "Trabuco Hills High School",
    degree: "High School Diploma",
    years: "2019-2023",
    gpa: "GPA 4.9",
    logoUrl: "public/thhs.png",
    details: [
    ]
  }
]

export const currentCoursework: string[] = [
  'CS 131 - Programming Languages',
  'CS 180 - Advanced Algorithms',
  'EC ENGR 209AS - IoT Device Security',
  'EC ENGR 100 - Circuit Theory',

  'CS 111 - Operating Systems Principles',
  'CS M146 - Machine Learning',
  'CS 35L - Software Construction',
  'CS 33 - Computer Architecture',
  'CS 32 - Data Structures and Algorithms',
  'CS 31 - Object Oriented Programming in C++'
]

export const projects: Project[] = [
  {
    name: 'Sixxer Freelance App',
    blurb: 'Built a full stack web app enabling UCLA students to post and accept freelance jobs, with secure authentication, user dashboards, and a dynamic leaderboard, supporting 156+ job transactions during testing stages. Engineered secure RESTful APIs and multi-collection data models using Spring Boot, MongoDB, and Maven, implementing user authentication, job endpoints, leaderboard logic, and a job stats tracking system.',
    tags: ['Java', 'Spring Boot', 'React', 'MongoDB'],
    link: 'https://github.com/yourusername/sixxer-app',
    videoUrl: 'public/sixxer_demo.mp4',
    date: 'Mar 2025 – Present'
  },
  {
    name: 'RF Device Classifier',
    blurb: 'Built an RF device classifier on IQ WiFi signals using a PyTorch CNN, achieving 94.1% validation accuracy. Contributed to adversarial RF spoofing research by integrating the classifier into a targeted PGD+EOT attack framework, achieving 89.4% spoofed confidence at 2.5 meter offset in over-the-air evaluations.',
    tags: ['Python', 'PyTorch', 'Seaborn'],
    link: 'https://github.com/yourusername/price-predictor',

    imageUrl: 'public/rf_classifier_screenshot.png',
    date: 'Feb 2025 – Mar 2025'
  },
  {
    name: 'Binary Price Predictor',
    blurb: 'Built a yfinance API pipeline to fetch oil prices into a pandas DataFrame and compute 19 indicators. Developed PyTorch RNNs with dropout and early stopping, achieving 55%+ accuracy on unseen prices.',
    tags: ['Python', 'PyTorch', 'pandas'],
    link: 'https://github.com/yourusername/rf-classifier',

    imageUrl: 'public/price_predictor_screenshot.png',
    date: 'Dec 2024 – Mar 2025'
  }
]


