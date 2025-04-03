import mongoose, { model, Schema } from "mongoose"

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            req: true,
        },
        Owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },
    { timestamps: true })

export const Tweet = mongoose.model("Tweet", tweetSchema)