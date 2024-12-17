import React,{use, useState} from 'react'
import { Link,useNavigate } from 'react-router'
import videoimg from '../assets/video-chat.webp'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {userReceived} from '../redux/userSlice'

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const changeUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const handleLogin = async () => {
    try {
      let data=await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, user);
      console.log(data);
      dispatch(userReceived(data.data));
      navigate('/');
    } catch (err) {
      console.log(err)
    }
  }

  return (
<div className="bg-sky-100 flex justify-center items-center h-screen">
   
<div className="w-1/2 h-screen hidden lg:block">
  <img src={videoimg} alt="Placeholder Image" className="object-cover w-full h-full" />
</div>

<div className= "lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
  <h1 className="text-2xl font-semibold mb-4">Login</h1>
  
    <div className="mb-4 bg-sky-100">
      <label htmlFor="email" className="block text-gray-600">Email</label>
      <input type="email" value={user.email} name="email" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" onChange={changeUser} />
    </div>
   
    <div className="mb-4">
      <label htmlFor="password" className="block text-gray-800">Password</label>
      <input type="password" value={user.password} name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" onChange={changeUser} />
    </div>
   

    {/* <div className="mb-6 text-blue-500">
      <a href="#" className="hover:underline">Forgot Password?</a>
    </div> */}
    
    <button onClick={handleLogin} className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
 
  
  <div className="mt-6 text-green-500 text-center">
    <Link to="/register" className="hover:underline">Sign up Here</Link>
  </div>
</div>
</div>
  )
}

export default Login