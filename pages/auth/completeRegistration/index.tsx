import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CompleteRegistration() {
    const router = useRouter();

    useEffect(() => {
        router.push("/auth/login");
    }, [router]);

    return;
}
