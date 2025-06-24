'use server';

import PuppeteerHTMLPDF from 'puppeteer-html-pdf';
import fs from 'fs';
import path from 'path';
import { DocumentData } from '@/types/document';
import { parseUserForm } from '../openai';

const templatePath = path.join(
  process.cwd(),
  'src/lib/pdf/templates/cv_template.html'
);

const savePath = path.join(process.cwd(), 'src/lib/pdf/test.pdf');

export const generatePDF = async (document: DocumentData) => {
  const userForm = await parseUserForm(document);
  if (!userForm) {
    throw new Error('User form is null');
  }

  const keys = {
    '{{applicantName}}': userForm.applicantName,
    '{{email}}': userForm.email,
    '{{phone}}': userForm.phone,
    // '{{website}}': userForm.website,
    '{{birthDate}}': userForm.currentAge,
    '{{country}}': userForm.country,
    '{{certificates}}': userForm.certificates,
    '{{additionalInfo}}': userForm.additionalInfo,
    '{{education}}': userForm.education,
    '{{languages}}': userForm.skills?.languages?.join(', ') || '-',
    '{{frameworks}}': userForm.skills?.frameworks?.join(', ') || '-',
    '{{databases}}': userForm.skills?.databases?.join(', ') || '-',
    '{{devOps}}': userForm.skills?.devOps?.join(', ') || '-',
    '{{other}}': userForm.skills?.other?.join(', ') || '-',
    '{{yearsOfExperience}}': userForm.yearsOfExperience,
    '{{whenReadyToWork}}': userForm.whenReadyToWork,
    '{{projects}}':
      userForm.projects && userForm.projects.length > 0
        ? userForm.projects
            .map(
              (project, index) => `
          <tr>
            <td rowspan="2" class="number-cell">${index + 1}</td>
            <td class="industry-cell">
                <p class="border-bottom additional-padding">${project.industry}</p>
                <p class="border-bottom additional-padding">${project.position}</p>
                <p class="additional-padding">${project.responsibilities?.join(',\n') || '-'}</p>
            </td>
            <td class="project-description">
                <div class="project-title">[${project.projectName}]</div>
                ${project.description}
            </td>
            <td class="os-cell">${project.operationSystem || '-'}</td>
            <td class="lang-cell">${project.skills?.join(',\n') || '-'}</td>
            <td class="db-cell">${project.database || '-'}</td>
            <td class="period-cell">
                <p class="border-bottom additional-padding">${project.startDate}</p>
                <p class="border-bottom additional-padding">${project.endDate}</p>
                <p class="additional-padding">${project.period}</p>
            </td>
            <td class="tech-stack">${project.skills?.join(', ') || '-'}</td>
          </tr>
          `
            )
            .join('')
        : '',
  };

  const htmlPDF = new PuppeteerHTMLPDF();
  htmlPDF.setOptions({
    format: 'A4' as const,
    path: savePath,
  });

  const content = fs.readFileSync(templatePath, { encoding: 'utf-8' });
  const contentWithData = Object.entries(keys).reduce((acc, [key, value]) => {
    if (value) {
      return acc.replace(key, value);
    }
    return acc;
  }, content);

  try {
    const res = await htmlPDF.create(contentWithData);
    return res;
  } catch (error) {
    console.log('PuppeteerHTMLPDF error', error);
  }
};
