import React, { useEffect, useState, useContext } from "react";
import {useParams} from "react-router-dom"
import { Layout } from "../../components";
import { BsFillMicFill } from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";
import { IoVideocamOff } from "react-icons/io5";
import APIROUTES from "../../apiRoutes";
import Fetch from "../../utils/fetch";
import DataContext from "../../context/DataContext";
import { Spinner } from "../../components/UI-COMP/loader";
import {JitsiMeeting} from "@jitsi/react-sdk"
// import {
//   AgoraConfig,
//   AgoraToken,
//   channelName,
//   useClient,
//   useMicrophoneAndCameraTracks,
// } from "./agoraVideoSettings";
// import { AGORA_ID } from "../../config";
// import { AgoraVideoPlayer } from "agora-rtc-react";

function Meet() {
  const [inCall, setInCall] = useState();
  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
  const [meetingInfo, setMeetingInfo] = useState<any>({})

  useEffect(()=>{
    getMeetingData()
    return ()=>{}
  },[])

  const meetId = useParams().meetId;


  async function getMeetingData(){
    try {
      setLoader((prev: any)=>({...prev,  ["getMeeting"]: true}))
      const url = `${APIROUTES.meetingById}/${meetId}`
      const {res, data} = await Fetch(url, {
        method: "GET",
      })
      setLoader((prev: any)=>({...prev,  ["getMeeting"]: false}))
      
      if(!data.success){
        setError((prev: any)=>({...prev, ["getMeeting"]: data.message}))
        return
      }

      setMeetingInfo(data.data)

    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["getMeeting"]: false}))
      setError((prev: any)=>({...prev, ["getMeeting"]: `Something went wrong. ${e.message}`}))
    }
  }

  function isExpired(date: string){
    let currDate = new Date(), hr = currDate.getHours(), month = currDate.getMonth() + 1 , day = currDate.getDay()
    const currdate = new Date(date);
    const currM = currdate.getMonth() + 1,
          currYr = currdate.getFullYear(),
          currDay = currdate.getDay();

    if(currYr === currDate.getFullYear()){
        if(month > currM) return true;
        if(month === currM){
            if(day > currDay) return true;
            return false
        }
        return false
    }
    if(currDate.getFullYear() > currYr) return true;
    return false
    
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
    
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
        !Loader.getMeeting && Object.entries(meetingInfo).length === 0 ?
            <div className="w-full h-[300px] flex flex-col items-center justify-center">
                <p className="text-white-200">Oops...This meeting is no longer available.</p>
            </div>
        :
        <>
            {console.log(isExpired(meetingInfo?.startDate))}
            <VideoCall title={meetingInfo?.title} />
        </>
    }
    
    </div>
  );
}

export default Meet;

function VideoCall({title}: any){

    return (
        <div className="w-full h-screen">
            <JitsiMeeting
                domain = {"meet.jit.si"}
                roomName = {title}
                configOverwrite = {{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false
                }}
                interfaceConfigOverwrite = {{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo = {{
                    displayName: '',
                    email: ""
                }}
                onApiReady = { (externalApi) => {
                    
                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // you can also store it locally to execute commands
                } }
                getIFrameRef = { (iframeRef) => { iframeRef.style.height = '100vh'; iframeRef.style.width = "100vw"} }
            />
        </div>
    )
}