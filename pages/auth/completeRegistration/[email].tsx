import CustomTextInput from "@/components/customTextInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CompleteRegistration() {
    const router = useRouter();
    const { email } = router.query as { email: string };

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    useEffect(() => {
        if (!email) return;

        if (!email.match(emailRegex)) {
            router.push("/auth/login");
        }

        const checkIfRegistered = async () => {
            const isRegistered = await fetch("/api/userIsRegistered", {
                method: "POST",
                body: JSON.stringify({ email }),
            })
                .then((res) => res.json())
                .then((res) => res.userExists);

            if (isRegistered) {
                router.push("/");
            }
        };

        checkIfRegistered();
        setIsLoading(false);
    }, [email]);

    const handleConfirm = async () => {
        setIsLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        }).then((res) => res.json());

        setIsLoading(false);

        if (res.success) {
            router.push("/");
        }
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
                </div>
            ) : (
                <div>loading</div>
            )}
        </>
    );
}
