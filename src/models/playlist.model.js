import mongoose, { model, Schema } from "mongoose"

const playlistSchema = new Schema({
    name: {
        type: String,
        req: true,
    },
    description: {
        type: String,
        req: true,
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    Owner: {
        type: Schema.Types.ObjectId,
        ref: "User"

    }

}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playlistSchema)