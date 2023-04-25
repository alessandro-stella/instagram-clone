import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";

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

    const handleClick = () => {
        if (inputRef.current) inputRef.current.focus();
    };

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    return (
        <div
            className="w-full relative h-12 bg-white border-[1px] border-slate-300 hover:cursor-text rounded-md"
            onClick={handleClick}>
            <div
                className={`w-full text-slate-400 absolute px-2 flex items-center pointer-events-none transition-all ${
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
            />
        </div>
    );
}
