'use client';

import { Button } from '@/ui-kit/basic/button';
import { Link } from 'lucide-react';
import { toast } from 'sonner';

export const LinkButton = ({ link }: { link: string }) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success('Edit link copied to clipboard');
  };

  return (
    <Button variant="outline" onClick={handleCopyToClipboard}>
      <Link /> Edit Link
    </Button>
  );
};
