import CustomTextInput from "@/components/customTextInput";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

export default function Login() {
    const router = useRouter();

    const [username, setUsername] = useState<string>("alessandr.o_stella");

    const [email, setEmail] = useState<string>(
        "alessandro.stella2004@gmail.com"
    );
    const [confirmEmail, setConfirmEmail] = useState<string>(
        "alessandro.stella2004@gmail.com"
    );

    const [password, setPassword] = useState<string>("Negro123@_");
    const [confirmPassword, setConfirmPassword] =
        useState<string>("Negro123@_");

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const register = async () => {
        setIsLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        }).then((res) => res.json());

        if (res && res.success) {
            router.push("/");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col w-1/2 gap-4 p-8 text-2xl">
            <div>Register</div>

            <CustomTextInput
                type="text"
                value={username}
                setValue={setUsername}
            />

            <CustomTextInput type="text" value={email} setValue={setEmail} />
            <CustomTextInput
                type="text"
                value={confirmEmail}
                setValue={setConfirmEmail}
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

            {isLoading ? (
                <button disabled={true}>Loading...</button>
            ) : (
                <button onClick={register}>Register</button>
            )}

            <button onClick={() => signIn("google")}>
                Register with Google
            </button>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session)
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };

    return {
        props: {},
    };
};
