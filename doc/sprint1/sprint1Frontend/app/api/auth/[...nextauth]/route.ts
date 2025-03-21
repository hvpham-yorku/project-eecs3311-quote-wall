import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    // Credentials-based login
    CredentialsProvider({
      name: "Credentials", // Can be named anything you like
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://127.0.0.1:5000/validate-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (!res.ok) {
          console.error("Error in login attempt", res.statusText);
          return null;
        }

        const data = await res.json();

        if (data.message === "Login successful!") {
          return { 
            email: credentials?.email, 
            name: credentials?.email.split('@')[0] // Extract name from email
          };
        } else {
          console.error("Login failed:", data);
          return null;
        }
      },
    }),

    // OAuth Providers (Google, GitHub)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? (() => { throw new Error("GOOGLE_CLIENT_ID is missing"); })(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? (() => { throw new Error("GOOGLE_CLIENT_SECRET is missing"); })(),
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? (() => { throw new Error("GITHUB_CLIENT_ID is missing"); })(),
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? (() => { throw new Error("GITHUB_CLIENT_SECRET is missing"); })(),
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth", // Custom sign-in page
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
      if (token) {
        session.user.id = token.id || ""; // Ensure token has id
        session.user.name = token.name || "Anonymous"; // Set name
        session.user.email = token.email || ""; // Ensure email is available

        // Optional: Generate a profile picture URL
        session.user.image = `https://ui-avatars.com/api/?name=${session.user.name}&background=random&color=fff`; // Using UI Avatars API
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
