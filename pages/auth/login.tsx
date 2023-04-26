import CustomTextInput from "@/components/customTextInput";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import useTimeout from "@/utils/useTimeout";
import { AiOutlineGoogle } from "react-icons/ai";
import HomeImageSlider from "@/components/homeImageSlider";

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
        error == "" ? null : 5000
    );

    const login = async () => {
        setError("");
        setIsLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        }).then((res) => {
            return res;
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
        <div className="flex h-screen py-36 bg-violet-300 gap-8">
            <div className="justify-end flex-1 hidden bg-green-200 md:flex">
                <HomeImageSlider />
            </div>
            <div className="flex items-center flex-1 bg-red-300 justify-center md:justify-normal">
                <div className="bg-blue-400 h-full aspect-[1024/1700] grid place-content-center">
                    <div className="w-[22rem] bg-amber-200 border-[1px] border-slate-300 p-10 flex flex-col gap-2 items-center">
                        <div className="font-grandista text-[2.5rem] box-border">
                            Instagram
                        </div>
                        <div className="text-lg text-slate-600 text-center my-2">
                            Welcome back! Login now to enter the world of
                            Instagram
                        </div>
                        <CustomTextInput
                            type="text"
                            value={email}
                            setValue={setEmail}
                            label="Email"
                        />
                        <CustomTextInput
                            type="text"
                            value={password}
                            setValue={setPassword}
                            label="Password"
                        />
                        {error ? (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        ) : null}
                        <button
                            className={`text-white py-2 mt-2 text-bold w-full rounded-md ${
                                isLoading
                                    ? "bg-button-disabled"
                                    : "bg-button hover:bg-button-hovered"
                            } transition-all`}
                            onClick={login}
                            disabled={isLoading}>
                            {isLoading ? "Loading..." : "Log in"}
                        </button>
                        <div className="flex items-center justify-center w-full">
                            <div className="h-[1px] bg-slate-300 flex-1 w-full" />
                            <div className="px-4 text-slate-400"> Or </div>
                            <div className="h-[1px] bg-slate-300 flex-1 w-full" />
                        </div>
                        <button
                            className="flex items-center justify-center w-full gap-1 py-2 text-white transition-all rounded-md text-bold bg-button hover:bg-button-hovered"
                            onClick={() => signIn("google")}>
                            <AiOutlineGoogle className="text-lg" />{" "}
                            <span>Log in with Google</span>
                        </button>
                    </div>
                </div>
            </div>
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
