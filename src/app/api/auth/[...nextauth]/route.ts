import NextAuth from 'next-auth';
import Email from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { apiRoutes } from '@/constant/routes';

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

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      if (process.env.ALLOW_ADMIN_CREATION === 'true') return true;
      const userExists = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });
      if (userExists) {
        console.log('User with email', user.email, 'exists');
        return true;
      }
      console.log('User with email', user.email, 'does not exist');
      return `${apiRoutes.signinRoot}?error=UserDoesNotExist`;
    },
  },
  providers: [
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
});

export { handler as GET, handler as POST };
