'use client';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constant/messages';
import { generateHTML, generatePDF } from '@/lib/pdf';
import { DocumentData } from '@/types/document';
import { Button } from '@/ui-kit/basic/button';
import { Download, Link, Loader2, RefreshCw, FileText } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { generateSummary } from '@/lib/openai';
import { updateDocument } from '@/actions/document';
import { useRouter } from 'next/navigation';

export const LinkButton = ({ link }: { link: string }) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success(SUCCESS_MESSAGES.LinkCopied);
  };

  return (
    <Button variant="outline" onClick={handleCopyToClipboard}>
      <Link /> Edit Link
    </Button>
  );
};

export const GeneratePdfButton = ({
  document,
  documentId,
}: {
  document: DocumentData;
  documentId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const CACHE_KEY = `cv-html-cache-${documentId}`;

  const handleGenerateHTML = async (skipCache = false) => {
    try {
      setIsLoading(true);

      // Check localStorage first if not skipping cache
      if (!skipCache) {
        const cachedHtml = localStorage.getItem(CACHE_KEY);
        if (cachedHtml) {
          setHtml(cachedHtml);
          toast.success(SUCCESS_MESSAGES.HtmlGenerated + ' (from cache)');
          setIsLoading(false);
          return;
        }
      }

      // Generate new HTML
      const res = await generateHTML(document);
      if (!res) throw new Error('Failed to generate HTML');

      // Save to localStorage
      localStorage.setItem(CACHE_KEY, res);

      setHtml(res);
      toast.success(SUCCESS_MESSAGES.HtmlGenerated);
    } catch (error) {
      console.log('Error generating HTML', error);
      toast.error(ERROR_MESSAGES.FailedToGenerateHtml);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCache = async () => {
    localStorage.removeItem(CACHE_KEY);
    await handleGenerateHTML(true);
    toast.success('Cache cleared and HTML regenerated');
  };

  const handleClose = () => {
    setHtml(null);
  };

  const handleDownloadPDF = async () => {
    try {
      if (!htmlRef.current)
        throw new Error('Failed to generate PDF. No HTML element found.');
      setIsLoading(true);
      const html = htmlRef.current?.innerHTML;
      if (!html)
        throw new Error('Failed to generate PDF. No HTML content found.');
      setHtml(html);

      const pdf = await generatePDF(html);
      if (!pdf)
        throw new Error('Failed to generate PDF. No PDF content found.');
      const file = new Blob([Buffer.from(pdf)], { type: 'application/pdf' });
      const url = URL.createObjectURL(file);

      handleClose();
      window.open(url, '_blank');
    } catch (error) {
      console.log('Error generating PDF', error);
      toast.error(ERROR_MESSAGES.FailedToGeneratePdf);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (html) {
      window.document.body.style.overflow = 'hidden';
    } else {
      window.document.body.style.overflow = 'auto';
    }
  }, [html]);

  // Update localStorage whenever htmlRef changes (user edits HTML)
  useEffect(() => {
    if (htmlRef.current && html) {
      const updateCache = () => {
        const currentHtml = htmlRef.current?.innerHTML;
        if (currentHtml) {
          localStorage.setItem(CACHE_KEY, currentHtml);
        }
      };

      // Use MutationObserver to detect changes in the HTML content
      const observer = new MutationObserver(updateCache);

      observer.observe(htmlRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, [html, CACHE_KEY]);

  return (
    <React.Fragment>
      <Button
        variant="outline"
        onClick={() => handleGenerateHTML(false)}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Download />}{' '}
        Generate Resume
      </Button>
      {html && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-background overflow-y-auto p-6">
          <h1 className="text-2xl font-bold">Preview</h1>
          {isLoading ? (
            <div className="my-6 flex items-center justify-center min-h-[400px]">
              <Loader2 className="animate-spin h-12 w-12" />
            </div>
          ) : (
            <div
              key={1}
              className="my-6"
              ref={htmlRef}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleResetCache}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}{' '}
              Regenerate
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Download />}{' '}
              Download PDF
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export const GenerateSummaryButton = ({
  document,
  documentId,
}: {
  document: DocumentData;
  documentId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerateSummary = async () => {
    try {
      setIsLoading(true);
      toast.info('Generating summary...');

      // Call the generateSummary function from OpenAI
      const summary = await generateSummary({
        ...document,
        photo: '',
      });
      if (!summary) throw new Error('Failed to generate summary');

      // Update the document with the new summary
      await updateDocument(documentId, document, summary as string);

      toast.success('Summary generated successfully!');

      // Refresh the page to show the updated summary
      router.refresh();
    } catch (error) {
      console.log('Error generating summary', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGenerateSummary}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <FileText />} Generate
      Summary
    </Button>
  );
};
