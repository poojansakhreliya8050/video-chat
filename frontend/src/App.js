import React from 'react';
import { Routes, Route } from 'react-router';
import Login from './page/Login';
import Register from './page/Register';
import Home from './page/Home';
import VideoChat from './page/VideoChat';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/videoChat/:roomid" element={<VideoChat/>}/> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
      {/* <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<RecentActivity />} />
        <Route path="project/:id" element={<Project />} />
      </Route> */}
    </Routes>
  );
}

export default App;
