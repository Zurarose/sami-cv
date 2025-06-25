'use client';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constant/messages';
import { generateHTML, generatePDF } from '@/lib/pdf';
import { DocumentData } from '@/types/document';
import { Button } from '@/ui-kit/basic/button';
import { Download, Link, Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

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

export const GeneratePdfButton = ({ document }: { document: DocumentData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const htmlRef = useRef<HTMLDivElement>(null);

  const handleGenerateHTML = async () => {
    try {
      setIsLoading(true);
      const res = await generateHTML(document);
      if (!res) throw new Error('Failed to generate HTML');
      setHtml(res);
      toast.success(SUCCESS_MESSAGES.HtmlGenerated);
    } catch (error) {
      console.log('Error generating HTML', error);
      toast.error(ERROR_MESSAGES.FailedToGenerateHtml);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setHtml(null);
  };

  const handleDownloadPDF = async () => {
    try {
      if (!htmlRef.current) throw new Error('Failed to generate PDF');
      setIsLoading(true);
      const html = htmlRef.current?.innerHTML;
      if (!html) throw new Error('Failed to generate PDF');
      setHtml(html);

      const pdf = await generatePDF(html);
      if (!pdf) throw new Error('Failed to generate PDF');
      const file = new Blob([pdf], { type: 'application/pdf' });
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

  return (
    <React.Fragment>
      <Button
        variant="outline"
        onClick={handleGenerateHTML}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Download />}{' '}
        Generate Resume
      </Button>
      {html && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-background overflow-y-auto p-6">
          <h1 className="text-2xl font-bold">Preview</h1>
          <div
            key={1}
            className="my-6"
            ref={htmlRef}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
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
