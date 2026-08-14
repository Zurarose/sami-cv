'use server';

import { OpenAI } from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { extractPdfText } from '../pdf/extract-text';
import { createDocument } from '../../actions/document';
import { Document, pdfUserFormSchema } from '../validators';
import { DocumentData } from '@/types/document';
import { getInstruction } from '@/actions/instraction';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const parseCVDocument = async (formData: FormData) => {
  const id = formData.get('id') as string;
  const files = formData.getAll('files') as File[];

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const text = await extractPdfText(Buffer.from(buffer));

    const response = await openai.responses.parse({
      model: 'gpt-5-mini',
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
    //todo: remove this
    await createDocument({
      folderId: id,
      version: 1,
      name: response.output_parsed?.applicantName || file.name,
      data: response.output_parsed,
      summary: '',
    });
  }
  return true;
};

export const parseUserForm = async (form: DocumentData) => {
  const instruction = await getInstruction();

  const response = await openai.responses.parse({
    model: 'gpt-5-mini',
    input: [
      {
        role: 'system',
        content:
          'You are text parser. You will be given a JSON object with CV \ Resume of Developer. You will need to parse the file and return the data according to the schema. Be very accurate and check yourself before you return the data.' +
          instruction?.content
            ? `Add instructions. This instuctions are the most important for the parser. Follow them strictly: ${instruction?.content}`
            : '',
      },
      { role: 'user', content: JSON.stringify(form) },
    ],
    text: {
      format: zodTextFormat(pdfUserFormSchema, 'document'),
    },
  });

  return response.output_parsed;
};

export const generateSummary = async (data: DocumentData) => {
  const response = await openai.responses.create({
    model: 'gpt-5-mini',
    input: [
      {
        role: 'system',
        content: `You are a summary generator. You will be given a json data and you will need to generate a summary of the CV. What you should give in the result: 
          - Stack
          - Number of years of experience
          - Education
          - Main areas of work + strengths
          Up to 4 sentences.
          `,
      },
      { role: 'user', content: JSON.stringify(data) },
    ],
  });
  return response.output_text;
};
