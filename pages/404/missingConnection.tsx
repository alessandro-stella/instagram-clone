import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Page404() {
    const { push } = useRouter();

    useEffect(() => {
        const checkConnection = async () => {
            let isConnected: boolean = await fetch("/api/checkConnection")
                .then((res) => res.json())
                .then((res) => res.isConnected);

            console.log(`Is connected: ${isConnected}`);

            if (isConnected) {
                push("/");
            }
        };

        checkConnection();
    }, [push]);

    return <div className="text-4xl">NOT CONNECTED!</div>;
}
