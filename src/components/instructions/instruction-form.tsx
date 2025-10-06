'use client';

import { useState } from 'react';
import { Textarea } from '@/ui-kit/basic/textarea';
import { Button } from '@/ui-kit/basic/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/ui-kit/basic/card';
import { saveInstruction } from '@/actions/instraction';
import { toast } from 'sonner';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constant/messages';
import { Loader2, Save } from 'lucide-react';

export function InstructionForm({
  initialContent,
}: {
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await saveInstruction(content);
      toast.success(SUCCESS_MESSAGES.InstructionSaved);
    } catch (error) {
      console.error('Failed to save instruction:', error);
      toast.error(ERROR_MESSAGES.FailedToSaveInstruction);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">AI Instructions</CardTitle>
          <CardDescription>
            Configure instructions for the AI to follow when processing
            documents and generating CVs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="instructions" className="text-sm font-medium">
                Instructions
              </label>
              <Textarea
                id="instructions"
                placeholder="Enter AI instructions here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="min-h-[300px] resize-y"
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Instructions
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
