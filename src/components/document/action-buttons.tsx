'use client';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constant/messages';
import { generatePDF } from '@/lib/pdf';
import { DocumentData } from '@/types/document';
import { Button } from '@/ui-kit/basic/button';
import { Download, Link, Loader2 } from 'lucide-react';
import { useState } from 'react';
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

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const res = await generatePDF(document);
      if (!res) {
        return;
      }
      const file = new Blob([res], { type: 'application/pdf' });
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
      toast.success(SUCCESS_MESSAGES.PdfGenerated);
    } catch (error) {
      console.log('Error generating PDF', error);
      toast.error(ERROR_MESSAGES.FailedToGeneratePdf);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} disabled={isLoading}>
      {isLoading ? <Loader2 className="animate-spin" /> : <Download />} Download
      PDF
    </Button>
  );
};
