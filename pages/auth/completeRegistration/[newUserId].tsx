import CustomTextInput from "@/components/customTextInput";
import { dbConnection } from "@/database/dbConnection";
import TempUser from "@/database/models/tempUserModel";
import { passwordRegex, usernameRegex } from "@/utils/regex";
import useTimeout from "@/utils/useTimeout";
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

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const timeoutRef = useTimeout(
        () => {
            setError("");
        },
        error == "" ? null : 5000
    );

    function valuesAreValid(): boolean {
        window.clearTimeout(timeoutRef.current);

        if (!username || !password || !confirmPassword) {
            setError("Some of the fields have not been filled in");
            return false;
        }

        if (!username.match(usernameRegex)) {
            setError(
                "Username does not match the allowed format: maximum length of 30 characters, only underscores and periods allowed as special characters"
            );
            return false;
        }

        if (password !== confirmPassword) {
            setError("The passwords entered do not match");
            return false;
        }

        if (!password.match(passwordRegex)) {
            setError(
                "The password does not match the allowed format: minimum length of 8 characters, it has to include at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character"
            );
            return false;
        }

        return true;
    }

    const handleConfirm = async () => {
        setError("");

        if (!valuesAreValid()) {
            return;
        }

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
                        label="Username"
                        type="text"
                        value={username}
                        setValue={setUsername}
                    />

                    <CustomTextInput
                        label="Password"
                        type="text"
                        value={password}
                        setValue={setPassword}
                    />

                    <CustomTextInput
                        label="Confirm password"
                        type="text"
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                    />

                    <button onClick={handleConfirm}>
                        Complete registration
                    </button>

                    <div>
                        You have about 3 minutes to complete this step, or else
                        you&apos;ll have to register again
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
