import { routes } from '@/constant/routes';
import { redirect } from 'next/navigation';

export default function MagicLink() {
  redirect(routes.notFound);
}
