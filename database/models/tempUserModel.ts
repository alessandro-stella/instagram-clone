import { Schema, models, model } from "mongoose";

const tempUserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email address"],
    },
    createdAt: { type: Date, expires: "3min", default: Date.now },
});

const TempUser = models.TempUser || model("TempUser", tempUserSchema);

export default TempUser;
