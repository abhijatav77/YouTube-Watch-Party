import { Room } from "../model/Room.js"
import generateRoomCode from "../utils/generateRoomCode.js"


export const createRoom = async(req, res) => {
    try {
        const roomCode = generateRoomCode()

        const room = await Room.create({
            roomCode,
        });

        res.status(201).json({
            success: true,
            room,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const joinRoom = async(req, res) => {
    try {
        const {roomCode} = req.body;
        const room = await Room.findOne({roomCode})
        if(!room){
            return res.status(404).json({
                success: false,
                message: "Room not found"
            })
        }

        return res.status(200).json({
            success: true,
            room
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}