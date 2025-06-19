export const routes = {
  documents: '/dashboard/documents',
  folder: (folderId: string) => `/dashboard/folder/${folderId}`,
  signin: '/signin',
};

export const apiRoutes = {
  signinRoot: '/api/auth/signin',
  signinEmail: '/api/auth/signin/email',
};
