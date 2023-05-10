import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        dbUser?: boolean;
        id: string;
        profilePic: string;
        username: string;
        followed: string[];
    }

    interface Session extends DefaultSession {
        user?: User;
    }
}
