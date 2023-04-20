import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";

interface UploadFileProps {
    onChange: (value: string) => void;
    files: string[];
}

export default function UploadFile({ onChange, files }: UploadFileProps) {
    const handleUpload = useCallback(
        (result: any) => {
            onChange(result.info.secure_url);
        },
        [onChange]
    );

    return (
        <CldUploadWidget
            onUpload={handleUpload}
            uploadPreset="Instagram Files"
            options={{ maxFiles: 10 }}>
            {({ open }) => {
                return (
                    <>
                        <div
                            className="border-2 border-white p-2 w-fit m-2 cursor-pointer hover:bg-white hover:text-black transition-all"
                            onClick={() => open?.()}>
                            Import file
                        </div>
                        <div>
                            <div>Images:</div>
                            <div>
                                {files.length > 0 &&
                                    files.map((url) => (
                                        <Image
                                            alt="Upload"
                                            height={200}
                                            width={200}
                                            src={url}
                                        />
                                    ))}
                            </div>
                        </div>
                    </>
                );
            }}
        </CldUploadWidget>
    );
}
