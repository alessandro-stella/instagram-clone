import CustomTextInput from "@/components/customTextInput";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { AiOutlineGoogle } from "react-icons/ai";

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
        <div className="flex min-h-screen py-20 bg-violet-300">
            <div className="justify-end flex-1 hidden bg-green-200 sm:flex">
                <div className="w-[22rem] bg-sky-300 mr-4 ">IMAGES</div>
            </div>
            <div className="flex items-center flex-1 bg-red-300">
                <div className="w-[22rem] bg-amber-200 border-[1px] border-slate-300 p-10 flex flex-col gap-2 items-center">
                    <div className="font-grandista text-[2.5rem] box-border">
                        Instagram
                    </div>

                    <div className="text-lg text-slate-600 text-center my-2">
                        Welcome! Sign up to see what your friends are up to
                    </div>

                    <CustomTextInput
                        type="text"
                        value={username}
                        setValue={setUsername}
                        label="Username"
                    />
                    <CustomTextInput
                        type="text"
                        value={email}
                        setValue={setEmail}
                        label="Email"
                    />
                    <CustomTextInput
                        type="text"
                        value={confirmEmail}
                        setValue={setConfirmEmail}
                        label="Confirm email"
                    />
                    <CustomTextInput
                        type="text"
                        value={password}
                        setValue={setPassword}
                        label="Password"
                    />
                    <CustomTextInput
                        type="text"
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        label="Confirm password"
                    />

                    <button
                        className={`text-white  py-2 mt-2 text-bold w-full rounded-md ${
                            isLoading
                                ? "bg-button-disabled"
                                : "bg-button hover:bg-button-hovered"
                        } transition-all`}
                        onClick={register}
                        disabled={isLoading}>
                        {isLoading ? "Loading..." : "Sign up"}
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
                        <span>Sign up with Google</span>
                    </button>
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
