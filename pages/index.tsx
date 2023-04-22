import { GetServerSideProps } from "next";
import dbConnection from "@/database/dbConnection";
import { signIn } from "next-auth/react";

export default function Home() {
    return (
        <div>
            <div>Import image</div>
            <div
                className="p-2 m-2 border-2 border-white hover:bg-white hover:text-black transition-all w-fit hover:cursor-pointer"
                onClick={() => signIn(undefined, { callbackUrl: '/' })}>
                Sign in
            </div>
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
