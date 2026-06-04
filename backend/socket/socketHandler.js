import { rooms } from "./roomStore.js";

const canControlVideo = (role) => {
    return (
        role === "Host" || role === "Moderator"
    )
}

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("Connected", socket.id)

        socket.on("join_room", ({ roomCode, username }) => {
            if (!rooms[roomCode]) {
                rooms[roomCode] = {
                    participants: [],

                    videoState: {
                        videoId: "TQqBjSAK52s",
                        currentTime: 0,
                        isPlaying: false,
                    },
                };
            }
            const role = rooms[roomCode].participants.length === 0 ? "Host" : "Participant";

            const participant = {
                socketId: socket.id,
                username,
                role,
            };

            if (!username?.trim()) {
                return;
            }

            rooms[roomCode].participants.push(participant);

            socket.join(roomCode);

            console.log(`${username} joined ${roomCode}`)

            socket.emit("sync_state", rooms[roomCode].videoState)

            io.to(roomCode).emit("user_joined", {
                username,
                userId: socket.id,
                role,
                participants: rooms[roomCode].participants
            })
        })

        socket.on("play", ({ roomCode }) => {
            const currentUser = rooms[roomCode]?.participants?.find(user => user.socketId === socket.id)

            if (!currentUser) return

            if (!canControlVideo(currentUser.role)) {
                return;
            }

            rooms[roomCode].videoState.isPlaying = true;

            if (socket.currentTime) {
                rooms[roomCode].videoState.currentTime =
                    socket.currentTime;
            }

            io.to(roomCode).emit("play")

            console.log(`${currentUser.username} pressed play`)
        })

        socket.on("pause", ({ roomCode }) => {
            const currentUser = rooms[roomCode]?.participants?.find(user => user.socketId === socket.id)

            if (!currentUser) return;

            if (!canControlVideo(currentUser.role)) {
                return;
            }

            rooms[roomCode].videoState.isPlaying = false;

            io.to(roomCode).emit("pause")

            console.log(`${currentUser.username} pressed pause`)
        })

        socket.on("seek", ({ roomCode, time }) => {
            const currentUser = rooms[roomCode]?.participants?.find(user => user.socketId === socket.id)

            if (!currentUser) return;

            if (!canControlVideo(currentUser.role)) {
                return;
            }

            rooms[roomCode].videoState.currentTime = time
            socket.currentTime = time

            socket.to(roomCode).emit("seek", { time })

            console.log(`${currentUser.username} seeked to ${time}`)
        })

        socket.on("update_time", ({ roomCode, currentTime }) => {
            if (!rooms[roomCode]) return;

            rooms[roomCode].videoState.currentTime = currentTime;
        });

        socket.on("change_video", ({ roomCode, videoId }) => {
            const currentUser =
                rooms[roomCode]?.participants?.find(
                    user => user.socketId === socket.id
                );

            if (!currentUser) return;

            if (!canControlVideo(currentUser.role)) return;

            rooms[roomCode].videoState.videoId = videoId;
            rooms[roomCode].videoState.currentTime = 0;
            rooms[roomCode].videoState.isPlaying = false;

            io.to(roomCode).emit("change_video", { videoId });
        });

        socket.on("assign_role", ({ roomCode, userId, role }) => {
            const currentUser = rooms[roomCode]?.participants?.find(user => user.socketId === socket.id)

            if (!currentUser) return;

            if (currentUser.role !== "Host") {
                return;
            }

            const targetUser = rooms[roomCode]?.participants?.find(user => user.socketId == userId)

            if (!targetUser) return;

            const validRoles = [
                "Host",
                "Moderator",
                "Participant"
            ];

            if (!validRoles.includes(role)) {
                return;
            }

            targetUser.role = role;

            io.to(roomCode).emit("role_assigned", {
                userId,
                username: targetUser.username,
                role,
                participants: rooms[roomCode].participants
            })

            console.log(`${targetUser.username} is now ${role}`)
        })

        socket.on("remove_participant", ({ roomCode, userId }) => {
            const currentUser = rooms[roomCode]?.participants?.find(user => user.socketId === socket.id)

            if (!currentUser) return;

            if (currentUser.role !== "Host") {
                return;
            }

            const targetUser = rooms[roomCode]?.participants?.find(user => user.socketId === userId)

            if (!targetUser) return;

            rooms[roomCode].participants = rooms[roomCode].participants.filter(user => user.socketId !== userId)

            io.to(userId).emit("participant_removed");

            io.to(roomCode).emit("participant_removed", {
                userId,
                participants: rooms[roomCode].participants
            })

            console.log(`${targetUser.username} removed from room`)
        })

        socket.on("transfer_host", ({ roomCode, userId }) => {
            const currentUser = rooms[roomCode]?.participants?.find(user => user.socketId === socket.id)

            if (!currentUser) return;

            if (currentUser.role !== 'Host') {
                return;
            }

            const targetUser = rooms[roomCode]?.participants?.find(user => user.socketId === userId)

            if (!targetUser) return;

            currentUser.role = "Participant";

            targetUser.role = "Host"

            io.to(roomCode).emit("host_transferred", {
                previousHostId: currentUser.socketId,
                previousHostName: currentUser.username,

                newHostId: targetUser.socketId,
                newHostName: targetUser.username,

                participants: rooms[roomCode].participants
            })

            console.log(`Host transffered from ${currentUser.username} to ${targetUser.username}`)
        })

        socket.on("leave_room", ({ roomCode }) => {
            const currentUser = rooms[roomCode]?.participants?.find(user => user.socketId === socket.id);

            if (!currentUser) return

            rooms[roomCode].participants = rooms[roomCode].participants.filter(user => user.socketId !== socket.id);

            const updatedParticipants = rooms[roomCode].participants;

            socket.leave(roomCode)

            io.to(roomCode).emit("user_left", {
                username: currentUser.username,
                userId: currentUser.socketId,
                participants: updatedParticipants
            })

            if (updatedParticipants.length === 0) {
                delete rooms[roomCode]
            }

            console.log(`${currentUser.username} left room`)
        })

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id)

            Object.keys(rooms).forEach(
                (roomCode) => {
                    const currentUser = rooms[roomCode].participants.find(user => user.socketId === socket.id)

                    if (!currentUser) return;

                    rooms[roomCode].participants = rooms[roomCode].participants.filter(user => user.socketId !== socket.id)

                    const updateParticipants = rooms[roomCode].participants;

                    io.to(roomCode).emit("user_left", {
                        username: currentUser.username,
                        userId: currentUser.socketId,
                        participants: updateParticipants
                    })

                    if (updateParticipants.length === 0) {
                        delete rooms[roomCode]
                    }

                    console.log(`${currentUser.username} disconnected`)
                }
            )
        })
    });
}

export default socketHandler