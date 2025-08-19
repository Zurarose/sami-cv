'use server';

import { DocumentData } from '@/types/document';
import { parseUserForm } from '../openai';
import { cvTemplate } from './templates/cv_template_ja';
import * as puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';

// import fs from 'fs';
// import path from 'path';
// const outputPath = path.join(
//   process.cwd(),
//   'src/lib/pdf/templates/review_template.html'
// );

async function getBrowser() {
  let browser = null;

  if (process.env.NODE_ENV === 'development') {
    console.log('Development browser: ');
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none',
        '--disable-font-subpixel-positioning',
      ],
      headless: true,
    });
  }
  if (process.env.NODE_ENV === 'production') {
    // Load Japanese font instead of Chinese
    await chromium.font(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap'
    );
    console.log('Production browser with Japanese font loaded');
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--font-render-hinting=none',
        '--disable-font-subpixel-positioning',
        '--disable-gpu-sandbox',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  }
  return browser;
}

export const generateHTML = async (document: DocumentData) => {
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

  return contentWithData;
};

export const generatePDF = async (html: string) => {
  try {
    const browser = await getBrowser();
    if (!browser) {
      throw new Error('Browser is null');
    }
    const page = await browser.newPage();

    // Set content and wait for fonts to load
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Add a small delay to ensure fonts are fully loaded
    await page.evaluate(() => document.fonts.ready);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      width: 1920,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
      },
    });
    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.log('PuppeteerHTMLPDF error', error);
  }
};
