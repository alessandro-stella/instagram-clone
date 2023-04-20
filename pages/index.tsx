import { GetServerSideProps } from "next";
import dbConnection from "@/database/dbConnection";
import UploadFile from "@/components/uploadFile";
import { useEffect, useState } from "react";

export default function Home() {
    const [dataUrl, setDataUrl] = useState<string[]>([]);

    useEffect(() => {
        console.log(dataUrl);
    }, [dataUrl]);

    return (
        <div>
            <div>Import image</div>
            <UploadFile
                files={dataUrl}
                onChange={(value: string) => {
                    setDataUrl([...dataUrl, value]);
                }}
            />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let isConnected: boolean = await dbConnection();

    if (!isConnected)
        return {
            redirect: {
                destination: "/404/missingConnection",
                permanent: false,
            },
        };

    return {
        props: {},
    };
};
