import { Button } from '@/ui-kit/basic/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/ui-kit/basic/card';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/ui-kit/basic/form';
import { Input } from '@/ui-kit/basic/input';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { DocumentData } from '@/types/document';

interface EducationInfoProps {
  form: UseFormReturn<DocumentData, unknown, DocumentData>;
  educationFields: UseFieldArrayReturn<DocumentData, 'education', 'id'>;
  addEducation: () => void;
}

export function EducationInfo({
  form,
  educationFields,
  addEducation,
}: EducationInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
          <Button
            type="button"
            onClick={addEducation}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {educationFields.fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200 rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Education {index + 1}</h4>
              <Button
                type="button"
                onClick={() => educationFields.remove(index)}
                variant="outline"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`education.${index}.schoolName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Bachelor of Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`education.${index}.startDate`}
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
                name={`education.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
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
            </div>
          </div>
        ))}

        {educationFields.fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No education added yet.</p>
            <p className="text-sm">
              Click &quot;Add Education&quot; to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
