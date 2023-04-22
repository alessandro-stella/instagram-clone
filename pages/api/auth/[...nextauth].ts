import { dbConnection } from "@/database/dbConnection";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import url from "@/url";
import User from "@/database/models/userModel";

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

                return user;
            },
        }),
    ],
});
