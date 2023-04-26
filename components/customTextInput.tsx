import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";

interface InputParameters {
    type: string;
    value: string;
    label: string;
    setValue: Dispatch<SetStateAction<string>>;
}

export default function CustomTextInput({
    type,
    value,
    label,
    setValue,
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
            className={`w-full relative h-12 bg-white border-[1px] hover:cursor-text rounded-md transition-all ${
                isFocused ? "border-slate-500" : "border-slate-300"
            }`}
            onClick={handleClick}>
            <div
                className={`w-full absolute px-2 text-slate-300 flex items-center pointer-events-none transition-all ${
                    value != "" ? "h-1/2 text-xs" : "h-full text-base"
                }`}>
                {label}
            </div>

            <input
                ref={inputRef}
                className={`w-full p-2 transition-all outline-none bg-transparent ${
                    value != "" ? "h-1/2 mt-5 text-sm" : "h-full"
                }`}
                type={type}
                value={value}
                onChange={(e) => handleChange(e)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </div>
    );
}
