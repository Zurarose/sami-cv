import { userFormSchema } from '@/lib/validators';
import { z } from 'zod';

export type DocumentData = z.infer<typeof userFormSchema>;
