import useInterval from "@/utils/useInterval";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HomeImageSlider() {
    const imageRefs = [useRef(null), useRef(null), useRef(null)];
    const [index, setIndex] = useState<number>(0);

    const animationRef = useInterval(() => {
        setIndex(index + 1 >= 3 ? 0 : index + 1);
    }, 5000);

    useEffect(() => {
        return () => clearInterval(animationRef.current);
    }, []);

    return (
        <div className="h-full bg-emerald-300 aspect-[1024/1700] relative">
            <Image src="/Background.png?" alt="Background" fill />

            {imageRefs.map((ref, i) => (
                <Image
                    key={i}
                    ref={ref}
                    src={`/Samsung${i + 1}.png`}
                    alt="Screenshots"
                    fill
                    style={{ opacity: index == i ? 1 : 0 }}
                    className="transition-all duration-1000"
                />
            ))}

            <Image src="/PhoneFrames.png" alt="Phone Frames" fill />
        </div>
    );
}