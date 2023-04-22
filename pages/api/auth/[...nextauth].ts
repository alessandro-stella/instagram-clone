import dbConnection from "@/database/dbConnection";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import url from "@/url";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                const res = await fetch(`${url}/api/findUser`, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const user = await res.json();
                console.log({ user });

                if (user.notConnected) {
                    throw new Error("We couldn't connect to the database");
                }

                if (user) {
                    return user;
                }

                return null;
            },
        }),
    ],
});
