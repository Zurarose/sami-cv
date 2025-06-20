export const routes = {
  documents: '/dashboard/documents',
  folder: (folderId: string) => `/dashboard/folder/${folderId}`,
  document: (documentId: string) => `/dashboard/document/${documentId}`,
  signin: '/signin',
  notFound: '/not-found',
  thankYou: '/thank-you',
};

export const apiRoutes = {
  signinRoot: '/api/auth/signin',
  signinEmail: '/api/auth/signin/email',
};
