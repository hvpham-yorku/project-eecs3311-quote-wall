import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? (() => { throw new Error("GOOGLE_CLIENT_ID is missing"); })(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? (() => { throw new Error("GOOGLE_CLIENT_SECRET is missing"); })(),
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? (() => { throw new Error("GITHUB_CLIENT_ID is missing"); })(),
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? (() => { throw new Error("GITHUB_CLIENT_SECRET is missing"); })(),
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID ?? (() => { throw new Error("FACEBOOK_CLIENT_ID is missing"); })(),
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? (() => { throw new Error("FACEBOOK_CLIENT_SECRET is missing"); })(),
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user || !account) {
        console.error("Sign-in error: Missing user or account data");
        return false;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      if (!token.sub) {
        console.error("Session error: No user ID found");
        return null;
      }
      session.user.id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };