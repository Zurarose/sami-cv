import { routes } from '@/constant/routes';
import { redirect } from 'next/navigation';

export default function Folder() {
  redirect(routes.documents);
}
