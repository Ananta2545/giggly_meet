import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";


export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      console.log("🔑 JWT Callback");
      console.log("Token:", token);
      console.log("User:", user);
      console.log("Account:", account);

      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("📦 Session Callback");
      session.user.id = token.id;
      return session;
    },

    async signIn({ user, profile }) {
      console.log("🚀 signIn Callback Triggered");
      console.log("User:", user);
      console.log("Profile:", profile);

      await dbConnect();

      let dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await User.create({
          name: profile.name,
          email: profile.email,
          profilePicture: profile.picture,
          isVerified: profile.email_verified ?? false,
        });
      }

      user.id = dbUser._id.toString();
      return true;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60, // 90 days
  },

  pages: {
    signIn: "/user-auth",
  },
};

const handle = NextAuth(authOptions);
export { handle as GET, handle as POST };
