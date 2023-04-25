import { Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const SALT_WORK_FACTOR = 16;

export interface userType {
    username: string;
    email: string;
    password: string;
    followed: string[];
    posts: string[];
}

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            match: [/^[a-zA-Z0-9_.]+$/, "Invalid username"],
            maxLength: [30, "Username can be up to 30 characters long"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                "Invalid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        bio: {
            type: String,
            default: "",
        },
        followed: {
            type: Array,
            default: [],
        },
        posts: {
            type: Array,
            default: [],
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            default: () => generateSafeRandomString(32),
        },
    },
    { timestamps: true }
);

const generateSafeRandomString = (length: number) =>
    crypto.randomBytes(length / 2).toString("hex");

userSchema.pre("save", async function save(next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);

        return next();
    } catch (err: any) {
        return next(err);
    }
});

userSchema.methods.validatePassword = async function validatePassword(
    data: string
) {
    return bcrypt.compare(data, this.password);
};

const User = models.User || model("User", userSchema);

export default User;
