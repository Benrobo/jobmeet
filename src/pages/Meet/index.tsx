import React, { useEffect, useState, useContext } from "react";
import { Layout } from "../../components";
import { BsFillMicFill } from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";
import { IoVideocamOff } from "react-icons/io5";
import {
  AgoraConfig,
  AgoraToken,
  channelName,
  useClient,
  useMicrophoneAndCameraTracks,
} from "./agoraVideoSettings";
import { AGORA_ID } from "../../config";
import { AgoraVideoPlayer } from "agora-rtc-react";

function Meet() {
  const [inCall, setInCall] = useState();

  return (
    <Layout sideBarActiveName="meet">
      <div className="container">
        <div
          id="video-container"
          className="relative w-full flex items-center justify-center"
        >
          {/* <VideoCall setInCall={setInCall} /> */}
          <div
            id="right"
            className="w-[28%] h-screen overflow-y-auto bg-dark-200 "
          >
            <div className="w-full flex flex-col items-start justify-start h-auto px-4 py-3">
              <p className="text-white-100 font-extrabold text-[20px] ">
                Meeting Title
              </p>
              <p className="text-white-300 text-[15px] ">
                Meeting description....
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Meet;

function Controls({tracks, setStart, setInCall}: any) {

  const client = useClient();
  const [trackState, setTrackState] = useState({
    video: true,
    audio: true
  })

  const mute = async (type: string)=>{
    if(type === "audio") {
      await tracks[0].setEnabled(!trackState.audio)
      setTrackState((prev: any)=>({...prev, audio: !prev.audio}))
    }
    if(type === "video") {
      await tracks[1].setEnabled(!trackState.video)
      setTrackState((prev: any)=>({...prev, video: !prev.video}))
    }
  }

  const leaveChannel =  async () => {
    await client.leave()
    client.removeAllListeners()
    tracks[0].close()
    setStart(false)
    setInCall(false)
  }

  return (
    <div
      id="controls"
      className="fixed bottom-10 left-[35%] w-auto h-auto px-3 py-3 bg-dark-400 flex items-center justify-center gap-10 rounded-[12px] "
    >
      <button className="flex flex-col items-center justify-center p-3 rounded-[12px] bg-dark-200 text-white-100 scale-[.80] cursor-pointer hover:scale-[.85] transition-all  " onClick={()=> mute("audio")}>
        <BsFillMicFill className="text-[25px]" />
      </button>
      <button className="flex flex-col items-center justify-center p-3 rounded-[10px] bg-red-600 text-white-100 cursor-pointer scale-[.80] hover:scale-[.90] transition-all " onClick={leaveChannel}>
        <ImPhoneHangUp className="text-[30px] " />
      </button>
      <button className="flex flex-col items-center justify-center p-3 rounded-[12px] bg-dark-200 text-white-100 scale-[.80] cursor-pointer hover:scale-[.85] transition-all ">
        <IoVideocamOff className="text-[25px] " onClick={()=> mute("video")} />
      </button>
    </div>
  );
}

function VideoCall({ setInCall }: any) {
  const [users, setUsers] = useState<any>([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    let init = async (name: any) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUser: any) => {
            [...prevUser, user!];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          user.audioTrack && user.audioTrack?.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUser: any) =>
            prevUser.filter((User: any) => User.uid !== user.uid)
          );
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUser: any) =>
          prevUser.filter((User: any) => User.uid !== user.uid)
        );
      });

      try {
        await client.join(AGORA_ID, channelName, AgoraToken, null);
      } catch (e) {
        console.log(e);
      }

      if (tracks) await client.publish(tracks[0]);
      setStart(true);

      if (ready) {
        try {
          init(channelName);
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [channelName, client, ready, tracks]);

  return (
    <div id="video-cont" className="relative w-[72%] h-screen overflow-y-auto ">
      {ready && start && <Videos users={users} tracks={tracks} />}
      {ready && tracks && <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />}
    </div>
  );
}


function Videos({users, tracks}: any){



  return (
    <div className="w-full h-full flex flex-wrap items-start justify-between gap-10 px-7 py-4">
      <div id="video-card" className="w-[350px] h-[300px] rounded-[10px] border-[3px] border-solid border-blue-300 p-3 ">
        <AgoraVideoPlayer videoTrack={tracks[1]} style={{height: "100%", width:"100%"}} />
      </div>
      {
        users.length > 0 && users.map((user: any)=>{
          if(user.videoTrack){
            return (
              <AgoraVideoPlayer videoTrack={user.videoTrack} style={{height: "100%", width:"100%"}} />
              // <div id="video-card" key={user.uid} className="w-[350px] h-[300px] rounded-[10px] border-[3px] border-solid border-blue-300 p-3 ">
              // </div>
            )
          }
          return null
        })
      }
    </div>
  )
}