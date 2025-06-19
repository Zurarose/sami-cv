import { Loader2 } from 'lucide-react';

export const Loader = () => {
  return (
    <div className="relative mx-auto top-2/5 flex items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
};
