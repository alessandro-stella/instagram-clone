import CustomTextInput from "@/components/customTextInput";
import HomeImageSlider from "@/components/homeImageSlider";
import { dbConnection } from "@/database/dbConnection";
import TempUser from "@/database/models/tempUserModel";
import { passwordRegex, usernameRegex } from "@/utils/regex";
import useTimeout from "@/utils/useTimeout";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

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
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [hasRegistered, setHasRegistered] = useState<boolean>(false);

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

        if (res) {
            if (res.success) {
                setHasRegistered(true);

                const loginRes = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                }).then((res) => {
                    return res;
                });

                if (loginRes) {
                    if (loginRes.ok) {
                        router.push("/");

                        return;
                    }

                    if (loginRes.error) {
                        setError(res.error);
                        setIsLoading(false);
                    }
                }
            }

            if (res.error) {
                setError(res.error);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen h-fit grid place-content-center">
            <div className="flex items-center justify-center gap-6 py-12">
                <div className="h-[36rem] w-fit hidden md:inline-block">
                    <HomeImageSlider />
                </div>
                <div>
                    <div className="w-[22rem] border-[1px] border-slate-300 p-10 flex flex-col gap-2 items-center">
                        <div className="font-grandista text-[2.5rem] box-border">
                            Instagram
                        </div>
                        <div className="text-lg text-slate-600 text-center my-2">
                            Just a few steps and your account will be set
                            successfully
                        </div>
                        <CustomTextInput
                            label="Username"
                            type="text"
                            value={username}
                            setValue={setUsername}
                        />
                        <CustomTextInput
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            value={password}
                            setValue={setPassword}
                            isShown={showPassword}
                            setIsShown={setShowPassword}
                        />
                        <CustomTextInput
                            type={showPassword ? "text" : "password"}
                            label="Confirm password"
                            value={confirmPassword}
                            setValue={setConfirmPassword}
                            isShown={showPassword}
                            setIsShown={setShowPassword}
                        />

                        {error ? (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        ) : null}

                        {hasRegistered && (
                            <div>
                                <span className="text-button font-bold">
                                    Done!
                                </span>{" "}
                                Your account has been successfully created,
                                we're finishing the last touch...
                            </div>
                        )}

                        <button
                            className={`text-white py-2 mt-2 text-bold w-full rounded-md ${
                                isLoading
                                    ? "bg-l-main-disabled dark:bg-d-main-disabled"
                                    : "bg-l-main dark:bg-d-main hover:bg-l-main-hovered hovered:dark:bg-d-main-hovered "
                            } transition-all`}
                            onClick={handleConfirm}
                            disabled={isLoading}>
                            {isLoading ? "Loading..." : "Complete registration"}
                        </button>
                    </div>

                    <div className="w-[22rem] border-[1px] mt-2 border-slate-300 px-10 py-4 gap-1 flex justify-center">
                        <Link
                            href="/auth/register"
                            className="text-button font-bold hover:text-button-hovered">
                            Go back
                        </Link>
                    </div>
                </div>
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
