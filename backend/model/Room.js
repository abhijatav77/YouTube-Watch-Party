import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true,
    },
    videoId: {
        type: String,
        default: "",
    },
    currentTime: {
        type: Number,
        default: 0,
    },
    isPlaying: {
        type: Boolean,
        default: false,
    },
    hostId: {
        type: String,
        default: "",
    },
}, {timestamps: true})

export const Room = mongoose.model("Room", roomSchema)