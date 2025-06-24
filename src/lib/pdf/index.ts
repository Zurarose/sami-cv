'use server';

import chromium from '@sparticuz/chromium';
import PuppeteerHTMLPDF from 'puppeteer-html-pdf';
import { DocumentData } from '@/types/document';
import { parseUserForm } from '../openai';
import { cvTemplate } from './templates/cv_template';

// import fs from 'fs';
// import path from 'path';
// const outputPath = path.join(
//   process.cwd(),
//   'src/lib/pdf/templates/review_template.html'
// );

export const generatePDF = async (document: DocumentData) => {
  const photo = document.photo;
  delete document.photo;
  const userForm = await parseUserForm(document);
  if (!userForm) {
    throw new Error('User form is null');
  }

  const keys = {
    '{{applicantName}}': userForm.applicantName,
    '{{email}}': userForm.email || '-',
    '{{phone}}': userForm.phone || '-',
    '{{photo}}': photo || '#',
    '{{birthDate}}': userForm.currentAge,
    '{{country}}': userForm.country || '-',
    '{{certificates}}': userForm.certificates || '-',
    '{{additionalInfo}}': userForm.additionalInfo || '-',
    '{{education}}': userForm.education || '-',
    '{{languages}}': userForm.skills?.languages?.join(', ') || '-',
    '{{frameworks}}': userForm.skills?.frameworks?.join(', ') || '-',
    '{{databases}}': userForm.skills?.databases?.join(', ') || '-',
    '{{devOps}}': userForm.skills?.devOps?.join(', ') || '-',
    '{{other}}': userForm.skills?.other?.join(', ') || '-',
    '{{yearsOfExperience}}': userForm.yearsOfExperience || '-',
    '{{whenReadyToWork}}': userForm.whenReadyToWork || '-',
    '{{projects}}':
      userForm.projects && userForm.projects.length > 0
        ? userForm.projects
            .map(
              (project, index) => `
                <tr>
                  <td class="number-cell">${index + 1}</td>
                  <td class="industry-cell">
                      <p class="border-bottom additional-padding" contenteditable="true">${project.industry}</p>
                      <p class="border-bottom additional-padding" contenteditable="true">${project.position}</p>
                      <p class="additional-padding" contenteditable="true">${project.responsibilities?.join(',') || '-'}</p>
                  </td>
                  <td class="project-description">
                      <div class="project-title" contenteditable="true">[${project.projectName}]</div>
                      <div class="project-description" contenteditable="true">${project.description}</div>
                  </td>
                  <td class="os-cell" contenteditable="true">${project.operationSystem || '-'}</td>
                  <td class="lang-cell" contenteditable="true">${project.languages?.join(',\n') || '-'}</td>
                  <td class="db-cell" contenteditable="true">${project.database || '-'}</td>
                  <td class="period-cell">
                      <p class="border-bottom additional-padding" contenteditable="true">${project.startDate}</p>
                      <p class="border-bottom additional-padding" contenteditable="true">${project.endDate}</p>
                      <p class="additional-padding" contenteditable="true">${project.period}</p>
                  </td>
                  <td class="tech-stack" contenteditable="true">${project.skills?.join(',\n') || '-'}</td>
                </tr>
            `
            )
            .join('\n')
        : '',
  };

  const contentWithData = Object.entries(keys).reduce((acc, [key, value]) => {
    if (value) {
      return acc.replace(key, value);
    }
    return acc;
  }, cvTemplate);

  // const htmlFile = new File([contentWithData], 'cv.html', {
  //   type: 'text/html',
  // });
  // const text = await htmlFile.text();
  // if (fs.existsSync(outputPath)) {
  //   fs.unlinkSync(outputPath);
  // }
  // fs.writeFileSync(outputPath, text);

  console.log(process.env.NODE_ENV);

  try {
    const htmlPDF = new PuppeteerHTMLPDF();
    htmlPDF.setOptions({
      format: 'A4' as const,
      headless: false,
      args: ['--no-sandbox'],
      ...(process.env.NODE_ENV === 'production' && {
        executablePath: await chromium.executablePath(),
      }),
    });
    const res = await htmlPDF.create(contentWithData);
    return res;
  } catch (error) {
    console.log('PuppeteerHTMLPDF error', error);
  }
};
