import { CareerRecommendation } from "./types";

export const BOARDS = ["CBSE", "ICSE", "State Board", "NIOS", "IB", "Cambridge"];

export const STREAMS = ["Science", "Commerce", "Arts"];

export const SUBJECT_COMBINATIONS = {
    Science: ["PCM (Physics, Chemistry, Maths)", "PCB (Physics, Chemistry, Biology)", "PCMB", "Other"],
    Commerce: ["With Maths", "Without Maths"],
    Arts: ["Humanities", "Fine Arts", "Psychology/Sociology", "Other"],
};

export const SKILLS = [
    "Analytical Thinking", "Creativity", "Communication", "Problem Solving",
    "Leadership", "Teamwork", "Technical Writing", "Public Speaking",
    "Design Sense", "Coding/Programming", "Data Analysis", "Critical Thinking"
];

export const INTEREST_DOMAINS = {
    Science: ["Technology", "Medicine", "Research", "Space", "Engineering", "Data Science"],
    Commerce: ["Finance", "Management", "Marketing", "Law", "Entrepreneurship", "Accountancy"],
    Arts: ["Psychology", "Design", "Journalism", "Public Policy", "Social Work", "Teaching"],
};

export const STATES_OF_INDIA = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
];

export const COURSES_DATA: CareerRecommendation[] = [
    {
        id: "eng-1",
        title: "B.Tech Computer Science",
        description: "Study of hardware, software, and the theoretical foundations of computing.",
        eligibility: "Science (PCM) with 60%+",
        duration: "4 Years",
        averageSalary: "₹6 - ₹15 LPA",
        topColleges: ["IIT Bombay", "IIT Delhi", "BITS Pilani", "NIT Trichy"],
        careerPath: ["Software Engineer", "Data Scientist", "System Architect"],
        tags: ["Tech", "PCM", "Science"]
    },
    {
        id: "med-1",
        title: "MBBS",
        description: "Professional degree in medicine and surgery for aspiring doctors.",
        eligibility: "Science (PCB) with 50%+ in NEET",
        duration: "5.5 Years",
        averageSalary: "₹8 - ₹20 LPA",
        topColleges: ["AIIMS New Delhi", "CMC Vellore", "JIPMER Pondicherry"],
        careerPath: ["Doctor", "Surgeon", "Medical Researcher"],
        tags: ["Medicine", "PCB", "Science"]
    },
    {
        id: "com-1",
        title: "Chartered Accountancy (CA)",
        description: "Professional course in accounting, auditing, and taxation.",
        eligibility: "Any stream (Commerce preferred)",
        duration: "5 Years",
        averageSalary: "₹7 - ₹25 LPA",
        topColleges: ["ICAI"],
        careerPath: ["Auditor", "Tax Consultant", "Financial Analyst"],
        tags: ["Finance", "Commerce"]
    },
    {
        id: "art-1",
        title: "Bachelor of Design (B.Des)",
        description: "Focused on various design disciplines like fashion, interior, or graphic design.",
        eligibility: "Any stream",
        duration: "4 Years",
        averageSalary: "₹4 - ₹12 LPA",
        topColleges: ["NID Ahmedabad", "NIFT Delhi", "IDC IIT Bombay"],
        careerPath: ["Graphic Designer", "Product Designer", "Art Director"],
        tags: ["Design", "Arts", "Creativity"]
    },
    {
        id: "sci-res",
        title: "B.Sc (Hons) Mathematics",
        description: "In-depth study of mathematical concepts and applications.",
        eligibility: "Science (PCM)",
        duration: "3 Years",
        averageSalary: "₹4 - ₹10 LPA",
        topColleges: ["ISI Kolkata", "Chennai Mathematical Institute", "D.U."],
        careerPath: ["Mathematician", "Actuary", "Research Scientist"],
        tags: ["Maths", "Science", "Research"]
    }
];

