import { Award, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui-kit/basic/card';
import { Input } from '@/ui-kit/basic/input';
import { Button } from '@/ui-kit/basic/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/ui-kit/basic/badge';
import { UseFormReturn } from 'react-hook-form';
import { DocumentData } from '@/types/document';

interface SkilsInfoProps {
  form: UseFormReturn<DocumentData, unknown, DocumentData>;
  newSkill: string;
  setNewSkill: (newSkill: string) => void;
  addSkill: () => void;
  removeSkill: (skillToRemove: string) => void;
}

export function SkilsInfo({
  form,
  newSkill,
  setNewSkill,
  addSkill,
  removeSkill,
}: SkilsInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Award className="h-5 w-5" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e =>
              e.key === 'Enter' && (e.preventDefault(), addSkill())
            }
          />
          <Button type="button" onClick={addSkill} variant="outline">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.watch('skills').map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-sm py-2 px-3"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </Badge>
          ))}
        </div>

        {form.watch('skills').length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No skills added yet.</p>
            <p className="text-sm">Add your skills above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
