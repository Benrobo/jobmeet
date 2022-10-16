import React, { useEffect, useState, useContext } from "react";
import { Layout } from "../../components";
import { BsFillMicFill } from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";
import { IoVideocamOff } from "react-icons/io5";
import moment from "moment"
import APIROUTES from "../../apiRoutes";
import Fetch from "../../utils/fetch";
import DataContext from "../../context/DataContext";
import { Spinner } from "../../components/UI-COMP/loader";
import { Button } from "../../components/UI-COMP";




function Appointments() {
  const [inCall, setInCall] = useState();
  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)

  useEffect(()=>{
    fetchAllMeeting()
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

  return (
    <Layout sideBarActiveName="appointments">
          <div className="w-full flex flex-col items-start justify-start px-4 py-4">
            <p className="text-white-100 font-extrabold">Scheduled Appointments</p>  
            <p className="text-white-300 text-[13px] ">Scheduled Appointments</p>  
          </div>
          <div className="container w-full px-4 py-4 flex items-center justify-between ">
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
          </div>
    </Layout>
  );
}

export default Appointments;



function AppointmentsCard({meetingData, key}: any){

  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
  // const [days, hour, min, sec] = useCountdown(meetingData.startDate)

  // function isExpired(){
  //   if(days + hour + min + sec <= 0) return true;
  //   return false
  // }

  function format24HrTime(time: string){
    const mdt = time.replace(/\d/gi, "").replace(":", "")
    const newTime : any = time.replace("AM", "").replace("PM", "").split(":");
    if(+newTime[0] > 12) return `${newTime[0] - 12}:${newTime[1]}${mdt}`
    return time;
  }
  // console.log(time)

  
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
            ( {moment(meetingData?.startDate).format("LL")} ) {format24HrTime(meetingData.startTime)} - {format24HrTime(meetingData.endTime)}
          </p>
        </div>
      </div>
      {/* {isExpired() ? "" : <div className="w-auto text-[15px] flex flex-row items-start justify-start absolute top-4 right-2 text-blue-200 font-extrabold">
        {days}d {hour}h : {min}m : {sec}s
      </div>} */}
      <br />
      <p className="text-[15px] text-white-100 ">
        {meetingData.description}
      </p>
      <br />
      <div className="w-full flex flex-row items-center justify-between">
        <a href={`${window.location.origin}/meet/${meetingData.id}`} target="_blank" className="w-full">
          <Button data-id={meetingData.id} text={'Start Meeting'} style={{transform: "scale(1)"}} type={"primary"} long={true} />
        </a>
      </div>
    </div>
  )
}
