import { redirect } from 'next/navigation';
import { routes } from '@/constant/routes';

export default function Documents() {
  redirect(routes.documents);
}
