import { getDocumentFromMagicLink } from '@/actions/document';
import { DocumentData } from '@/types/document';
import { DocumentForm } from '@/components/document/document-form';
import { redirect } from 'next/navigation';
import { routes } from '@/constant/routes';

type Params = Promise<{ id: string }>;

export default async function MagicLink({ params }: { params: Params }) {
  const { id } = await params;
  const document = await getDocumentFromMagicLink(id);
  const data = document?.data as unknown as DocumentData;

  if (!document) redirect(routes.notFound);

  return (
    <div className="min-h-screen pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Your Document
          </h1>
          <p className="text-gray-600">
            {document?.name || 'Document'} - Update your information below
          </p>
        </div>
        <DocumentForm initialData={data} documentId={document?.id} />
      </div>
    </div>
  );
}
