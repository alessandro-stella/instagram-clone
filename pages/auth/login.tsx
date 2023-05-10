import CustomTextInput from "@/components/customTextInput";
import HomeImageSlider from "@/components/homeImageSlider";
import useTimeout from "@/utils/useTimeout";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineGoogle } from "react-icons/ai";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

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
        <div className="min-h-screen h-fit grid place-content-center bg-l-bg dark:bg-d-bg">
            <div className="flex items-center justify-center gap-6 py-12">
                <div className="h-[36rem] w-fit hidden md:inline-block">
                    <HomeImageSlider />
                </div>

                <div>
                    <div className="w-[22rem] border-[1px] border-l-border dark:border-d-border bg-white dark:bg-black p-10 flex flex-col gap-2 items-center">
                        <div className="font-grandista text-[2.5rem] box-border text-l-txt dark:text-d-txt">
                            Instagram
                        </div>

                        <div className="text-lg text-center my-2 text-l-tsp dark:text-d-tsp">
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
                            type={showPassword ? "text" : "password"}
                            value={password}
                            setValue={setPassword}
                            label="Password"
                            isShown={showPassword}
                            setIsShown={setShowPassword}
                        />
                        {error ? (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        ) : null}

                        <button
                            className={`text-white py-2 mt-2 text-bold w-full rounded-md ${
                                isLoading
                                    ? "bg-l-main-disabled dark:bg-d-main-disabled"
                                    : "bg-l-main dark:bg-d-main hover:bg-l-main-hovered hovered:dark:bg-d-main-hovered "
                            } transition-all`}
                            onClick={login}
                            disabled={isLoading}>
                            {isLoading ? "Loading..." : "Log in"}
                        </button>

                        <div className="flex items-center justify-center w-full py-2">
                            <div className="h-[1px] bg-l-border dark:bg-d-border w-full" />
                        </div>

                        <button
                            className="flex items-center justify-center w-full gap-1 py-2 text-white transition-all rounded-md text-bold bg-l-main dark:bg-d-main hover:bg-l-main-hovered hovered:dark:bg-d-main-hovered "
                            onClick={() => signIn("google")}>
                            <AiOutlineGoogle className="text-lg" />{" "}
                            <span>Log in with Google</span>
                        </button>
                    </div>

                    <div className="w-[22rem] border-[1px] mt-2 border-l-border dark:border-d-border bg-white dark:bg-black px-10 py-4 gap-1 flex justify-center text-l-tsp dark:text-d-tsp">
                        Already registered?{" "}
                        <Link
                            href="/auth/register"
                            className="transition-all text-l-main dark:text-d-main  font-bold hover:text-l-main-hovered dark:hover:text-l-main-hovered">
                            Sign up
                        </Link>
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
