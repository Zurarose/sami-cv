import { apiRoutes } from '@/constant/routes';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { NextAuthOptions } from 'next-auth';
import Email from 'next-auth/providers/email';

export const authOptions = {
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
} satisfies NextAuthOptions;
