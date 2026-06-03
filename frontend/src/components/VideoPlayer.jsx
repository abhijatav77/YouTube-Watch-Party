import React from 'react'
import YouTube from 'react-youtube'

const VideoPlayer = ({videoId, onReady, onStateChange, canControl }) => {
  const opts = {
    height: '450',
    width: '100%',
    playerVars: {
      controls: 1,
      modestbranding: 1, 
      autoPlay: 0
    },
  }

  const handleReady = (event) => {
    if (onReady) onReady(event.target);
  }
  return (
    <div className='bg-black rounded-xl overflow-hidden border border-gray-700'>
      <YouTube 
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={onStateChange}
      />

      {!canControl && (
        <div
          className='absolute inset-0 bg-transparent cursor-not-allowed'
          style={{
            zIndex: 10,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: 'not-allowed',
            backgroundColor: 'transparent'
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        />
      )}
    </div>
  )
}

export default VideoPlayer