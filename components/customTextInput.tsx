import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface InputParameters {
    type: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}

export default function CustomTextInput({
    type,
    value,
    setValue,
}: InputParameters) {
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    return (
        <input type={type} value={value} onChange={(e) => handleChange(e)} />
    );
}
