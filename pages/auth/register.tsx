import CustomTextInput from "@/components/customTextInput";
import HomeImageSlider from "@/components/homeImageSlider";
import { emailRegex, passwordRegex, usernameRegex } from "@/utils/regex";
import useTimeout from "@/utils/useTimeout";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineGoogle } from "react-icons/ai";

export default function Login() {
    const router = useRouter();

    const [username, setUsername] = useState<string>("");

    const [email, setEmail] = useState<string>("");
    const [confirmEmail, setConfirmEmail] = useState<string>("");

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    const timeoutRef = useTimeout(
        () => {
            setError("");
        },
        error == "" ? null : 5000
    );

    function valuesAreValid(): boolean {
        window.clearTimeout(timeoutRef.current);

        if (
            !username ||
            !email ||
            !confirmEmail ||
            !password ||
            !confirmPassword
        ) {
            setError("Some of the fields have not been filled in");
            return false;
        }

        if (!username.match(usernameRegex)) {
            setError(
                "Username does not match the allowed format: maximum length of 30 characters, only underscores and periods allowed as special characters"
            );
            return false;
        }

        if (email !== confirmEmail) {
            setError("The emails entered do not match");
            return false;
        }

        if (!email.match(emailRegex)) {
            setError("The email does not match the allowed format");
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

    const register = async () => {
        setError("");

        if (!valuesAreValid()) {
            return;
        }

        setIsLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        }).then((res) => res.json());

        console.log({ res });

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
            <div className="flex items-center justify-center md:gap-6 py-12">
                <div className="h-[36rem] w-fit hidden md:inline-block">
                    <HomeImageSlider />
                </div>

                <div>
                    <div className="w-[22rem] border-[1px] border-l-border dark:border-d-border bg-white dark:bg-black p-10 flex flex-col gap-2 items-center">
                        <div className="font-grandista text-[2.5rem] box-border text-l-txt dark:text-d-txt">
                            Instagram
                        </div>

                        <div className="my-2 text-lg text-center text-l-tsp dark:text-d-tsp">
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
                            type={showPassword ? "text" : "password"}
                            value={password}
                            setValue={setPassword}
                            label="Password"
                            isShown={showPassword}
                            setIsShown={setShowPassword}
                        />
                        <CustomTextInput
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            setValue={setConfirmPassword}
                            label="Confirm password"
                            isShown={showPassword}
                            setIsShown={setShowPassword}
                        />
                        {error ? (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        ) : null}

                        <button
                            className={`text-white  py-2 mt-2 text-bold w-full rounded-md ${
                                isLoading
                                    ? "bg-l-main-disabled dark:bg-d-main-disabled"
                                    : "bg-l-main dark:bg-d-main hover:bg-l-main-hovered hovered:dark:bg-d-main-hovered"
                            } transition-all`}
                            onClick={register}
                            disabled={isLoading}>
                            {isLoading ? "Loading..." : "Sign up"}
                        </button>

                        <div className="flex items-center justify-center w-full py-2">
                            <div className="h-[1px] bg-l-border dark:bg-d-border w-full" />
                        </div>

                        <button
                            className="flex items-center justify-center w-full gap-1 py-2 text-white transition-all rounded-md text-bold bg-l-main dark:bg-d-main hover:bg-l-main-hovered hovered:dark:bg-d-main-hovered "
                            onClick={() => signIn("google")}>
                            <AiOutlineGoogle className="text-lg" />{" "}
                            <span>Sign up with Google</span>
                        </button>
                    </div>

                    <div className="w-[22rem] border-[1px] mt-2 border-l-border dark:border-d-border bg-white dark:bg-black px-10 py-4 gap-1 flex justify-center text-l-tsp dark:text-d-tsp">
                        Already registered?{" "}
                        <Link
                            href="/auth/login"
                            className="transition-all text-l-main dark:text-d-main  font-bold hover:text-l-main-hovered dark:hover:text-l-main-hovered">
                            Sign in
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
