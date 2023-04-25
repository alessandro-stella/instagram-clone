import { dbConnection } from "@/database/dbConnection";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import url from "@/utils/url";
import User from "@/database/models/userModel";
import TempUser from "@/database/models/tempUserModel";

const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET as string;

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const isConnected: boolean = await dbConnection();

                if (!isConnected) {
                    throw new Error("We couldn't reach the database");
                }

                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                const user = await User.findOne({ email }).select("+password");

                if (!user) {
                    throw new Error(
                        "There are no users registered with this email"
                    );
                }

                const passwordIsCorrect: boolean = await user.validatePassword(
                    password
                );

                if (!passwordIsCorrect) {
                    throw new Error("Invalid password");
                }

                return {
                    dbUser: true,
                    id: user._id,
                    username: user.username,
                    followed: user.followed,
                };
            },
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "auth/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user);
            return token;
        },
        session: async ({ session, token }) => {
            let user: any = token.user;
            const isFromDb: boolean = user.hasOwnProperty("dbUser");

            if (isFromDb) {
                session.user = user;
                return session;
            }

            const isConnected: boolean = await dbConnection();

            if (!isConnected) throw new Error("We couldn't reach the database");

            if (!token.email)
                throw new Error("We couldn't access to the email");

            const dbUser = await User.findOne({
                email: token.email,
            });

            user = {
                id: dbUser._id,
                username: dbUser.username,
                followed: dbUser.followed,
            };

            session.user = user;
            return session;
        },
        async signIn({ account, profile, email, credentials }) {
            if (account && account.provider === "google") {
                const isConnected: boolean = await dbConnection();

                if (!isConnected)
                    throw new Error("We couldn't reach the database");

                if (!profile?.email)
                    throw new Error("We couldn't access to the email");

                const dbUser = await User.findOne({
                    email: profile.email,
                });

                if (!dbUser) {
                    const newTempUser = await TempUser.create({
                        email: profile.email,
                    }).catch((error) => ({ error }));

                    if (newTempUser.error)
                        throw new Error("We couldn't register the new user");

                    return `${url}/auth/completeRegistration/${newTempUser._id}`;
                }

                return true;
            }

            return true;
        },
    },
});
