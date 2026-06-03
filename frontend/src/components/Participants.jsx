import React from 'react'
import socket from '../services/socket'

const Participants = ({ participants, currentUserId, myRole, roomCode }) => {

    const assignRole = (userId, role) => {
        socket.emit('assign_role', {roomCode, userId, role})
    }

    const removeParticipant = (userId, name) => {
        if(confirm(`Remove ${name} from room?`)) {
            socket.emit('remove_participant', {roomCode, userId})
        }
    };

    const transferHost = (userId, name) => {
        if(confirm(`'Transfer host to ${name}`)) {
            socket.emit('transfer_host', {roomCode, userId})
        }
    }

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        alert('Room code copied!')
    };

    return (
        <div className='space-y-4'>
            <div className='bg-gray-800 rounded-xl p-4 border border-gray-700'>
                <h3 className='text-white font-semibold mb-3 flex justify-between'>
                    <span>👥 Participants</span>
                    <span className='bg-gray-700 px-2 py-1 rounded text-xs'>{participants.length}</span>
                </h3>

                <div className='space-y-2 max-h-96 overflow-y-auto'>
                    {participants.map((p) => (
                        <div
                            key={p.socketId}
                            className={`bg-gray-700 rounded-lg p-3 ${
                                p.socketId === currentUserId ? 'border-2 border-pink-500' : ''
                            }`}
                        >
                            <div className='flex justify-between items-start'>
                                <div>
                                    <span className='text-white font-medium'>{p.username}</span>
                                    <span
                                        className={`ml-2 text-xs px-2 py-0.5 rounded ${p.role === 'Host' ? 'bg-red-600' : p.role === 'Moderator' ? 'bg-green-600' : 'bg-gray-600'}`}
                                    >
                                        {p.role}
                                    </span>
                                    {p.socketId === currentUserId && (
                                        <span className='ml-2 text-xs text-pink-400'>(You)</span>
                                    )}
                                </div>
                            </div>

                            {myRole === 'Host' && p.socketId !== currentUserId && (
                                <div className='flex gap-2 mt-2'>
                                    <select
                                        value={p.role}
                                        onChange={(e) => assignRole(p.socketId, e.target.value)}
                                        className='bg-gray-600 text-white text-sm px-2 py-1 rounded focus:outline-none'
                                    >
                                        <option>Participant</option>
                                        <option>Moderator</option>
                                        <option>Host</option>
                                    </select>
                                    <button
                                        onClick={() => removeParticipant(p.socketId, p.username)}
                                        className='bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700'
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => transferHost(p.socketId, p.username)}
                                        className='bg-orange-600 px-3 py-1 rounded text-sm hover:bg-orange-700'
                                    >
                                        Transfer
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {participants.length === 0 && (
                        <div className='text-center text-gray-400 py-8'>
                            <p>No participants yet</p>
                            <p className='text-sm'>Share room code to invite friends!</p>
                        </div>
                    )}
                </div>
            </div>

            <div className='bg-gray-800 rounded-xl p-4 border border-gray-700'>
                <h3 className='text-white font-semibold mb-3'>⚙️ Room Actions</h3>
                <button
                    onClick={copyRoomCode}
                    className='w-full bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition'
                >
                    📋 Copy Room Code
                </button>
            </div>

            <div className='bg-gray-800 rounded-xl p-4 border border-gray-700 text-center'>
                <p className='text-gray-400 text-sm'>
                    💡<span className='text-pink-500'>Host</span> = Full control<br />
                    🟢<span className='text-green-500'>Moderator</span> = Can control video<br />
                    👤<span className='text-yellow-500'>Participants</span> = Watch only<br />
                </p>
            </div>
        </div>
    )
}

export default Participants