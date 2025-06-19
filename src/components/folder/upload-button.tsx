'use client';

import { Dialog } from '@/ui-kit/basic/dialog';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui-kit/basic/dialog';
import { Input } from '@/ui-kit/basic/input';
import { Button } from '@/ui-kit/basic/button';
import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  Form,
  FormMessage,
} from '@/ui-kit/basic/form';
import React, { useState } from 'react';
import { parseCVDocument } from '@/actions/openai';

export const UploadFilesButton = ({ folderId }: { folderId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = async (values: { files: File[] }) => {
    const formData = new FormData();
    Object.values(values.files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('id', folderId);
    await parseCVDocument(formData);
    form.reset();
    setIsOpen(false);
  };

  const toggleDialog = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={toggleDialog}
        className="cursor-pointer shadow-md flex gap-1 min-md:gap-4 flex-1 max-w-60 min-w-16 w-full h-16 flex-col min-md:flex-row items-center justify-center py-2 px-2 min-lg:px-6 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <PlusIcon className="shrink-0" />
        <span className="line-clamp-2 text-center hidden min-lg:block">
          Upload CV
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload CVs</DialogTitle>
          <DialogDescription>Upload CVs to parse the data.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Files</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="file"
                      value={undefined}
                      onChange={e => {
                        field.onChange(e.target.files);
                      }}
                      multiple
                      accept="application/pdf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              variant="default"
              type="submit"
              className="w-full"
            >
              Upload
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
