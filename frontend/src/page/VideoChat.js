import React, {useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';


const VideoChat = () => {

  const user=useSelector(state=>state.user?.user);
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

  useEffect(() => {

    if (!socket.current) {
      socket.current = io("http://localhost:8000");
    }

    console.log(socket);


    socket.current.on("connect", async() => {
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
        socket.current.emit("offer", {to: userId, offer });
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
    }
  
  );


    return () => {
      socket.current.disconnect(); // Clean up connection on unmount
    };
  }, [socket, roomid]);

  return (
    <div id='videos'>VideoChat-{roomid}</div>
  )
}

export default VideoChat