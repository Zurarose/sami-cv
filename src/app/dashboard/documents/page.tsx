import { getFolders } from '@/actions/document';
import { CreateFolderButton } from '@/components/documents/create-button';
import { FolderList } from '@/components/documents/list';

export default async function Documents() {
  const folders = await getFolders();

  return (
    <div className="flex flex-row flex-wrap gap-4">
      <CreateFolderButton />
      <FolderList folders={folders} />
    </div>
  );
}
