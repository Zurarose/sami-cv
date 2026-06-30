import { Button } from '@/ui-kit/basic/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui-kit/basic/card';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
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
import { DocumentData } from '@/types/document';
import { Checkbox } from '@/ui-kit/basic/checkbox';
import { RESPONSIBILITY_OPTIONS } from '@/constant/common';
import { toDateInputValue } from '@/lib/date';

interface ProjectInfoProps {
  form: UseFormReturn<DocumentData, unknown, DocumentData>;
  projectFields: UseFieldArrayReturn<DocumentData, 'projects', 'id'>;
  addProject: () => void;
}

export function ProjectInfo({
  form,
  projectFields,
  addProject,
}: ProjectInfoProps) {
  console.log(form.getValues('projects'));
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="h-5 w-5" />
            Projects Information
          </CardTitle>
          <Button
            type="button"
            onClick={addProject}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {projectFields.fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200 rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Project {index + 1}</h4>
              <Button
                type="button"
                onClick={() => projectFields.remove(index)}
                variant="outline"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`projects.${index}.companyName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`projects.${index}.projectName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`projects.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Full-stack Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`projects.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={toDateInputValue(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`projects.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={toDateInputValue(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`projects.${index}.operationSystem`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating System (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Linux, Windows, macOS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`projects.${index}.database`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Database (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="PostgreSQL, MongoDB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`projects.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project, its goals, and outcomes..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name={`projects.${index}.skills`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Project Skills</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {form.watch('skills').map((skill, index) => {
                        return (
                          <FormItem
                            key={index}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(skill)}
                                onCheckedChange={checked => {
                                  return checked
                                    ? field.onChange([...field.value, skill])
                                    : field.onChange(
                                        field.value?.filter(
                                          value => value !== skill
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {skill}
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`projects.${index}.responsibilities`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Responsibilities</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {RESPONSIBILITY_OPTIONS.map((key, index) => {
                        return (
                          <FormItem
                            key={index}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(key)}
                                onCheckedChange={checked => {
                                  return checked
                                    ? field.onChange([...field.value, key])
                                    : field.onChange(
                                        field.value?.filter(
                                          value => value !== key
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {key}
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        {projectFields.fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects added yet.</p>
            <p className="text-sm">
              Click &quot;Add Project&quot; to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
