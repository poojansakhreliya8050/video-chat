import React, { useState } from "react";
import { FaVideo, FaVideoSlash } from "react-icons/fa";

const ToggleButton = ({handleEvent,children}) => {    
  const [isOn, setIsOn] = useState(true); // Camera state: true = on, false = off

  const handleToggle = () => {
    handleEvent();
    setIsOn(!isOn); // Toggle the state
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center w-12 h-12 rounded-full transition duration-300 ${
        isOn ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {isOn ? (
        children[0]
      ) : (
        children[1]
      )}
    </button>
  );
};

export default ToggleButton;
