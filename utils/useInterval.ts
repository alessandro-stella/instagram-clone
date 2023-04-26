import { useEffect, useRef } from "react";

export default function useInterval(callback: any, delay: number | null) {
    const intervalRef = useRef<number | undefined>();
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (typeof delay === "number") {
            intervalRef.current = window.setInterval(
                () => callbackRef.current(),
                delay
            );

            return () => window.clearInterval(intervalRef.current);
        }
    }, [delay]);

    return intervalRef;
}
