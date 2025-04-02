import mongoose, { model, Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subcriber: {
        type: Schema.Types.ObjectId, // one who is subscribing 
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // The main user of the channel or one to whom "subscriber" is subscribing
        ref: "User"
    },
}, { timestamps: true })


export const Subcription = mongoose.model("Subscription", subscriptionSchema)