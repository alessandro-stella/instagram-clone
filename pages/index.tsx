import { dbConnection } from "@/database/dbConnection";
import { GetServerSideProps } from "next";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
    return (
        <div>
            <div>Sign out</div>
            <button onClick={() => signOut()}>LOGOUT</button>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const isConnected: boolean = await dbConnection();

    if (!isConnected)
        return {
            redirect: {
                destination: "/404/missingConnection",
                permanent: false,
            },
        };

    return {
        props: {},
    };
};
