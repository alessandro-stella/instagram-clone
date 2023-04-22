import { Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";
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
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: { unique: true },
        },
        password: {
            type: String,
            required: true,
        },

        followed: {
            type: Array,
            default: [],
        },
        posts: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

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
