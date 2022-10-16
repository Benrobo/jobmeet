import React, { useContext, useEffect, useState } from 'react'
import { Layout } from '../../components'
import Modal from '../../components/UI-COMP/modal'
import {IoClose,} from "react-icons/io5"
import {IoMdTrash} from "react-icons/io"
import DataContext from '../../context/DataContext'
import APIROUTES from '../../apiRoutes'
import Fetch from '../../utils/fetch'
import Notification from '../../utils/toast'
import { Spinner } from '../../components/UI-COMP/loader'
import { sleep } from '../../utils'
import { sendMail } from '../../utils/sendMail'


const notif = new Notification(10000)

function JobApplications() {

    const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
    const [isSelected, setIsSelected] = useState<boolean>(false)
    const [selectedData, setSelectedData] = useState({})
    const [careersId, setCareersId] = useState([])
    
    const toggleIsSelected = ()=> setIsSelected(!isSelected)
    
    useEffect(()=>{
        fetchAllCareers()
    }, [])
    
    useEffect(()=>{
        // get all candidates initially if careerId is available
        // if(Loader.getCareer === false && careersId.length > 0){
        //     fetchAllCandidates()
        // }
    },[])
    
    async function fetchAllCareers(){
        try {
          setLoader((prev: any)=>({...prev,  ["getCareer"]: true}))
          const url = APIROUTES.careerByUserId
          const {res, data} = await Fetch(url, {
            method: "POST",
          })
          setLoader((prev: any)=>({...prev,  ["getCareer"]: false}))
          
          if(!data.success){
            setError((prev: any)=>({...prev, getCareer: "Something went wrong"}))
            console.log(data.message)
            return
          }
          
          const careerData = data.data;
          const filteredIds = careerData.map((data: any)=> data.id)
          setCareersId(filteredIds)
          setData((prev: any)=>({...prev, careers: data.data}))
        } catch (e: any) {
          setLoader((prev: any)=>({...prev,  ["getCareer"]: false}))
          notif.error(`Something went wrong.`)
          console.log(e)
        }
    }

    async function fetchAllCandidates(e?: any){
        const cId = e.target.value
        if(cId !== ""){
            try {
                const url = `${APIROUTES.candidateByOrgId}/${cId}`
                setLoader((prev: any)=>({...prev, ["fetchCandidates"]: true}))
                const {res, data} = await Fetch(url, {
                    method: "GET",
                })
                setLoader((prev: any)=>({...prev,  ["fetchCandidates"]: false}))
                
                if(!data.success){
                    setError((prev: any)=>({...prev, ["fetchCandidates"]: data.message}))
                    return
                }
                setData((prev: any)=>({...prev, ["candidates"]: data.data}))
                // console.log(data)

            } catch (e: any) {
                setLoader((prev: any)=>({...prev,  ["fetchCandidates"]: false}))
                setError((prev: any)=>({...prev, ["fetchCandidates"]: `Something went wrong, please try again.`}))
                console.log(e)
            }
        }
    }

    function handleSelectedCandidate(e: any){
        const dataset = e.target.dataset;
        if(Object.entries.length === 0) return;
        const {id} = dataset;
        const filteredCandidate = Data.candidates.filter((user: any)=> user.id === id)
        setSelectedData(filteredCandidate[0])   
        toggleIsSelected()     
    }

  return (
    <Layout sideBarActiveName='jobApplication'>
        <div className="w-full h-screen px-3 py-3">
            <div className="w-full h-auto mt-10 rounded-md border-[1px] border-solid border-dark-200 py-4 px-3 flex flex-col items-start justify-start ">
                <div id="head" className="w-full flex flex-row items-start justify-between">
                    <div id="left" className="w-auto">
                        <p className="text-white-200 text-[20px] font-extrabold ">All Applications</p>
                        <p className="text-white-200 text-[15px]">Career page candidates applications.</p>
                    </div>
                    <div id="right" className="w-auto">
                        <select name="" id="" className="w-[220px] px-4 py-2 pr-2 rounded-[10px]  bg-dark-300 text-white-100 " onChange={fetchAllCandidates}>
                            <option value="">Select Career Id</option>
                            {
                                Loader.getCareer ? 
                                    <option value="">Loading....</option>
                                    :
                                Error.getCareer !== null ?
                                    <option value="">{Error.getCareer}</option>
                                    :
                                Data.careers.length === 0?
                                    <option value="">No career available</option>
                                    :
                                Data.careers.map((data: any, i: number)=>(
                                    <option value={data.id} key={data.id}>{data.title}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <br />
                {
                    Loader.fetchCandidates ?
                        <div className="w-full h-[350px] flex flex-col items-center justify-center text-white-100" >
                            <Spinner />
                            <p className="text-white-200">Loading...</p>
                        </div>
                        :
                    Error.fetchCandidates !== null ?
                        <div className="w-full h-full flex flex-col items-center justify-center" >
                            <p className="text-white-200">{Error.fetchCandidates}</p>
                        </div>
                        :
                    !Loader.fetchCandidates && Data.candidates.length === 0 ?
                        <div className="w-full h-full flex flex-col items-center justify-center" >
                            <p className="text-white-200">No Candidates Available..</p>
                        </div>
                        :
                        <table className="w-full table-auto border-collapse">
                            <thead className='w-full text-white-300'>
                                <tr>
                                    <th className='px-4 py-3 border-b border-t border-dark-200 '>Full Name</th>
                                    <th className='px-4 py-3 border-b border-t border-dark-200 '>Contacts</th>
                                    <th className='px-4 py-3 border-b border-t border-dark-200 '>Schedule</th>
                                    <th className='px-4 py-3 border-b border-t border-dark-200 '>Job Role</th>
                                    <th className='px-4 py-3 border-b border-t border-dark-200 '>Status</th>
                                    <th className='px-4 py-3 border-b border-t border-dark-200 '>Career ID</th>
                                </tr>
                            </thead>
                            <tbody className='w-full'>
                                {Data.candidates.map((data: any, i: number)=>(
                                    <tr key={i} className={`p-6 text-white-100 border-l-[4px] border-l-transparent hover:bg-dark-600 border-l-solid ${data.status === "pending" ? "border-l-green-400 bg-dark-600" : ""} cursor-pointer `}>
                                        <td className='px-9 py-5 capitalize underline font-extrabold text-[12px] ' onClick={handleSelectedCandidate} data-id={data.id}>{data.fullName}</td>
                                        <td className='px-9 py-5 text-[12px]'>{data.email}</td>
                                        <td className='px-9 py-5 text-white-100 text-[15px] font-extrabold capitalize text-[12px] '>
                                            {data?.duration}
                                        </td>
                                        <td className='px-9 py-5 text-[12px]'>
                                            <span className="px-3 py-1
                                            text-white-300 text-[15px] font-extrabold capitalize ">{data.jobRole}</span>
                                        </td>
                                        <td className='px-9 py-5 text-[12px]'>
                                            <Status status={data.status} />
                                            {/* <span className="px-3 py-1 rounded-md bg-blue-900 font-extrabold text-blue-200 text-[12px] ">Part Time</span> */}
                                        </td>
                                        <td className='px-9 py-5 text-white-300 text-[12px]'>
                                            {data.careerId.split("_")[0] + "_" + data.careerId.split("_")[1].slice(0,3) + "...."}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                }

                <SelectedCandidate data={selectedData} toggleIsSelected={toggleIsSelected} active={isSelected} />
            </div>
        </div>
    </Layout>
  )
}

export default JobApplications

function Status({status}: any){


    function isEqual(a: string, b: string){
        return a === b
    }

    const STATUS = 
        isEqual(status, "pending") ? 
            "bg-green-900 text-green-200" 
                : 
        isEqual(status, "approved") ? 
            "bg-blue-900 text-blue-200"
            :
        isEqual(status, "rejected") ? 
            "bg-red-900 text-red-200"
        :
        ""

    return (
        <span className={`px-3 py-1 rounded-[30px] ${STATUS} font-extrabold text-[12px] capitalize `}>
            {status}
        </span>
    )
}

function SelectedCandidate({data, active, toggleIsSelected}: any){
    const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
    const logoStyle ={
        backgroundImage:`url("${data.profileImage}")`,
        backgroundSize: "cover",
        backgroundPosition:"center",
        backgroundRepeat: "no-repeat"
    }

    const candidateData = data;

    if(Object.entries(data).length === 0) return null

    const returnMsgFormat = (type: string) => {
        const filteredOrgData = Data.careers.filter((orgData: any)=> orgData.id === data.careerId)[0]
        let format = {
            msg: "",
            subject: ""
        };
        if(type === "rejection"){
            format.subject = `Application for the role of a ${data.jobRole}`
            format.msg = `
                <h3>Hi <b><em>${data.fullName}</em></b>, after carefull considration from your application and documents which was sent along.</h3>

                <h4>We've decided that we wont be moving <b>forward</b> with you. Thank you for the time spent in applying for this role. Dont stop there, keep pushing and one day, you'll get your dream job.</h4>

                <h4>Best regards</h4>
                <h5>${filteredOrgData.orgName}</h5>
            `
        }

        if(type === "approved"){
            format.subject = `Congrats: Application for the role of a ${data.jobRole}`
            format.msg = `
                <h3><b>Hi</b> <b><em>${data.fullName}</em></b>, after carefull considration from your application and documents which was sent along.</h3>

                <h4>We've decided to move forward with you. An email would be sent to you to proceed forwards for the next stage of the application process.</h4>

                <h4>Best regards</h4>
                <h5>${filteredOrgData.orgName}</h5>
            `
        }
        return format        
    }

    const url = APIROUTES.updateCandidateStatus
    async function acceptCandidate(canId: string, careerId: string){
        try {
            setLoader((prev: any)=>({...prev, ["approveCandidate"]: true}))
            const payload = { 
                careerId: careerId, 
                candidateId: canId, 
                status : "approved"
            }
            const {data}  = await Fetch(url, {
                method: "PUT",
                body: JSON.stringify(payload)
            })
            setLoader((prev: any)=>({...prev, ["approveCandidate"]: false}))

            if(!data.success){
                notif.error(data.message)
                return;
            }

            notif.success(data.message)
            const {msg, subject}= returnMsgFormat("approved")
            sendMail(candidateData.email, msg, subject)
            await sleep(3)
            window.location.reload()
        } catch (e: any) {
            setLoader((prev: any)=>({...prev, ["approveCandidate"]: false}))          
            notif.error("Something went wrong " + e.message)
        }
    }

    async function rejectCandidate(canId: string, careerId: string){
        const confirm = window.confirm("Are you sure about this.?")
        if(!confirm) return

        try {
            setLoader((prev: any)=>({...prev, ["rejectCandidate"]: true}))
            const payload = { 
                careerId: careerId, 
                candidateId: canId, 
                status : "rejected"
            }
            const {data}  = await Fetch(url, {
                method: "PUT",
                body: JSON.stringify(payload)
            })
            setLoader((prev: any)=>({...prev, ["rejectCandidate"]: false}))

            if(!data.success){
                notif.error(data.message)
                return;
            }

            notif.success(data.message)
            const {msg, subject}= returnMsgFormat("rejection")
            sendMail(candidateData.email, msg, subject)
            await sleep(3)
            window.location.reload()
        } catch (e: any) {
            setLoader((prev: any)=>({...prev, ["rejectCandidate"]: false}))          
            notif.error("Something went wrong " + e.message)
        }
    }

    function updateCandidateStatus(e: any, type: string){
        const dataset = e.target.dataset;
        if(Object.entries(dataset).length === 0) return ;
        const {id, career_id} = dataset;
        if(type === "accept")return acceptCandidate(id, career_id)
        if(type === "reject")return rejectCandidate(id, career_id)
    }
    

    return (
        <div className={`${active ? "w-[300px]" : "w-[0px] right-[-50px] "} h-screen shadow-xl fixed right-0 top-0 px-3 py-6 bg-dark-200 overflow-x-hidden `}>
            <button className="absolute top-2 left-4 flex flex-col items-center justify-center text-red-200 bg-red-900 p-2 rounded-[50%]  scale-[.80] hover:scale-[.85] transition-all " onClick={toggleIsSelected}>
                <IoClose className='text-[20px] ' />
            </button>
            <button className="absolute top-2 right-4 flex flex-col items-center justify-center text-red-200 bg-red-900 p-2 rounded-[5px]  scale-[.80] hover:scale-[.85] transition-all ">
                <IoMdTrash className='text-[20px] ' />
            </button>

            <div id="head" className="w-full flex flex-col items-center justify-center ">
                <div id="img" style={logoStyle} className=" p-7 rounded-[50%] border-[3px] border-solid border-blue-300 bg-dark-100 w-[100px] h-[100px] "></div>
                <br />
                <p className="text-blue-300 font-extrabold text-[20px] capitalize ">{data.fullName}</p>
                <p className="text-white-200 text-[15px] capitalize ">
                    {data.duration} / {data.jobRole}
                </p>
                <br />
                <br />
                <br />
                <div id="info" className="w-full px-4 flex flex-col items-start justify-start">
                    <p className="text-white-100 font-extrabold text-[15px] ">Basic Information</p>
                    <br />
                    <li className="w-full flex flex-row items-center justify-between">
                        <span className="text-white-300">Email: </span>
                        <span className="text-white-100 text-[12px] font-extrabold ">{data.email}</span>
                    </li>
                    <br />
                    <br />
                    <a href={`/candidate/${data.id}`} className="w-full" target={"_target"}>
                        <button className="w-full rounded-[30px] border-[2px] border-solid border-blue-300 px-4 py-3 flex flex-row items-center justify-center text-white-200 hover:bg-blue-300 font-extrabold ">
                            View CV / Resume
                        </button>
                    </a>
                </div>
                <br />
                <br />
                <br />
                <div id="action" className="w-full px-4 flex flex-row items-center justify-between gap-5">
                    {(data.status === "pending" || data.status === "rejected") && <button data-id={data.id} data-career_id={data.careerId} className="w-full rounded-[30px] bg-blue-400 px-4 py-3 flex flex-row items-center justify-center text-white-200  font-extrabold hover:bg-blue-500" onClick={(e: any)=>updateCandidateStatus(e, "accept")} disabled={Loader.approveCandidate}>
                        {Loader.approveCandidate ? "Approving..." : "Approve"}
                    </button>}

                    {(data.status === "approved" || data.status === "pending") && <button data-id={data.id} data-career_id={data.careerId} className="w-full rounded-[30px] px-4 py-3 flex flex-row items-center justify-center text-white-100 bg-red-200 font-extrabold hover:bg-red-600 " onClick={(e: any)=>updateCandidateStatus(e, "reject")} disabled={Loader.rejectCandidate}>
                        {Loader.rejectCandidate ? "Rejecting..." : "Reject"}   
                    </button>}
                </div>
            </div>
        </div>
    )
}