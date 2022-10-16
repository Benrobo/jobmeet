import React, {useState, useEffect, useContext} from 'react'
import APIROUTES from '../../apiRoutes'
import Modal from '../../components/UI-COMP/modal'
import DataContext from '../../context/DataContext'
import { getMeridianTime, sleep } from '../../utils'
import Fetch from '../../utils/fetch'
import Notification from '../../utils/toast'


const notif = new Notification(10000)


function CreateMeeting({active, toggleMeetingActive}: any) {
  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
  const [steps, setSteps] = useState(1)
  const [inputData, setInputData] = useState({
    startDate: "",
    startTime: "",
    endTime: "",
    careerId: "",
    candidateId: "",
    title: "",
    description: ""
  })

  const [candidates, setCandidates] = useState([])

  const toggleSteps = (type: string)=> {
    if(type === "next"){
      if(inputData.careerId === ""){
        return notif.error("career id is missing")
      } 
      if(inputData.candidateId === ""){
        return notif.error("candidate id is missing")
      }
      setSteps(2)
    }
    if(type === "prev") setSteps(1)
    if(type === "create"){
      const { startDate, startTime, endTime} = inputData;
      if(startDate === "") return notif.error("start date is missing..")
      if(startTime === "") return notif.error("start time is missing..")
      if(endTime === "") return notif.error("end time is missing..")
      createScheduledMeeting()
    }
  }

  useEffect(() => {
    fetchAllCareers()
    
  }, []);

  useEffect(()=>{
    if(inputData.careerId !== ""){
      fetchCandidates()
    }
  },[inputData.careerId])

  async function fetchAllCareers(){
    try {
      setLoader((prev: any)=>({...prev,  ["getCareer"]: true}))
      const url = `${APIROUTES.careerByUserId}`
      const {res, data} = await Fetch(url, {
        method: "POST",
      })
      setLoader((prev: any)=>({...prev,  ["getCareer"]: false}))
      
      if(!data.success){
        setError((prev: any)=>({...prev, ["getCareer"]: data.message}))
        return
      }

      setData((prev: any)=>({...prev, ["careers"]: data.data || []}))

    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["getCareer"]: false}))
      setError((prev: any)=>({...prev, ["getCareer"]: `Something went wrong. ${e.message}`}))
    }
  }

  async function fetchCandidates(){
    try {
      setLoader((prev: any)=>({...prev,  ["fetchCandidates"]: true}))
      const url = `${APIROUTES.candidateByOrgId}/${inputData.careerId}`
      const {res, data} = await Fetch(url, {
        method: "GET",
        // body: JSON.stringify({careerId: inputData.careerId})
      })
      setLoader((prev: any)=>({...prev,  ["fetchCandidates"]: false}))
      
      if(!data.success){
        notif.error(data.message)
        return
      }

      setCandidates(data.data || [])
    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["fetchCandidates"]: false}))
      notif.error(e.message)
    }
  }
  
  const handleInputData = (e: any, type: string)=>{
    // const name = e.target.name;
    const value = e.target.value;
    if(type === "title"){
      setInputData((prev: any)=>({...prev, ["title"]: value}))
    }
    if(type === "description"){
      setInputData((prev: any)=>({...prev, ["description"]: value}))
    }
    if(type === "startDate"){
      setInputData((prev: any)=>({...prev, ["startDate"]: value}))
    }
    if(type === "startTime"){
      const mdt = getMeridianTime(value)
      setInputData((prev: any)=>({...prev, ["startTime"]: value+mdt}))
    }
    if(type === "endTime"){
      const mdt = getMeridianTime(value)
      setInputData((prev: any)=>({...prev, ["endTime"]: value+mdt}))
    }
    if(type === "careerId"){
      setInputData((prev: any)=>({...prev, ["careerId"]: value}))
    }
    if(type === "candidateId"){
      setInputData((prev: any)=>({...prev, ["candidateId"]: value}))
    }
  }

  async function createScheduledMeeting(){
    try {
      setLoader((prev: any)=>({...prev,  ["createMeeting"]: true}))
      const url = `${APIROUTES.createMeeting}`
      const {res, data} = await Fetch(url, {
        method: "POST",
        body: JSON.stringify(inputData)
      })
      setLoader((prev: any)=>({...prev,  ["createMeeting"]: false}))
      
      if(!data.success){
        notif.error(data.message)
        return
      }

      notif.success(data.message)
      await sleep(1)
      window.location.reload()
    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["createMeeting"]: false}))
      notif.error(e.message)
    }
  }

  return (
    <Modal isActive={active} clickHandler={toggleMeetingActive} colorType="dark">
      <div id="content" className="w-[400px] h-auto px-4 py-5 rounded-md bg-dark-200 flex flex-col items-center justify-center ">
        <div className="w-full flex flex-col items-start justify-start">
          <p className="text-white-100 text-[15px] font-extrabold ">Schedule Appointments.</p>
          <p className="text-white-300 text-[15px] ">Create and schedule meeting..</p>
        </div>
        <br />
        <div className="w-full flex flex-col items-start justify-start">
          {
            steps === 1 ?
              <Step1 toggleSteps={toggleSteps} handleInputData={handleInputData} selectedId={inputData.careerId} candidates={candidates} />
              :
              <Step2 toggleSteps={toggleSteps} handleInputData={handleInputData} />
          }
        </div>
        
      </div>
    </Modal>
  )
}

