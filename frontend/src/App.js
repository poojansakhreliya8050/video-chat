import React,{useEffect} from 'react';
import { Routes, Route } from 'react-router';
import Login from './page/Login';
import Register from './page/Register';
import Home from './page/Home';
import VideoChat from './page/VideoChat';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import {userReceived} from './redux/userSlice'


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        let data = await axios.get(`${process.env.REACT_APP_API_URL}/user/me`, { withCredentials: true });
        console.log(data.data);
        dispatch(userReceived(data.data));
      } catch (err) {
        console.log(err);
      }
    }
    checkLogin();
  }, []);


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