export const COLLEGES_DATA = [
    // Engineering / Tech - INDIA
    {
        id: 'clg-1',
        name: 'IIT Bombay',
        location: 'Mumbai',
        state: 'Maharashtra',
        isAbroad: false,
        fees: '₹8-10 Lakhs',
        cutoff: 98,
        entranceExam: 'JEE Advanced',
        tags: ['Top Tier', 'Research', 'IIT'],
        courses: ['B.Tech Computer Science', 'B.Tech Electrical']
    },
    {
        id: 'clg-2',
        name: 'IIT Madras',
        location: 'Chennai',
        state: 'Tamil Nadu',
        isAbroad: false,
        fees: '₹8-10 Lakhs',
        cutoff: 97,
        entranceExam: 'JEE Advanced',
        tags: ['NIRF #1', 'Innovation'],
        courses: ['B.Tech Computer Science', 'B.Tech Mechanical']
    },
    {
        id: 'clg-3',
        name: 'BITS Pilani',
        location: 'Pilani',
        state: 'Rajasthan',
        isAbroad: false,
        fees: '₹20-22 Lakhs',
        cutoff: 92,
        entranceExam: 'BITSAT',
        tags: ['Private', 'Entrepreneurship'],
        courses: ['B.Tech Computer Science', 'B.Tech Mechanical']
    },
    {
        id: 'clg-4',
        name: 'NIT Trichy',
        location: 'Trichy',
        state: 'Tamil Nadu',
        isAbroad: false,
        fees: '₹5-7 Lakhs',
        cutoff: 94,
        entranceExam: 'JEE Main',
        tags: ['Best NIT', 'Top Placement'],
        courses: ['B.Tech Computer Science', 'B.Tech ECE']
    },
    {
        id: 'clg-5',
        name: 'Vellore Institute of Technology',
        location: 'Vellore',
        state: 'Tamil Nadu',
        isAbroad: false,
        fees: '₹12-15 Lakhs',
        cutoff: 85,
        entranceExam: 'VITEEE',
        tags: ['Global Standards', 'Private'],
        courses: ['B.Tech Computer Science', 'B.Tech IT']
    },
    {
        id: 'clg-20',
        name: 'IIT Delhi',
        location: 'New Delhi',
        state: 'Delhi',
        isAbroad: false,
        fees: '₹8-10 Lakhs',
        cutoff: 98,
        entranceExam: 'JEE Advanced',
        tags: ['Capital City', 'High Placements'],
        courses: ['B.Tech Computer Science', 'B.Tech Textile']
    },
    {
        id: 'clg-21',
        name: 'IIT Kanpur',
        location: 'Kanpur',
        state: 'Uttar Pradesh',
        isAbroad: false,
        fees: '₹8-10 Lakhs',
        cutoff: 96,
        entranceExam: 'JEE Advanced',
        tags: ['Academic Excellence', 'IIT'],
        courses: ['B.Tech Computer Science', 'B.Tech Aerospace']
    },

    // Engineering / Tech - ABROAD
    {
        id: 'clg-6',
        name: 'MIT',
        location: 'Cambridge',
        state: 'USA',
        isAbroad: true,
        fees: '₹2.5 Cr',
        cutoff: 99,
        entranceExam: 'SAT/ACT + TOEFL',
        tags: ['Ivy League', 'Tech Giant'],
        courses: ['B.Tech Computer Science', 'Data Science']
    },
    {
        id: 'clg-7',
        name: 'Stanford University',
        location: 'California',
        state: 'USA',
        isAbroad: true,
        fees: '₹2.8 Cr',
        cutoff: 99,
        entranceExam: 'SAT/ACT',
        tags: ['Silicon Valley', 'Elite'],
        courses: ['B.Tech Computer Science', 'AI Specialization']
    },
    {
        id: 'clg-8',
        name: 'Oxford University',
        location: 'Oxford',
        state: 'UK',
        isAbroad: true,
        fees: '₹1.8 Cr',
        cutoff: 98,
        entranceExam: 'IELTS/TOEFL',
        tags: ['Oxford', 'World Heritage'],
        courses: ['B.Tech Computer Science', 'Mathematics']
    },
    {
        id: 'clg-22',
        name: 'Harvard University',
        location: 'Cambridge',
        state: 'USA',
        isAbroad: true,
        fees: '₹3 Cr',
        cutoff: 99,
        entranceExam: 'SAT/ACT',
        tags: ['Legacy', 'Leadership'],
        courses: ['B.Tech Computer Science', 'Bachelor of Design (B.Des)']
    },
    {
        id: 'clg-23',
        name: 'ETH Zurich',
        location: 'Zurich',
        state: 'Switzerland',
        isAbroad: true,
        fees: '₹20-30 Lakhs (Low)',
        cutoff: 95,
        entranceExam: 'IELTS/TOEFL',
        tags: ['Top European', 'Research'],
        courses: ['B.Tech Computer Science', 'Mechanical Engineering']
    },

    // Medical - INDIA
    {
        id: 'clg-9',
        name: 'AIIMS New Delhi',
        location: 'New Delhi',
        state: 'Delhi',
        isAbroad: false,
        fees: '₹6,000',
        cutoff: 99,
        entranceExam: 'NEET',
        tags: ['Best in India', 'Government'],
        courses: ['MBBS']
    },
    {
        id: 'clg-10',
        name: 'CMC Vellore',
        location: 'Vellore',
        state: 'Tamil Nadu',
        isAbroad: false,
        fees: '₹1.5 Lakhs',
        cutoff: 95,
        entranceExam: 'NEET',
        tags: ['Top Medical', 'Christian'],
        courses: ['MBBS']
    },
    {
        id: 'clg-11',
        name: 'Madras Medical College',
        location: 'Chennai',
        state: 'Tamil Nadu',
        isAbroad: false,
        fees: '₹1 Lakh',
        cutoff: 92,
        entranceExam: 'NEET',
        tags: ['Oldest', 'Government'],
        courses: ['MBBS']
    },
    {
        id: 'clg-12',
        name: 'JIPMER',
        location: 'Puducherry',
        state: 'Puducherry',
        isAbroad: false,
        fees: '₹50,000',
        cutoff: 96,
        entranceExam: 'NEET',
        tags: ['Autonomous', 'Premium'],
        courses: ['MBBS']
    },
    {
        id: 'clg-24',
        name: 'King George\'s Medical University',
        location: 'Lucknow',
        state: 'Uttar Pradesh',
        isAbroad: false,
        fees: '₹2 Lakhs',
        cutoff: 93,
        entranceExam: 'NEET',
        tags: ['Historical', 'Government'],
        courses: ['MBBS']
    },

    // Business / Commerce - INDIA
    {
        id: 'clg-13',
        name: 'SRCC Delhi',
        location: 'Delhi',
        state: 'Delhi',
        isAbroad: false,
        fees: '₹1 Lakh',
        cutoff: 98,
        entranceExam: 'CUET',
        tags: ['Commerce Peak', 'Elite'],
        courses: ['B.Com (Hons)', 'B.A. Economics (Hons)']
    },
    {
        id: 'clg-14',
        name: 'Loyola College',
        location: 'Chennai',
        state: 'Tamil Nadu',
        isAbroad: false,
        fees: '₹2 Lakhs',
        cutoff: 90,
        entranceExam: 'Merit Based',
        tags: ['Legacy', 'Stellar'],
        courses: ['B.Com (Hons)', 'BBA']
    },
    {
        id: 'clg-15',
        name: 'IIM Indore (IPM)',
        location: 'Indore',
        state: 'Madhya Pradesh',
        isAbroad: false,
        fees: '₹25 Lakhs',
        cutoff: 94,
        entranceExam: 'IPMAT',
        tags: ['Management', 'Elite'],
        courses: ['BBA', 'Management']
    },
    {
        id: 'clg-16',
        name: 'St. Stephen\'s College',
        location: 'Delhi',
        state: 'Delhi',
        isAbroad: false,
        fees: '₹1.5 Lakhs',
        cutoff: 98,
        entranceExam: 'CUET',
        tags: ['Humanities', 'Top Choice'],
        courses: ['B.A. Economics (Hons)', 'B.A. Psychology']
    },
    {
        id: 'clg-25',
        name: 'Christ University',
        location: 'Bangalore',
        state: 'Karnataka',
        isAbroad: false,
        fees: '₹8-10 Lakhs',
        cutoff: 88,
        entranceExam: 'Christ Entrance',
        tags: ['Bangalore Hub', 'Private'],
        courses: ['BBA', 'B.Com (Hons)']
    },

    // Design / Arts
    {
        id: 'clg-17',
        name: 'NID Ahmedabad',
        location: 'Ahmedabad',
        state: 'Gujarat',
        isAbroad: false,
        fees: '₹15 Lakhs',
        cutoff: 88,
        entranceExam: 'NID DAT',
        tags: ['Design King', 'Creative'],
        courses: ['Bachelor of Design (B.Des)']
    },
    {
        id: 'clg-18',
        name: 'NIFT Delhi',
        location: 'New Delhi',
        state: 'Delhi',
        isAbroad: false,
        fees: '₹12 Lakhs',
        cutoff: 82,
        entranceExam: 'NIFT Entrance',
        tags: ['Fashion Pioneer', 'Best Govt'],
        courses: ['Bachelor of Design (B.Des)', 'Fashion Tech']
    },
    {
        id: 'clg-19',
        name: 'Royal College of Art',
        location: 'London',
        state: 'UK',
        isAbroad: true,
        fees: '₹1.2 Cr',
        cutoff: 80,
        entranceExam: 'Portfolio + IELTS',
        tags: ['Design World #1'],
        courses: ['Bachelor of Design (B.Des)']
    },
    {
        id: 'clg-26',
        name: 'Parsons School of Design',
        location: 'New York',
        state: 'USA',
        isAbroad: true,
        fees: '₹2.2 Cr',
        cutoff: 85,
        entranceExam: 'Portfolio + SAT',
        tags: ['Art School', 'NYC'],
        courses: ['Bachelor of Design (B.Des)', 'Fine Arts']
    }
];
