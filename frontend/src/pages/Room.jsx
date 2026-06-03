import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import socket from '../services/socket';
import VideoPlayer from '../components/VideoPlayer';
import Participants from '../components/Participants';
import Controls from '../components/Controls';

const Room = () => {
    const { roomCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const username = location.state?.username;

    const [participants, setParticipants] = useState([])
    const [videoId, setVideoId] = useState('TQqBjSAK52s')
    const [myRole, setMyRole] = useState('Participant');
    const playerRef = useRef(null)

    const canControl = myRole === 'Host' || myRole === 'Moderator'

    useEffect(() => {

        if (!username) {
            navigate("/");
            return;
        }

        socket.emit("join_room", {
            roomCode,
            username
        })

        socket.on("user_joined", (data) => {
            setParticipants(data.participants)
            const me = data.participants.find(p => p.username === username);
            if (me) setMyRole(me.role)
        })

        socket.on("user_left", (data) => {
            setParticipants(data.participants);
        })

        socket.on("role_assigned", (data) => {
            setParticipants(data.participants)
            const me = data.participants.find(p => p.username === username);
            if (me) setMyRole(me.role)
        })

        socket.on("participant_removed", (data) => {
            if (data === undefined || data?.userId === socket.id) {
                alert("You have been removed from room");
                navigate("/");
            } else if (data?.participants) {
                setParticipants(data.participants)
            }
        })

        socket.on("host_transferred", (data) => {
            setParticipants(data.participants)
            const me = data.participants.find(p => p.username === username);
            if (me) setMyRole(me.role)
        })

        socket.on('sync_state', (state) => {
            if (state.videoId) setVideoId(state.videoId);
            if (playerRef.current) {
                if (state.isPlaying) playerRef.current.playVideo();
                else playerRef.current.pauseVideo();
                playerRef.current.seekTo(state.currentTime, true)
            }
        })

        socket.on('play', () => playerRef.current?.playVideo());
        socket.on('pause', () => playerRef.current?.pauseVideo());
        socket.on('seek', ({ time }) => playerRef.current?.seekTo(time, true));
        socket.on('change_video', ({ videoId: newId }) => {
            setVideoId(newId);
            playerRef.current?.loadVideoById(newId)
        })

        return () => {
            socket.off("user_joined");
            socket.off("user_left");
            socket.off("role_assigned");
            socket.off("participant_removed")
            socket.off("host_transferred")
            socket.off("sync_state")
            socket.off("play")
            socket.off("pause")
            socket.off("seek")
            socket.off("change_video")
        }
    }, [roomCode, username, navigate])

    const handlePlayerReady = (player) => {
        playerRef.current = player;
    }
    const handleStateChange = (event) => {
        if (!canControl) return;
        if (event.data === 1) socket.emit('play', { roomCode })
        if (event.data === 2) socket.emit('pause', { roomCode })
    };

    const leaveRoom = () => {
        if (confirm('Leave room?')) {
            socket.emit("leave_room", {
                roomCode
            });
            navigate("/")
        }
    }
    return (
        <div className='min-h-screen bg-gray-900 p-6'>
            <div className='max-w-7xl mx-auto'>
                <div className='bg-gray-800 rounded-xl p-4 mb-6 flex flex-wrap justify-between items-center gap-4 border border-gray-700'>
                    <div>
                        <h1 className='text-2xl font-bold text-white'>🎬 Watch Party</h1>
                        <p className='text-gray-400 mt-1'>Room: <span className='text-pink-500 font-mono'>{roomCode}</span></p>
                    </div>
                    <div className='text-right'>
                        <p className='text-white'>Welcome, <span className='text-pink-500'>{username}</span></p>
                        <p className={`text-sm font-semibold ${
                            myRole === 'Host' ? 'text-red-500' : myRole === 'Moderator' ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                            {myRole}
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2 space-y-4'>
                        <VideoPlayer
                            videoId = {videoId}
                            onReady = {handlePlayerReady}
                            onStateChange = {handleStateChange}
                            canControl={canControl}
                        />
                        <Controls roomCode = {roomCode} canControl = {canControl} />
                    </div>

                    <Participants 
                        participants={participants}
                        currentUserId = {socket.id}
                        myRole = {myRole}
                        roomCode = {roomCode}
                    />
                </div>

                <div className='mt-6'>
                    <button
                        onClick={leaveRoom}
                        className='w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition'
                    >
                        🚪 Leave Room
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Room