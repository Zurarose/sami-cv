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

// Form validation schema
export const documentSchema = z.object({
  applicantName: z
    .string()
    .min(1, 'Name is required')
    .max(MAX_NAME_LENGTH, 'Name must be less than 100 characters'),
  birthDate: z.string().min(1, 'Birth date is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  website: z.string().url('Invalid website URL').optional(),
  country: z.string().min(1, 'Country is required'),
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
