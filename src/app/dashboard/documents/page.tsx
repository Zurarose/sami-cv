import { getFolders } from '@/actions/folder';
import { CreateFolderButton } from '@/components/documents/create-button';
import { FolderList } from '@/components/documents/list';

export default async function Documents() {
  const folders = await getFolders();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <CreateFolderButton />
      <FolderList folders={folders} />
    </div>
  );
}
