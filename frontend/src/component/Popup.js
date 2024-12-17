import React, { useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";


const Popup = ({isOpen,setIsOpen}) => {

    const handleCancelMeeting = () => {
        setIsOpen(!isOpen);
    }

    const handleJoinMeeting = () => {
        setIsOpen(!isOpen);
    }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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

            <div className="bg-gray-200 text-gray-700 rounded-lg p-2 mt-4 flex justify-between items-center">
                <p className="text-lg font-semibold center text-center">123 456 789</p>
                <button className="bg-gray-200 text-gray-700 p-4 rounded-full hover:bg-gray-300">
                <MdOutlineContentCopy   className="w-6 h-6 font-bold"/>
                </button>
            </div>

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
