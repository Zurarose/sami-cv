import NextAuth from 'next-auth';
import { authOptions } from './option';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
    };
  }
  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    emailVerified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: number;
    };
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
