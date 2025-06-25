import { z } from 'zod';

export const MAX_NAME_LENGTH = 100;

export const createFolderSchema = z.object({
  folderName: z
    .string()
    .min(2, {
      message: 'Folder name must be at least 2 characters.',
    })
    .max(20, {
      message: 'Folder name must be less than 20 characters.',
    }),
});

/**
 * Form validation schema
 *
 */
export const userFormSchema = z.object({
  applicantName: z
    .string()
    .min(1, 'Name is required')
    .max(MAX_NAME_LENGTH, 'Name must be less than 100 characters'),
  birthDate: z.string().min(1, 'Birth date is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  website: z.string().url('Invalid website URL').optional(),
  country: z.string().min(1, 'Country is required'),
  photo: z.string().optional(),
  certificates: z.string().optional(),
  additionalInfo: z.string().optional(),
  skills: z.array(z.string()).min(1, 'Skills are required'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  whenReadyToWork: z.string().min(1, 'When ready to work is required'),
  experiences: z.array(
    z.object({
      companyName: z
        .string()
        .min(1, 'Company name is required')
        .max(MAX_NAME_LENGTH, 'Company name must be less than 100 characters'),
      position: z.string().min(1, 'Position is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      description: z.string().min(1, 'Description is required'),
    })
  ),
  education: z.array(
    z.object({
      schoolName: z
        .string()
        .min(1, 'School name is required')
        .max(MAX_NAME_LENGTH, 'School name must be less than 100 characters'),
      degree: z.string().min(1, 'Degree is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
    })
  ),
  projects: z.array(
    z.object({
      projectName: z
        .string()
        .min(1, 'Project name is required')
        .max(MAX_NAME_LENGTH, 'Project name must be less than 100 characters'),
      description: z.string().min(1, 'Description is required'),
      position: z.string().min(1, 'Position is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      skills: z.array(z.string()),
      operationSystem: z.string().optional(),
      database: z.string().optional(),
      responsibilities: z
        .array(z.string())
        .min(1, 'Responsibilities are required'),
    })
  ),
});

/**
 * For openai
 *
 */
const Experience = z.object({
  companyName: z.string().describe('The name of the company'),
  position: z.string().describe('The position of the applicant'),
  startDate: z
    .string()
    .describe(
      'The start date of the experience. Date exampl format: "YYYY-MM" (2025-06)'
    ),
  endDate: z
    .string()
    .describe(
      'The end date of the experience. Date example format: "YYYY-MM" (2025-06)'
    ),
  description: z.string().describe('The short description of the experience'),
});

const Education = z.object({
  schoolName: z.string().describe('The name of the school'),
  degree: z.string().describe('The degree of the applicant'),
  startDate: z
    .string()
    .describe(
      'The start date of the education. Date example format: "YYYY-MM" (2025-06)'
    ),
  endDate: z
    .string()
    .describe(
      'The end date of the education. Date example format: "YYYY-MM" (2025-06)'
    ),
});

export const Document = z.object({
  country: z.string().describe('The country of the applicant'),
  email: z.string().describe('The email of the applicant'),
  phone: z.string().describe('The phone of the applicant'),
  website: z
    .string()
    .describe(
      'The website of the applicant. Should be http or https link. Example: https://www.google.com'
    ),
  applicantName: z.string().describe('The name of the applicant'),
  experiences: z.array(Experience).describe('The experiences of the applicant'),
  education: z.array(Education).describe('The education of the applicant'),
  skills: z.array(z.string()).describe('The skills of the applicant'),
});

/**
 * For pdf
 *
 */
export const pdfUserFormSchema = z.object({
  applicantName: z
    .string()
    .describe('The name of the applicant. Translate to Katakana'),
  currentAge: z.string().describe('The current age of the applicant'),
  email: z.string().describe('The email of the applicant'),
  phone: z.string().describe('The phone of the applicant'),
  // website: z.string().url('Invalid website URL').nullable(),
  country: z.string().describe('The country of the applicant'),
  certificates: z
    .string()
    .describe('The certificates of the applicant. Translate to Japanese')
    .nullable(),
  additionalInfo: z
    .string()
    .describe('The additional info of the applicant. Translate to Japanese')
    .nullable(),
  skills: z
    .object({
      languages: z
        .array(z.string())
        .describe(
          'Programming languages (not libs or frameworks) of the applicant'
        ),
      frameworks: z
        .array(z.string())
        .describe('The frameworks of the applicant (not libs)'),
      databases: z.array(z.string()).describe('The databases of the applicant'),
      devOps: z.array(z.string()).describe('The devOps of the applicant'),
      other: z.array(z.string()).describe('The other of the applicant'),
    })
    .nullable(),
  yearsOfExperience: z
    .string()
    .describe('The years of experience of the applicant'),
  whenReadyToWork: z
    .string()
    .describe('The when ready to work of the applicant. Translate to Japanese'),
  education: z
    .string()
    .describe('The highest education of the applicant. Translate to Japanese'),
  projects: z
    .array(
      z.object({
        industry: z
          .string()
          .describe(
            'The industry of the project based of project. For example: Web Development, Mobile Development, Backend Development, etc. Translate to Japanese. Important!'
          ),
        projectName: z
          .string()
          .describe(
            'The name of the project. Translate to Japanese if possible'
          ),
        description: z
          .string()
          .describe(
            'The description of the project. Translate to Japanese if possible'
          ),
        position: z
          .string()
          .describe(
            'The position of the project. Translate to Japanese. Important!'
          ),
        startDate: z.string().describe('The start date of the project'),
        period: z.string().describe('The period of the project in months'),
        endDate: z.string().describe('The end date of the project'),
        languages: z
          .array(z.string())
          .describe(
            'The programming languages of the project (not libs or frameworks)'
          ),
        skills: z
          .array(z.string())
          .describe('Skills of the project (not programming languages )')
          .nullable(),
        operationSystem: z
          .string()
          .describe('The operation system of the project')
          .nullable(),
        database: z.string().describe('The database of the project').nullable(),
        responsibilities: z
          .array(z.string())
          .describe(
            'The numbers (use only numbers!) of responsibilities of the project according to this list: (Responsibilities: １：Requirements definition、２：Basic logic design、３：Detailed (code structure and physical) design、４：Programming and Unit testing、５：Integration testing, ６：Maintenance、７：Operation、８：Other)'
          )
          .nullable(),
      })
    )
    .nullable(),
});
