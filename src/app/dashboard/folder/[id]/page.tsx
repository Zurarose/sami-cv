import { getDocuments } from '@/actions/documents';
import { DocumentList } from '@/components/folder/list';
import { UploadFilesButton } from '@/components/folder/upload-button';
import { routes } from '@/constant/routes';
import { redirect } from 'next/navigation';

type Params = Promise<{ id: string }>;

export default async function Folder({ params }: { params: Params }) {
  const { id } = await params;
  if (!id) redirect(routes.documents);
  const documents = await getDocuments(id);

  return (
    <div className="flex flex-row flex-wrap gap-4">
      <UploadFilesButton folderId={id} />
      <DocumentList documents={documents} />
    </div>
  );
}
