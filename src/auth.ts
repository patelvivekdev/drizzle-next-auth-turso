import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { loginUser } from './db/query/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google,
    Github,
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log(credentials);
          if (!credentials.username || !credentials.password) {
            return null;
          }

          const user = await loginUser(
            credentials.username as string,
            credentials.password as string,
          );

          if (!user) {
            return null;
          }
          return user;
        } catch (error: any) {
          console.log(error);
          return null;
          // if (error instanceof AuthError) {
          //   throw new InvalidTypeError(error.message);
          // } else {
          //   throw error;
          // }
        }
      },
    }),
  ],
  session: {
    strategy: 'database',
  },
  secret: process.env.AUTH_SECRET,
});