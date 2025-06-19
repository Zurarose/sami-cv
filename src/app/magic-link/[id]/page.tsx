import { getDocumentFromMagicLink } from '@/actions/documents';

type Params = Promise<{ id: string }>;

export default async function MagicLink({ params }: { params: Params }) {
  const { id } = await params;
  const document = await getDocumentFromMagicLink(id);
  return <div>{document?.name} Document</div>;
}
