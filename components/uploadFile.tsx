import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function UploadFile() {
    const [dataUrl, setDataUrl] = useState<string[]>([]);

    useEffect(() => {
        console.log(dataUrl);
    }, [dataUrl]);

    const handleUpload = useCallback(
        (result: any) => {
            setDataUrl([...dataUrl, result.info.secure_url]);
        },
        [dataUrl, setDataUrl]
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
                                {dataUrl.length > 0 &&
                                    dataUrl.map((url, index) => (
                                        <Image
                                            key={index}
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
