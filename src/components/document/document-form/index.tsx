'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DocumentData } from '@/types/document';
import { Button } from '@/ui-kit/basic/button';
import { Form } from '@/ui-kit/basic/form';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { documentSchema } from '@/lib/validators';
import { updateDocument } from '@/actions/documents';
import { useRouter } from 'next/navigation';
import { routes } from '@/constant/routes';
import { PersonalInfo } from './personal-info';
import { SkilsInfo } from './skils-info';
import { ExperienceInfo } from './experience-info';
import { EducationInfo } from './education-info';
import { ProjectInfo } from './project-info';

export type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentFormProps {
  initialData?: DocumentData;
  documentId: string;
}

export function DocumentForm({ initialData, documentId }: DocumentFormProps) {
  const [newSkill, setNewSkill] = useState('');

  const router = useRouter();
  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      applicantName: initialData?.applicantName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      website: initialData?.website || '',
      country: initialData?.country || '',
      experiences: initialData?.experiences || [],
      education: initialData?.education || [],
      skills: initialData?.skills || [],
      projects: initialData?.projects || [],
    },
  });

  const experienceFields = useFieldArray({
    control: form.control,
    name: 'experiences',
  });

  const educationFields = useFieldArray({
    control: form.control,
    name: 'education',
  });

  const projectFields = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  const addSkill = () => {
    if (
      newSkill.trim() &&
      !form.getValues('skills').includes(newSkill.trim())
    ) {
      form.setValue('skills', [...form.getValues('skills'), newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    form.setValue(
      'skills',
      form.getValues('skills').filter(skill => skill !== skillToRemove)
    );
  };

  const onSubmit = async (data: DocumentFormData) => {
    try {
      const res = await updateDocument(
        documentId,
        data as unknown as DocumentData
      );
      if (res.id) {
        toast.success('Document updated successfully!');
        router.push(routes.thankYou);
      } else {
        toast.error('Failed to update document');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  const addExperience = () => {
    experienceFields.append({
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  const addEducation = () => {
    educationFields.append({
      schoolName: '',
      degree: '',
      startDate: '',
      endDate: '',
    });
  };

  const addProject = () => {
    projectFields.append({
      projectName: '',
      description: '',
      startDate: '',
      endDate: '',
      position: '',
      skills: [],
      responsibilities: [],
      operationSystem: '',
      database: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information Section */}
        <PersonalInfo form={form} />
        {/* Skills Section */}
        <SkilsInfo
          form={form}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          addSkill={addSkill}
          removeSkill={removeSkill}
        />
        {/* Experience Section */}
        <ExperienceInfo
          form={form}
          experienceFields={experienceFields}
          addExperience={addExperience}
        />
        {/* Education Section */}
        <EducationInfo
          form={form}
          educationFields={educationFields}
          addEducation={addEducation}
        />
        {/* Projects Section */}
        <ProjectInfo
          form={form}
          projectFields={projectFields}
          addProject={addProject}
        />

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            size="lg"
            className="min-w-[200px] p-6"
          >
            <Save className="h-4 w-4 mr-2" />
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
