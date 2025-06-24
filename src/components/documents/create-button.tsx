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
import { createFolderSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  Form,
  FormMessage,
} from '@/ui-kit/basic/form';
import { z } from 'zod';
import { createFolder } from '@/actions/folder';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constant/messages';

export const CreateFolderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      folderName: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof createFolderSchema>) => {
    try {
      const res = await createFolder(values.folderName);
      if (res.id) {
        toast.success(SUCCESS_MESSAGES.FolderCreated);
        form.reset();
        setIsOpen(false);
        return;
      }
      throw new Error();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error(ERROR_MESSAGES.FailedToCreateFolder);
    }
  };

  const toggleDialog = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={toggleDialog}
        className="cursor-pointer shadow-md flex gap-1 min-md:gap-4 flex-1 min-w-16 w-full h-16 flex-col min-md:flex-row items-center justify-center py-2 px-2 min-lg:px-6 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <PlusIcon className="shrink-0" />
        <span className="line-clamp-2 text-center hidden min-lg:block">
          Create Folder
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to store your documents.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="folderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter folder name"
                      id="folderName"
                      {...field}
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
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
