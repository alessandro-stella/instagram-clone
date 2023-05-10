import { dbConnection } from "@/database/dbConnection";
import { GetServerSideProps } from "next";
import { Session, getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { nextAuthOptions } from "./api/auth/[...nextauth]";
import Post, { PostType } from "@/database/models/postModel";

interface PageProps {
    session: Session | null;
    posts: PostType[];
}

export default function Home({ session, posts }: PageProps) {
    const user = session?.user;
    console.log(user);

    return (
        <div>
            {user !== null && <div>{user?.username}</div>}

            <div>Sign out</div>
            <button onClick={() => signOut()}>LOGOUT</button>
            <br />
            <Link href="/auth/login">Go to login</Link>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const isConnected: boolean = await dbConnection();

    console.log({ isConnected });

    if (!isConnected)
        return {
            redirect: {
                destination: "/404/missingConnection",
                permanent: false,
            },
        };

    const session = await getServerSession(
        context.req,
        context.res,
        nextAuthOptions
    );

    if (!session)
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };

    const posts: PostType[] = await Post.find(
        session?.user?.followed.length !== 0
            ? {
                  ownerId: { $in: session?.user?.followed },
              }
            : {}
    );

    return {
        props: {
            session,
            posts,
        },
    };
};
