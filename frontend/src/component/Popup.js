import React, { useState,useEffect} from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router";


const Popup = ({isOpen,setIsOpen}) => {

  const [roomid,setRoomid]=useState('');
  const user=useSelector(state=>state.user?.user);

  let navigate=useNavigate();

  useEffect(()=>{
     const fetchData = async () => {
      try {
        if(isOpen){
          const room=await axios.post(`${process.env.REACT_APP_API_URL}/user/room`,{users:[user._id]});
          console.log(room);
          setRoomid(room.data._id);
           }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  },[isOpen]);


    const handleCancelMeeting = async () => {
      try{
       let data= await axios.delete(`${process.env.REACT_APP_API_URL}/user/room/${roomid}`);
       console.log(data);
       
      }
      catch(err)
      {
        console.log(err);
      }
        setIsOpen(!isOpen);
    }

    const handleJoinMeeting = () => {
        navigate(`/videoChat/${roomid}`);
        setIsOpen(!isOpen);
    }

    const copyRoomid=()=>{
      navigator.clipboard.writeText(roomid);
    }
  

  return (
    <div >
        {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         
          <div className="bg-slate-100 rounded-2xl shadow-lg p-6 w-3/12">
            
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Here's your joining info</h2>
              
              <button
                onClick={handleCancelMeeting}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Body Content */}
            <p className="text-gray-700">
              Send this to people you want to meet with <br />
              Be sure to save it so you can join later 
            </p>


            {
            roomid!='' &&
            <div className="bg-gray-200 text-gray-700 rounded-lg p-2 mt-4 flex justify-between items-center">
                <p className="text-lg font-semibold center text-center">{roomid}</p>
                <button className="bg-gray-200 text-gray-700 p-4 rounded-full hover:bg-gray-300">
                <MdOutlineContentCopy   className="w-6 h-6 font-bold" onClick={copyRoomid}/>
                </button>
            </div>
           }

            {/* Footer */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCancelMeeting}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
              >
                Cancel 
              </button>
              <button
                onClick={handleJoinMeeting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
