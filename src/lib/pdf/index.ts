'use server';

import { DocumentData } from '@/types/document';
import { parseUserForm } from '../openai';
import { cvTemplate } from './templates/cv_template_ja';
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
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.default.launch({
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
    console.log('Launching production browser with chromium');
    const puppeteer = await import('puppeteer-core');

    // Get the executable path
    const executablePath = await chromium.executablePath();
    console.log('Chromium executable path:', executablePath);

    browser = await puppeteer.default.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      executablePath: executablePath,
      headless: true,
    });
  }
  return browser;
}

export const generateHTML = async (document: DocumentData) => {
  const photo = document.photo;
  if ('photo' in document) {
    delete (document as Partial<DocumentData>).photo;
  }
  const userForm = await parseUserForm(document);
  if (!userForm) {
    throw new Error('User form is null');
  }

  for (const field in userForm) {
    const value = userForm[field as keyof typeof userForm];
    if (typeof value === 'string') {
      // Trim and normalize spaces
      let cleanedValue = value.trim();

      // For applicantName, remove excessive spaces and clean up around newlines
      cleanedValue = cleanedValue
        .replace(/\s*\n\s*/g, '\n') // Remove spaces around newlines
        .replace(/ {2,}/g, ' '); // Replace multiple spaces with single space

      userForm[field as keyof typeof userForm] = cleanedValue as never;
    }
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
            .map((project, index) =>
              `
                <tr class="project-row">
                  <td class="number-cell">${index + 1}</td>
                  <td class="industry-cell">
                      <p class="border-bottom additional-padding" contenteditable="true">${project.industry}</p>
                      <p class="border-bottom additional-padding" contenteditable="true">${project.position}</p>
                      <p class="additional-padding" contenteditable="true">${project.responsibilities?.join(',') || '-'}</p>
                  </td>
                  <td class="project-description">
                      <div class="project-title"><span contenteditable="true">${project.companyName}</span></div>
                      <div class="project-title"><span contenteditable="true">${project.projectName}</span></div>
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
            `.replaceAll(
                'additional-padding',
                project.description.length <= 300
                  ? 'additional-padding-small'
                  : 'additional-padding'
              )
            )
            .join('\n')
        : '',
  };

  const contentWithData = Object.entries(keys).reduce((acc, [key, value]) => {
    if (value) {
      // Remove leading newlines from value
      const cleanedValue =
        typeof value === 'string' ? value.replace(/^\n+/, '') : value;
      return acc.replace(key, cleanedValue);
    }
    return acc;
  }, cvTemplate);

  // Remove excessive consecutive spaces (3 or more spaces become 2 spaces)
  const cleanedContent = contentWithData.replace(/ {3,}/g, '  ');

  return cleanedContent;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (page as any).evaluate(() => document.fonts.ready);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      width: 1920,
      outline: true,
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
