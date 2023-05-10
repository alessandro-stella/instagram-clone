import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface InputParameters {
    type: string;
    value: string;
    label: string;
    setValue: Dispatch<SetStateAction<string>>;
    isShown?: boolean;
    setIsShown?: Dispatch<SetStateAction<boolean>> | null;
}

export default function CustomTextInput({
    type,
    value,
    label,
    setValue,
    isShown,
    setIsShown = null,
}: InputParameters) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleClick = () => {
        if (inputRef.current) inputRef.current.focus();
    };

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    return (
        <div
            className={`w-full relative h-12 bg-l-bg dark:bg-d-bg border-[1px] hover:cursor-text rounded-md transition-all ${
                isFocused
                    ? "border-l-tsp dark:border-d-tsp"
                    : "border-l-border dark:border-d-border"
            }`}
            onClick={handleClick}>
            <div
                className={`w-full absolute px-2 text-l-tsp dark:text-d-tsp flex items-center pointer-events-none transition-all ${
                    value != "" ? "h-1/2 text-xs" : "h-full text-base"
                }`}>
                {label}
            </div>

            <input
                ref={inputRef}
                className={`w-full p-2 transition-all outline-none bg-transparent text-l-txt dark:text-d-txt ${
                    value != "" ? "h-1/2 mt-5 text-sm" : "h-full"
                } ${setIsShown ? "pr-8" : ""}`}
                type={type}
                value={value}
                onChange={(e) => handleChange(e)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {setIsShown && (
                <div
                    className="absolute right-0 top-0 h-full grid place-content-center px-2 cursor-pointer text-l-tsp dark:text-d-tsp"
                    onClick={() => setIsShown((currentValue) => !currentValue)}>
                    {isShown ? <AiFillEye /> : <AiFillEyeInvisible />}
                </div>
            )}
        </div>
    );
}
