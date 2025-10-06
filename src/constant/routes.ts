export const routes = {
  documents: '/dashboard/documents',
  folder: (folderId: string) => `/dashboard/folder/${folderId}`,
  document: (documentId: string) => `/dashboard/document/${documentId}`,
  instructions: '/dashboard/instactions',
  signin: '/signin',
  notFound: '/not-found',
  thankYou: '/magic-link/thank-you',
};

export const apiRoutes = {
  signinRoot: '/api/auth/signin',
  signinEmail: '/api/auth/signin/email',
};
