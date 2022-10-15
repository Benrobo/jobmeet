import React,{useEffect, useContext, useState} from 'react'
import { Layout, NavBar } from '../../components'
import {FiUser} from "react-icons/fi"
import {FaInternetExplorer} from "react-icons/fa"
import { Button } from '../../components/UI-COMP'
import { AiFillVideoCamera } from 'react-icons/ai'
import DataContext from '../../context/DataContext'
import CreateMeeting from './createMeeting'
import APIROUTES from '../../apiRoutes'
import Fetch from '../../utils/fetch'
import { Spinner } from '../../components/UI-COMP/loader'
import { getMeridianTime } from '../../utils'
import { Link } from 'react-router-dom'
import moment from "moment"

function Dashboard() {

  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
  const [meetingActive, setMeetingActive] = useState<any>(false)

  const toggleMeetingActive = ()=> setMeetingActive(!meetingActive)

  useEffect(()=>{
    fetchAllMeeting()
    fetchAllCareers()
    return ()=>{}
  },[])

  async function fetchAllMeeting(){
    try {
      setLoader((prev: any)=>({...prev,  ["getMeeting"]: true}))
      const url = `${APIROUTES.meetingByUserId}`
      const {res, data} = await Fetch(url, {
        method: "POST",
      })
      setLoader((prev: any)=>({...prev,  ["getMeeting"]: false}))
      
      if(!data.success){
        setError((prev: any)=>({...prev, ["getMeeting"]: data.message}))
        return
      }

      setData((prev: any)=>({...prev, ["meetings"]: data.data}))

    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["getMeeting"]: false}))
      setError((prev: any)=>({...prev, ["getMeeting"]: `Something went wrong. ${e.message}`}))
    }
  }

  


  async function fetchAllCareers(){
    try {
      setLoader((prev: any)=>({...prev,  ["careerPage"]: true}))
      const url = `${APIROUTES.careerByUserId}`
      const {res, data} = await Fetch(url, {
        method: "POST",
      })
      setLoader((prev: any)=>({...prev,  ["careerPage"]: false}))
      
      if(!data.success){
        setError((prev: any)=>({...prev, ["careerPage"]: data.message}))
        return
      }
      setData((prev: any)=>({...prev, ["careerPage"]: data.data || []}))
    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["careerPage"]: false}))
      setError((prev: any)=>({...prev, ["careerPage"]: `Something went wrong. ${e.message}`}))
    }
  }

  return (
    <>
      <Layout sideBarActiveName='overview'>
        <NavBar toggleCreateSchedule={toggleMeetingActive} />
        <br />
        <div id="overview" className="w-full h-screen px-7 py-2">
          <h2 className="text-white-100 font-extrabold text-[20px] ">Overview</h2>
          <br />
          <div id="cards" className="w-full flex flex-row items-start justify-start gap-7 ">
            <div id="card" className="w-[250px] h-auto p-9 flex flex-row items-center justify-between bg-dark-300 rounded-md ">
              <FiUser className="text-blue-200 text-[60px] p-3 bg-dark-200 rounded-[50%] " />
              {
                Loader.getMeeting ?
                  <Spinner />
                  :
                  <div id="right" className="flex flex-col items-start justify-start">
                    <p className="text-white-100 text-[15px] ">Appointments</p>
                    <p className="text-white-100 font-extrabold text-[30px] ">{Data.meetings.length}</p>
                  </div>
              }
            </div>

            <div id="card" className="w-[250px] h-auto p-9 flex flex-row items-center justify-between bg-dark-300 rounded-md ">
              <FaInternetExplorer className="text-blue-200 text-[60px] p-3 bg-dark-200 rounded-[50%] " />
              {
                Loader.careerPage ?
                  <Spinner />
                  :
                  <div id="right" className="flex flex-col items-start justify-start">
                    <p className="text-white-100 text-[15px] ">Pages</p>
                    <p className="text-white-100 font-extrabold text-[30px] ">{Data.careerPage.length}</p>
                  </div>
              }
            </div>
          </div>
          <br />
          <br />
          <div id="upcoming-event" className="w-full">
          <h2 className="text-white-100 font-extrabold text-[20px] ">Upcoming   Appointment         
              <span className="ml-4 px-2 py-1 bg-blue-300 rounded-[30%] text-[10px] ">{Data.meetings.length}</span> 
          </h2>
          <br />
          <div id="cards" className="w-full flex flex-row items-start justify-start gap-7 ">
            {
              Loader.getMeeting ?
                <div className="w-full h-[300px] flex flex-col items-center justify-center">
                  <Spinner />
                </div>
                :
              Error.getMeeting !== null ?
                <div className="w-full h-[300px] flex flex-col items-center justify-center">
                  <p className="text-white-200">{Error.getMeeting}</p>
                </div>
                :
              Data.meetings.length === 0 ?
                <div className="w-full h-[300px] flex flex-col items-center justify-center">
                  <p className="text-white-200">No meeting scheduled..</p>
                </div>
                :
              Data.meetings.map((data: any, i: number)=>(
                <AppointmentsCard meetingData={data} key={i} />
              ))
            }
          </div>
          <br />
          <br />
          </div>
        </div>
        <CreateMeeting active={meetingActive} toggleMeetingActive={toggleMeetingActive} />
      </Layout>
    </>
  )
}

export default Dashboard


function AppointmentsCard({meetingData, key}: any){

  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
  const [days, hour, min, sec] = useCountdown(meetingData.startDate)

  function isExpired(){
    if(days + hour + min + sec <= 0) return true;
    return false
  }

  function format24HrTime(time: string){
    const mdt = time.replace(/\d/gi, "").replace(":", "")
    const newTime = time.replace("AM", "").replace("PM", "").split(":");
    if(+newTime[0] > 12) return `12:${newTime[1]}${mdt}`
    return time;
  }

  
  useEffect(()=>{
    // const time = format24HrTime("14:46PM")
    // console.log(time)
  },[])

  return(
    <div id="card" className="relative w-[300px] h-auto p-3 flex flex-col items-start justify-start bg-dark-300 rounded-md">
      <div id="top" className="relative w-full flex flex-row items-center justify-start gap-3">
        <div id="info" className="relative flex flex-col items-start justify-start">
          <p className='text-[15px] font-extrabold text-white-100 '>{meetingData.title}</p>
          <p className='text-[12px] font-extrabold text-white-200'>
            ( {moment(new Date(+meetingData?.createdAt)).startOf('days').fromNow()} ) {format24HrTime(meetingData.startTime)} - {format24HrTime(meetingData.endTime)}
          </p>
        </div>
      </div>
      {isExpired() ? "" : <div className="w-auto text-[15px] flex flex-row items-start justify-start absolute top-4 right-2 text-blue-200 font-extrabold">
        {days}d {hour}h : {min}m : {sec}s
      </div>}
      <br />
      <p className="text-[15px] text-white-100 ">
        {meetingData.description}
      </p>
      <br />
      <div className="w-full flex flex-row items-center justify-between">
        <Link to={`/meet/${meetingData.id}`} className="w-full">
          <Button data-id={meetingData.id} text={isExpired() ? "Meeting Expired" : 'Join Event'} style={{transform: "scale(1)"}} type={isExpired() ? "secondary" : "primary"} long={true} disabled={isExpired()} />
        </Link>
      </div>
    </div>
  )
}

const useCountdown = (targetDate: string) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hour = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const min = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const sec = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hour, min, sec];
};