import React from 'react'
import {AiOutlineVideoCamera, AiFillVideoCamera, AiFillCalendar, AiFillDashboard} from "react-icons/ai"
import { BsBriefcaseFill } from 'react-icons/bs'
import {GoBrowser} from "react-icons/go"
import { Link } from 'react-router-dom'


function isEqual(propA: string, propB: string){
  return propA === propB
}

function SideBar({active}: any) {


  const logout = ()=>{
    localStorage.removeItem("meetvast")
    localStorage.removeItem("authToken")
    window.location.reload()
  }

  return (
    <div className="w-[250px] h-screen bg-dark-200 ">
        <div id="head" className="w-full flex flex-row items-center justify-center p-2 mt-5 gap-5">
            <AiOutlineVideoCamera className='text-blue-200 text-[20px] ' />
            <h2 className='text-blue-200 font-extrabold text-[20px] '>MeetVast</h2>
        </div>
        <br />
        <div className="w-full flex flex-col items-start justify-start">
          <Link to="/dashboard" className="w-full">
              <li className={`w-full flex flex-row items-center justify-start gap-3 text-white-100 text-[15px] list-none px-3 py-4 ${isEqual(active, "overview") ? "bg-blue-400 " : ""} hover:bg-blue-300 font-extrabold cursor-pointer`}>
                <AiFillDashboard className={`text-white-100 text-[20px] `} /> Overview
              </li>
            </Link>
            {/* <Link to="/appointments" className="w-full">
            <li className={`w-full flex flex-row items-center justify-start gap-3 text-white-100 text-[15px] list-none px-3 py-4 ${isEqual(active, "appointments") ? "bg-blue-400 " : ""} hover:bg-blue-300 font-extrabold cursor-pointer`}>
            <AiFillCalendar className={`text-white-100 text-[20px] `} /> Appointments
            </li>
            </Link> */}
            <Link to="/job/applications" className="w-full">
            <li className={`w-full flex flex-row items-center justify-start gap-3 text-white-100 text-[15px] list-none px-3 py-4 ${isEqual(active, "jobApplication") ? "bg-blue-400 " : ""} hover:bg-blue-300 font-extrabold cursor-pointer`}>
            <BsBriefcaseFill className={`text-white-100 text-[20px] `} /> Job Applications
            </li>
            </Link>

            <Link to="/career" className="w-full">
            <li className={`w-full flex flex-row items-center justify-start gap-3 text-white-100 text-[15px] list-none px-3 py-4 ${isEqual(active, "career") ? "bg-blue-400 " : ""} hover:bg-blue-300 font-extrabold cursor-pointer`}>
            <GoBrowser className={`text-white-100 text-[20px] `} /> Career Pages
            </li>
            </Link>
            {/* <Link to="/meet/:meetId" className="w-full">
            <li className={`w-full flex flex-row items-center justify-start gap-3 text-white-100 text-[15px] list-none px-3 py-4 ${isEqual(active, "meet") ? "bg-blue-400 " : ""} hover:bg-blue-300 font-extrabold cursor-pointer`}>
            <AiFillVideoCamera className={`text-white-100 text-[20px] `} /> Meet
            </li>
            </Link> */}
            <li className={`absolute bottom-2 left-0 w-full flex flex-row items-center justify-start gap-3 text-blue-300 text-[15px] list-none px-3 py-4 font-extrabold cursor-pointer`} onClick={logout}>
            <GoBrowser className={`text-blue-300 text-[20px] `} /> Logout
            </li>
        </div>
    </div>
  )
}

export default SideBar