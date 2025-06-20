import { Card, CardHeader, CardTitle, CardContent } from '@/ui-kit/basic/card';
import { Building, Trash2, Plus } from 'lucide-react';
import { Button } from '@/ui-kit/basic/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/ui-kit/basic/form';
import { Input } from '@/ui-kit/basic/input';
import { Textarea } from '@/ui-kit/basic/textarea';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { DocumentFormData } from '.';

interface ExperienceInfoProps {
  form: UseFormReturn<DocumentFormData, unknown, DocumentFormData>;
  experienceFields: UseFieldArrayReturn<DocumentFormData, 'experiences', 'id'>;
  addExperience: () => void;
}

export function ExperienceInfo({
  form,
  experienceFields,
  addExperience,
}: ExperienceInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building className="h-5 w-5" />
            Work Experience
          </CardTitle>
          <Button
            type="button"
            onClick={addExperience}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {experienceFields.fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200 rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Experience {index + 1}</h4>
              <Button
                type="button"
                onClick={() => experienceFields.remove(index)}
                variant="outline"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`experiences.${index}.companyName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`experiences.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`experiences.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        placeholder="Jan 2020"
                        max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`experiences.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        placeholder="Dec 2020"
                        max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`experiences.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your role and achievements..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        {experienceFields.fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No work experience added yet.</p>
            <p className="text-sm">
              Click &quot;Add Experience&quot; to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
