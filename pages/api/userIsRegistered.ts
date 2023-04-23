import User from "@/database/models/userModel";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ userExists: boolean }>
) {
    const { email } = JSON.parse(req.body) as {
        email: string;
    };

    console.log({ email });

    const user: any = await User.findOne({ email });

    console.log({ user });

    return res
        .status(user ? 200 : 400)
        .json({ userExists: user ? true : false });
}
