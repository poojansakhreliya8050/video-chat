import React, { useEffect } from 'react'
import twoPeopleMeeting from '../assets/twoPeopleMeeting.webp'
import { useState } from 'react';
import Popup from '../component/Popup';
import { FaKeyboard } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';



import ToggleButton from '../component/ToggleButton';


const Home = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');

  const user = useSelector(state => state.user);
  // console.log(user);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user.user) {
  //     navigate('/login');
  //   }
  // }, []);

  const joinMeeting = () => {
    if (code != '') {
      navigate(`/videoChat/${code}`);
    }
  }

  return (

    <div>
      <div className="flex flex-col lg:flex-row items-center justify-between mx-auto max-w-7xl px-6 py-12">

        <div className="w-full lg:w-1/2 space-y-6">

          <h1 className="text-4xl font-semibold text-gray-800 leading-tight">
            Video calls and meetings <br /> for everyone
          </h1>

          <p className="text-gray-600 text-lg">
            Connect, collaborate, and celebrate from anywhere with Our Meet
          </p>

          <div className="flex items-center space-x-4">

            <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
              <span><FaVideo /></span>
              <span>New meeting</span>
            </button>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button className=" text-gray-600 pl-4 pr-0 py-2">
                <FaKeyboard />
              </button>
              <input
                type="text"
                placeholder="Enter a code or link"
                className="px-4 py-2 focus:outline-none text-gray-600"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button onClick={joinMeeting} className={`px-4 py-2 font-semibold  ${code != '' ? 'bg-gray-100 text-blue-500' : 'bg-gray-200 text-gray-300'}`} disabled={code == '' ? true : false} >Join</button>
            </div>
          </div>

        </div>


        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center mt-12 lg:mt-0">

          <img
            src={twoPeopleMeeting}
            alt="Meeting Illustration"
            className="w-60 h-60 object-cover"
            style={{ borderRadius: '50%' }}
          />

          <h2 className="text-lg font-semibold text-gray-800 mt-4">Plan ahead</h2>
          <p className="text-gray-600 text-center mt-2">
            Click <span className="font-bold">New meeting</span> to create new meeting or Enter code to join meeting.
          </p>


        </div>
      </div>
     
      <Popup isOpen={isOpen} setIsOpen={setIsOpen} />
    </div >


  )
}

export default Home