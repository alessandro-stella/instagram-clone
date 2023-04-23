import CustomTextInput from "@/components/customTextInput";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Login() {
    const router = useRouter();
    const { data: user } = useSession();
    console.log(user);

    useEffect(() => {
        if (user) router.push("/");
    }, [user, router]);

    const [email, setEmail] = useState<string>(
        "alessandro.stella2004@gmail.com"
    );
    const [password, setPassword] = useState<string>("Negro123@_");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const login = async () => {
        setIsLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res && res.ok) {
            router.push("/");
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

            {isLoading ? (
                <button disabled={true}>Loading...</button>
            ) : (
                <button onClick={login}>Login</button>
            )}

            <button onClick={() => signIn("google")}>Login with Google</button>
        </div>
    );
}
