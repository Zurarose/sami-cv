export interface DocumentData {
  country: string;
  email: string;
  phone: string;
  website: string;
  applicantName: string;
  experiences: Array<{
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    schoolName: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  projects: Array<{
    projectName: string;
    description: string;
    position?: string;
    startDate: string;
    endDate: string;
    skills: string[];
    operationSystem?: string;
    database?: string;
    responsibilities: string[];
  }>;
}
