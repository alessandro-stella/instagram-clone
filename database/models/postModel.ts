import { Schema, models, model } from "mongoose";

export interface PostType {
    ownerId: string;
    content: string[];
    likes: number;
}

const postSchema = new Schema({
    ownerId: {
        type: String,
        required: true,
    },
    content: {
        type: Array,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
});

const Post = models.Post || model("Post", postSchema);

export default Post;
