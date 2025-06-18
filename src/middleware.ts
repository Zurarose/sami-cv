export { default } from 'next-auth/middleware';

const protectedRoutes = ['/dashboard', '/settings'];

export const config = { matcher: protectedRoutes };
