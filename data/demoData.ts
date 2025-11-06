
import { AnalysisResult } from '../types';

export const demoSoftwareEngineer: AnalysisResult = {
    matchScore: 88,
    summary: "The candidate is a strong fit for the Senior Software Engineer role, demonstrating extensive experience in React, Node.js, and cloud platforms like AWS. The resume showcases a proven ability to lead projects and deliver scalable solutions, aligning well with the job's key requirements.",
    strengths: [
        "Over 5 years of experience with the MERN stack (MongoDB, Express, React, Node.js), directly matching the core technology requirement.",
        "Proven experience with AWS services (EC2, S3, Lambda), as mentioned in the job description.",
        "Leadership experience demonstrated by mentoring junior developers and leading a project to completion.",
        "Strong understanding of CI/CD pipelines and DevOps practices."
    ],
    improvements: [
        "Quantify achievements further. For example, instead of 'Improved API performance,' use 'Reduced API latency by 40% by implementing caching strategies.'",
        "Add a dedicated 'Skills' section that explicitly lists technologies like 'Docker', 'Kubernetes', and 'TypeScript' which are mentioned in the job description but only implied in the resume.",
        "Tailor the project descriptions to use similar phrasing as the job description, such as 'agile environment' and 'cross-functional teams'."
    ],
    missingKeywords: [
        "GraphQL",
        "TypeScript",
        "Kubernetes",
        "Microservices Architecture",
        "Agile Methodologies"
    ]
};

export const demoProductManager: AnalysisResult = {
    matchScore: 76,
    summary: "A promising candidate for the Product Manager position with a solid background in user research and product lifecycle management. While the technical skills are present, the resume could be strengthened by highlighting data-driven decision making and stakeholder management more explicitly.",
    strengths: [
        "Experience managing a product from ideation to launch, demonstrating full-cycle ownership.",
        "Strong skills in user research and usability testing, which is a key requirement.",
        "Familiarity with Agile and Scrum methodologies for product development.",
        "Proficient with product management tools like JIRA and Confluence."
    ],
    improvements: [
        "Incorporate metrics to show the impact of product features. For instance, 'Led the launch of a new feature that increased user engagement by 20%.'",
        "Explicitly mention experience with A/B testing and data analysis tools (e.g., Mixpanel, Google Analytics) to showcase a data-driven approach.",
        "Add a bullet point about communication with stakeholders, including engineering, design, and marketing teams."
    ],
    missingKeywords: [
        "A/B Testing",
        "Go-to-market strategy",
        "Product Roadmap",
        "KPIs",
        "Stakeholder Management"
    ]
};

export const demoData = {
    softwareEngineer: demoSoftwareEngineer,
    productManager: demoProductManager,
};