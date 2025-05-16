import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import User from "@/models/users";
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcryptjs";

interface UserWithId {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error("Invalid user data");
          }

          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          return user as UserWithId;

        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        await dbConnect();
        const existingUser = await User.findOne({ email: profile?.email });
        if (!existingUser) {
          await User.create({
            name: profile?.name,
            email: profile?.email,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as UserWithId).id;  // Cast the user to the UserWithId type
        token.email = (user as UserWithId).email;
        token.name = (user as UserWithId).name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};