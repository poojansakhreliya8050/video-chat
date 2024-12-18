import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';

import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { MdCallEnd } from "react-icons/md";
import ToggleButton from '../component/ToggleButton';


const VideoChat = () => {

  const user = useSelector(state => state.user?.user);

  const [cameraOn, setCameraOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);


  const [users, setUsers] = useState([]); // List of users
  const peerConnections = useRef({}); // List of peer connections
  const localStream = useRef(null);

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const socket = useRef(null);
  const roomid = useParams().roomid;

  const startMediaStream = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    addVideoStream(user, localStream.current);
  };

  const addVideoStream = (label, stream) => {
    if (!document.getElementById(label)) {
      const video = document.createElement("video");
      video.style = "height: 300px; width: 30vw; border: 2px solid black";
      video.srcObject = stream;
      video.id = label;
      video.autoplay = true;
      document.getElementById("videos").appendChild(video);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStream.current.getTracks().find(track => track.kind === 'video');
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStream.current.getTracks().find(track => track.kind === 'audio');
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioOn(audioTrack.enabled);
    }
  };

  const endMeeting = () => {
    socket.current.emit("leave-room", roomid, socket.current.id);
    socket.current.disconnect();
    window.location.href = '/';
  };

  useEffect(() => {

    if (!socket.current) {
      socket.current = io("http://localhost:8000");
    }

    console.log(socket);


    socket.current.on("connect", async () => {

      await startMediaStream();
      console.log("Connected with ID:", socket.current.id);

      socket.current.emit("join-room", roomid, socket.current.id);

      socket.current.on("user-connected", async (userId) => {
        console.log("user connected: " + userId);
        setUsers((prev) => [...prev, userId]);

        const pc = new RTCPeerConnection(configuration);
        peerConnections.current[userId] = pc;

        // Add local tracks
        localStream.current.getTracks().forEach((track) => pc.addTrack(track, localStream.current));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit("ice-candidate", { to: userId, candidate: event.candidate });
          }
        }

        pc.ontrack = (event) => {
          addVideoStream(userId, event.streams[0]);
        }

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("sending offer to: " + userId);
        socket.current.emit("offer", { to: userId, offer });
      });

      socket.current.on("offer", async (data) => {
        console.log("offer from: " + data.from + " to: " + data.to);
        const pc = new RTCPeerConnection(configuration);
        peerConnections.current[data.from] = pc;

        localStream.current.getTracks().forEach((track) => pc.addTrack(track, localStream.current));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit("ice-candidate", { to: data.from, candidate: event.candidate });
          }
        };

        pc.ontrack = (event) => {
          addVideoStream(data.from, event.streams[0]);
        };
        console.log(data);


        await pc.setRemoteDescription(data.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.current.emit("answer", { to: data.from, answer });
      });

      socket.current.on("answer", async (data) => {
        console.log("answer from: " + data.from + " to: " + data.to);
        await peerConnections.current[data.from].setRemoteDescription(data.answer);
      }

      );
      socket.current.on("ice-candidate", async (data) => {
        console.log("ice-candidate from: " + data.from + " to: " + data.to);
        await peerConnections.current[data.from].addIceCandidate(data.candidate);
      }
      );

      socket.current.on("user-disconnected", (userId) => {
        console.log("user disconnected: " + userId);
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
        document.getElementById(userId).remove();
        setUsers((prev) => prev.filter((id) => id !== userId));
    }
    );

    }

    );

    const handleBeforeUnload = () => {
      socket.current.emit("leave-room", roomid, socket.current.id);
      socket.current.disconnect();
    };
  
    // when we close the tab or browser window then beforeunload event is called
    window.addEventListener("beforeunload", handleBeforeUnload);


    return () => {
      socket.current.emit("leave-room", roomid, socket.current.id);
      socket.current.disconnect(); 
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, roomid]);

  return (
    <>
      <div id='videos'>VideoChat-{roomid}</div>

      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center space-x-4 p-4 ">
        <ToggleButton handleEvent={toggleCamera}>
          <FaVideo className="text-white w-6 h-6" />
          <FaVideoSlash className="text-white w-6 h-6" />
        </ToggleButton>
        <ToggleButton handleEvent={toggleAudio}>
          <AiOutlineAudio className="text-white w-6 h-6" />
          <AiOutlineAudioMuted className="text-white w-6 h-6" />
        </ToggleButton>
        <button onClick={endMeeting} className="flex items-center justify-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300">
          <MdCallEnd className='w-6 h-6' />
        </button>
      </div>
    </>
  )
}

export default VideoChat