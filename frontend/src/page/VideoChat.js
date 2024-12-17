import React from 'react'
import { useParams } from 'react-router'

const VideoChat = () => {
    const roomid=useParams().roomid;
  return (
    <div>VideoChat-{roomid}</div>
  )
}

export default VideoChat