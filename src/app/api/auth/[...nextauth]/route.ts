import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const Options: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: "3c65929be7112cbfcab6333f47371b0aee96a071565b61fe9dff019b819f3559",
  providers: [
    GithubProvider({
      clientId: "49c5e75c37a5a1c15428",
      clientSecret: "ffb43142584ae0383df2b01848891b208bc5a54d",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
  },
  jwt: {
    maxAge: 10 * 60,
    encode: async ({ secret, token }): Promise<string> => {
      return jwt.sign({ ...token, role: "admin" }, secret);
    },
  },
  cookies: {
    sessionToken: {
      name: `session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 1 * 60,
      },
    },
    callbackUrl: {
      name: `callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 2 * 60,
      },
    },
    csrfToken: {
      name: `csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 2 * 60,
      },
    },
  },
};

const handler = NextAuth(Options);

export { handler as GET, handler as POST };
