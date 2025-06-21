'use client';

import { SUCCESS_MESSAGES } from '@/constant/messages';
import { Button } from '@/ui-kit/basic/button';
import { Link } from 'lucide-react';
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
