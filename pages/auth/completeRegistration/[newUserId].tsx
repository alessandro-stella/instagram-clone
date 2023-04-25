import CustomTextInput from "@/components/customTextInput";
import { dbConnection } from "@/database/dbConnection";
import TempUser from "@/database/models/tempUserModel";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface PageProps {
    email: string;
    newUserId: string;
}

export default function CompleteRegistration({ email, newUserId }: PageProps) {
    const router = useRouter();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleConfirm = async () => {
        setIsLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                newUserId,
                username,
                email,
                password,
            }),
        }).then((res) => res.json());

        console.log(res);

        if (res.success) {
            router.push("/");
        }

        setIsLoading(false);
    };

    return (
        <>
            {!isLoading ? (
                <div className="flex flex-col gap-2 text-2xl">
                    <div>Complete registration</div>

                    <CustomTextInput
                        type="text"
                        value={username}
                        setValue={setUsername}
                    />

                    <CustomTextInput
                        type="text"
                        value={password}
                        setValue={setPassword}
                    />

                    <CustomTextInput
                        type="text"
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                    />

                    <button onClick={handleConfirm}>
                        Complete registration
                    </button>

                    <div>
                        You have about 3 minutes to complete this step, or else
                        you'll have to register again
                    </div>
                </div>
            ) : (
                <div>loading</div>
            )}
        </>
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

    const { newUserId } = context.query;

    const userEmail = await TempUser.findById(newUserId)
        .then((res) => res.email)
        .catch((error) => ({ error }));

    if (userEmail.error) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            email: userEmail,
            newUserId,
        },
    };
};
