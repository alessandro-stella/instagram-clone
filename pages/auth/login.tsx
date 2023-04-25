import CustomTextInput from "@/components/customTextInput";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import useTimeout from "@/utils/useTimeout";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState<string>(
        "alessandro.stella2004@gmail.com"
    );
    const [password, setPassword] = useState<string>("Negro123@_");

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    useTimeout(
        () => {
            setError("");
        },
        error == "" ? null : 3000
    );

    const login = async () => {
        setIsLoading(true);
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res) {
            if (res.ok) {
                router.push("/");

                return;
            }

            if (res.error) {
                setError(res.error);
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col w-1/2 gap-4 p-8 text-2xl">
            <div>Login</div>

            <CustomTextInput type="text" value={email} setValue={setEmail} />
            <CustomTextInput
                type="text"
                value={password}
                setValue={setPassword}
            />

            <div className="text-red-500">{error}</div>

            <button
                onClick={login}
                disabled={isLoading}
                className={`${isLoading ? "bg-slate-200" : "bg-slate-100"}`}>
                {isLoading ? "Loading..." : "Login"}
            </button>

            <button onClick={() => signIn("google")}>Login with Google</button>
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
