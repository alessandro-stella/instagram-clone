import User from "@/database/models/userModel";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PageProps {
    success: boolean;
    error: boolean;
    invalidCode: boolean;
    alreadyVerified: boolean;
}

export default function VerifyAccount({
    success,
    error,
    invalidCode,
    alreadyVerified,
}: PageProps) {
    const [title, setTitle] = useState<string>("");
    const [text, setText] = useState<string>("");

    useEffect(() => {
        if (success) {
            setTitle("Account verified!");
            setText(
                "Your account has been verified successfully! Now you can access all the functionalities of Instagram"
            );

            return;
        }

        if (error) {
            setTitle("Ops!");
            setText(
                "Seems like an error occurred during the process, please try again"
            );

            return;
        }

        if (invalidCode) {
            setTitle("Invalid link!");
            setText(
                "The account you are trying to verify does not exist or the link you are using is invalid, please try again"
            );

            return;
        }

        if (alreadyVerified) {
            setTitle("Account verified!");
            setText("Your account is already verified!");

            return;
        }
    }, []);

    return (
        <div className="flex flex-col gap-2 p-4 m-8 bg-violet-500">
            <div className="text-4xl font-bold">{title}</div>
            <div className="text-2xl">{text}</div>
            <Link
                href="/"
                className="p-2 transition-all bg-red-500 hover:bg-red-400 w-fit hover:cursor-pointer">
                Go to the home
            </Link>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { verificationCode } = context.query;

    const user = await User.findOne({ verificationCode });

    if (!user)
        return {
            props: {
                invalidCode: true,
            },
        };

    if (user.verified) {
        return {
            props: {
                alreadyVerified: true,
            },
        };
    }

    try {
        user.verified = true;
        await user.save();

        return {
            props: {
                success: true,
            },
        };
    } catch (_) {
        return {
            props: {
                error: true,
            },
        };
    }
};
