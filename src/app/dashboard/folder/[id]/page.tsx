import { generateDocumentEditLink, getDocuments } from '@/actions/document';
import { DocumentList } from '@/components/folder/list';
import { UploadFilesButton } from '@/components/folder/upload-button';
import { routes } from '@/constant/routes';
import { redirect } from 'next/navigation';

type Params = Promise<{ id: string }>;

export default async function Folder({ params }: { params: Params }) {
  const { id } = await params;
  if (!id) redirect(routes.documents);
  const documents = await getDocuments(id);
  const documentsWithEditLink = await Promise.all(
    documents.map(async document => ({
      ...document,
      data: {},
      editLink: await generateDocumentEditLink({ ...document, data: {} }),
    }))
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <UploadFilesButton folderId={id} />
      <DocumentList documents={documentsWithEditLink} />
    </div>
  );
}
