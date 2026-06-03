import React, { useState } from 'react'
import socket from '../services/socket';

const Controls = ({roomCode, canControl}) => {
  const [newUrl, setNewUrl] = useState('')

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/);
    return match ? match[1] : null;
  };

  const handlePlay = () => {
    socket.emit('play', {roomCode})
  };
  const handlePause = () => {
    socket.emit('pause', {roomCode})
  };

  const handleChangeVideo = () => {
    if(!newUrl.trim()) return alert('Enter YouTube URL');
    const videoId = extractVideoId(newUrl)
    if(!videoId) return alert('Invalid YouTube URL');
    socket.emit('change_video', {roomCode, videoId});
    setNewUrl('');
  }

  if(!canControl) {
    return (
      <div className='bg-gray-800 rounded-xl p-4 text-center border border-gray-700'>
        <p className='text-gray-400'>
          🎥 You are in <span className='text-yellow-500'>watch-only mode</span>
        </p>
      </div>
    )
  }
  return (
    <div className='bg-gray-800 rounded-xl p-4 border border-gray-700'>
      <h3 className='text-white font-semibold mb-3'>🎮 Video Controls</h3>
      <div className='flex gap-2 flex-wrap'>
        <button onClick={handlePlay} className='bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 text-white'>
           ▶ Play
        </button>
        <button onClick={handlePause} className='bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 text-white'>
          ⏸ Pause
        </button>
        <input 
          type="text"
          placeholder='Paste YouTube URL'
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className='flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-600'
        />
        <button onClick={handleChangeVideo} className='bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 text-white font-semibold'>
          Change
        </button>
      </div>
    </div>
  )
}

export default Controls