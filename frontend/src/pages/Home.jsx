import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../services/api';

const Home = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [loading, setLoading] = useState(false)

    const createRoom = async () => {

        if (!username.trim()) {
            alert("Enter username");
            return;
        }
        setLoading(true)
        try {
            const res = await axios.post(`${BACKEND_URL}/rooms/create`);
            navigate(`/room/${res.data.room.roomCode}`, {
                state: { username: username.trim() }
            })
        } catch (error) {
            alert("Failed to create room")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const joinRoom = async () => {

        if (!username.trim()) {
            alert("Enter username");
            return;
        }

        if (!roomCode.trim()) {
            alert("Enter room code");
            return;
        }

        setLoading(true)

        try {
            const res = await axios.post(`${BACKEND_URL}/rooms/join`, { roomCode })
            if (res.data.success) {
                navigate(`/room/${roomCode}`, {
                    state: { username: username.trim() }
                })
            }
        } catch (error) {
            alert("Room not found")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center p-4'>
            <div className='bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700 '>

                <div className='text-center mb-8'>
                    <div className='text-6xl mb-4'>🎬</div>
                    <h1 className='text-3xl font-bold text-white mb-2'>YouTube Watch Party</h1>
                    <p className='text-gray-400 text-sm'>Watch YouTube together in real-time</p>
                </div>

                <div className='mb-4'>
                    <input
                    type="text"
                    placeholder='👤 Your username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:border-pink-500 focus:outline-none text-white placeholder-gray-400 transition-colors'
                    disabled={loading}
                />
                </div>

                <button 
                    onClick={createRoom}
                    disabled = {loading}
                    className='w-full bg-pink-600 text-white font-semibold py-3 rounded-xl hover:bg-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mb-6'
                >
                    {loading ? (
                        <span className='flex items-center justify-center gap-2'>
                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            Creating...
                        </span>
                    ) : (
                        "✨ Create New Room"
                    )}
                </button>

                <div className='relative my-6'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gray-700'></div>
                    </div>
                    <div className='relative flex justify-center'>
                        <span className='bg-gray-800 px-4 text-gray-500 text-sm'>or join existing</span>
                    </div>
                </div>

                <div className='mb-4'>
                    <input 
                        type="text" 
                        placeholder='🔑 Room code'
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:border-pink-500 focus:outline-none text-white placeholder-gray-400 transition-colors'
                    />
                </div>

                <button
                    onClick={joinRoom}
                    disabled = {loading}
                    className='w-full bg-transparent border-2 border-pink-600 text-white font-semibold py-3 rounded-xl hover:bg-pink-600 hover:text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? (
                        <span className='flex items-center justify-center gap-2'>
                            <div className='w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin'></div>
                            Joining...
                        </span>
                    ) : (
                        "🔗 Join Room"
                    )}
                </button>
            </div>
        </div>
    )
}

export default Home