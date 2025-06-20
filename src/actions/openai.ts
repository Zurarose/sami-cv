'use server';

import { OpenAI } from 'openai';
import z from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';
import pdf from 'pdf-parse';
import { createDocument } from './documents';

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

const Document = z.object({
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const parseCVDocument = async (formData: FormData) => {
  const id = formData.get('id') as string;
  const files = formData.getAll('files') as File[];

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const data = await pdf(Buffer.from(buffer));

    const text = data.text;

    const response = await openai.responses.parse({
      model: 'gpt-4o-2024-08-06',
      input: [
        {
          role: 'system',
          content:
            'You are text parser. You will be given a file with CV \ Resume of Developer. You will need to parse the file and return the data according to the schema.',
        },
        { role: 'user', content: text },
      ],
      text: {
        format: zodTextFormat(Document, 'document'),
      },
    });

    await createDocument({
      folderId: id,
      version: 1,
      name: response.output_parsed?.applicantName || file.name,
      data: response.output_parsed,
    });
  }
  return true;
};