export default CreateMeeting


function Step1({toggleSteps, handleInputData, selectedId, candidates}: any){
  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)

  return (
    <div className="w-full">
      <p className="text-white-300 text-[15px] pb-3">Select career Id</p>
      <select  data-name="careerId" className="w-full px-4 py-3 pr-2 rounded-[10px]  bg-dark-100 text-white-100 " onChange={(e: any)=>handleInputData(e, "careerId")}>
        <option value="">Select Career</option>
        {
          Loader.getCareer ? 
            <option value="">Loading...</option>
            :
            Data.careers.length === 0 ?
              <option value="">No careers available</option>
              :
            Data.careers.map((data: any)=>(
              <option value={data.id}>{data.title}</option>
            ))
        }
      </select>
      <br />
      <br />
      <p className="text-white-300 text-[15px] pb-3">Select candidate Id</p>
      <select data-name="candidateId" className="w-full px-4 py-3 pr-2 rounded-[10px]  bg-dark-100 text-white-100 " onChange={(e: any)=>handleInputData(e, "candidateId")} disabled={selectedId === "" || Loader.fetchCandidates}>
        <option value="">Select Candidate</option>
        {
          Loader.fetchCandidates ? 
            <option value="">Loading...</option>
            :
            candidates?.length === 0 ?
              <option value="">No candidates available</option>
              :
            candidates.map((data: any)=>(
              <option value={data.id}>{data.fullName}</option>
            ))
        }
      </select>
      <br />
      <br />
      <button className="px-4 py-3 w-full flex flex-row items-center justify-center text-white-100 font-extrabold bg-blue-300 rounded-md" onClick={()=>toggleSteps("next")}>
        Continue
      </button>
    </div>
  )
}

function Step2({toggleSteps, handleInputData}: any){

  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)

  return (
    <div className="w-full">
      <p className="w-full text-white-300 text-[15px] pb-2 ">Title</p>
      <input type="text" data-name="startDate" onChange={(e: any)=>handleInputData(e, "title")} className='w-full px-4 py-3 rounded-md bg-dark-100 text-white-200 ' />
      <br />
      <p className="w-full text-white-300 text-[15px] pb-2 ">Date</p>
      <input type="date" data-name="startDate" onChange={(e: any)=>handleInputData(e, "startDate")} className='w-full px-4 py-3 rounded-md bg-dark-100 text-white-200 ' />
      <br />
      <br />
      
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-auto">
          <p className=" text-white-300 text-[15px] pb-2 ">Start Time</p>
          <input type="time" data-name="startTime" onChange={(e: any)=>handleInputData(e, "startTime")} className='w-full px-4 py-3 rounded-md bg-dark-100 text-white-200 ' />
        </div>
        <div className="w-auto">
          <p className=" text-white-300 text-[15px] pb-2 ">End Time</p>
          <input type="time" data-name="endTime" onChange={(e: any)=>handleInputData(e, "endTime")} className='w-full px-4 py-3 rounded-md bg-dark-100 text-white-200 ' />
        </div>
      </div>
      <br />
      <p className=" text-white-300 text-[15px] pb-2 ">Description</p>
      <textarea rows={1} cols={10} maxLength={300} data-name="endTime" onChange={(e: any)=>handleInputData(e, "description")} className='w-full px-4 py-3 rounded-md bg-dark-100 text-white-200 ' ></textarea>
      <br />
      <br />
      <div className="w-full flex flex-row items-center justify-between gap-3">
        <button className="px-4 py-3 w-full flex flex-row items-center justify-center text-white-100 font-extrabold bg-dark-100 rounded-md" disabled={Loader.createMeeting} onClick={()=>toggleSteps("prev")}>
          Back
        </button>
        <button className="px-4 py-3 w-full flex flex-row items-center justify-center text-white-100 font-extrabold bg-blue-300 rounded-md" disabled={Loader.createMeeting} onClick={()=>toggleSteps("create")}>
          {Loader.createMeeting ? "Creating..." : "Continue"}
        </button>
      </div>
    </div>
  )
}
