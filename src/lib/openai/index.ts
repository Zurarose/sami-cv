'use server';

import { OpenAI } from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import pdf from 'pdf-parse';
import { createDocument } from '../../actions/document';
import { Document, pdfUserFormSchema } from '../validators';
import { DocumentData } from '@/types/document';

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

    console.log(text);

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
    });
  }
  return true;
};

export const parseUserForm = async (form: DocumentData) => {
  const response = await openai.responses.parse({
    model: 'gpt-5-mini',
    input: [
      {
        role: 'system',
        content:
          'You are text parser. You will be given a JSON object with CV \ Resume of Developer. You will need to parse the file and return the data according to the schema. Be very accurate and check yourself before you return the data',
      },
      { role: 'user', content: JSON.stringify(form) },
    ],
    text: {
      format: zodTextFormat(pdfUserFormSchema, 'document'),
    },
  });

  return response.output_parsed;
};
