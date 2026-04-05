import React, { use, useEffect } from 'react'
import Feed from './feed'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import axios from 'axios'
import { useSelector } from 'react-redux'
const MainPage = () => {
  const userData= useSelector((state) => state.user);
  const dispatch= useDispatch();

  const fetchUser = async () =>{
    if(userData){
      return;
    }
    try {
      const res = await axios.get("http://localhost:3000/profile",{
        withCredentials: true,
      })
      dispatch(addUser(res.data));
    }catch(err){
      console.log(err);
    }
  }
 useEffect(()=>{
    fetchUser();
 },[]);
  return (
    <div>
     
      <Feed/>
      
    </div>
  )
}

export default MainPage
