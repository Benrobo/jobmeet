import React,{useState, useEffect, useContext} from 'react'
import APIROUTES from '../../apiRoutes';
import { Button } from '../../components/UI-COMP';
import { Spinner } from '../../components/UI-COMP/loader';
import Modal from '../../components/UI-COMP/modal';
import DataContext from '../../context/DataContext';
import Fetch from '../../utils/fetch';
import { sendMail } from '../../utils/sendMail';
import Notification from '../../utils/toast';
import {AiFillGithub} from "react-icons/ai"
import { Link } from 'react-router-dom';

const notif= new Notification(10000)

if(localStorage.getItem("githubUsers") === null){
    localStorage.setItem("githubUsers", JSON.stringify([]))
}

function HomePage() {
  const { setLoader, Loader, Error, setError, Data, setData } = useContext<any>(DataContext);
  const [activeState, setActiveState] = useState(1)
  const [tempData, setTempData] = useState({
    careers: [],
    githubUsers: []
  })
  const [searchWord, setSearchWord] = useState("")
  const [activeModal, setActiveModal] = useState(false)
  const [selectedLogin, setSelectedLogin] = useState("")

  const toggleActiveState = (state: number) => setActiveState(state)
  const toggleActiveModal = () => setActiveModal(!activeModal)
  const  localgithubUsers = JSON.parse(localStorage.getItem("githubUsers") as any);

  useEffect(()=>{
    fetchAllCareers()
    fetchGithubUsers()
  },[])

  async function fetchAllCareers(){
    try {
      setLoader((prev: any)=>({...prev,  ["getCareer"]: true}))
    //   const url = "http://localhost:5000/api/career/getAll"
      const url = "http://localhost:5000/api/career/getAll"
      const {res, data} = await Fetch(url, {
        method: "GET",
      })
      setLoader((prev: any)=>({...prev,  ["getCareer"]: false}))
      
      if(!data.success){
        setError((prev: any)=>({...prev, ["getCareer"]: data.message}))
        return
      }

      setTempData((prev: any)=>({...prev, careers: data.data}))
      setData((prev: any)=>({...prev, careers: data.data}))
    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["getCareer"]: false}))
      setError((prev: any)=>({...prev, ["getCareer"]: e.message}))
    }
  }

  async function fetchGithubUsers() {
    const githubUsers = JSON.parse(localStorage.getItem("githubUsers") as any);
    // console.log(githubUsers)
    if(githubUsers.length > 0){
        console.log("DATA EXISTS IN LOCALSTORAGE")
        setTempData((prev: any)=>({...prev, githubUsers: githubUsers}))
        setData((prev: any)=>({...prev, githubUsers: githubUsers}))
        return
    }
    console.log("DATA DOESN'T EXISTS")
    try {
      setLoader((prev: any)=>({...prev,  ["githubUsers"]: true}))
      const url = `https://api.github.com/users`
      const res = await fetch(url)
      const data = await res.json()
      setLoader((prev: any)=>({...prev,  ["githubUsers"]: false}))
      
      localStorage.setItem("githubUsers", JSON.stringify(data))
      setTempData((prev: any)=>({...prev, githubUsers: data}))
      setData((prev: any)=>({...prev, githubUsers: data}))
    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["githubUsers"]: false}))
      setError((prev: any)=>({...prev, ["githubUsers"]: `Something went wrong. ${e.message}`}))
    }
  }

  const handleOnchangeInput = (e: any)=>{
    // change active state 
    const value = e.target.value;
    const copyCareerData = Data.careers;
    const copyGithubUsersData = Data.githubUsers.length === 0 ? localgithubUsers : Data.githubUsers;

    if(value === "" || value === "@" || value === "#"){
        console.log("RUNNING")
        setTempData((prev: any)=>({...prev, careers: copyCareerData, githubUsers: copyGithubUsersData}))
    }
    value.includes("@") ? toggleActiveState(2) : toggleActiveState(1)
    setSearchWord(value)
  }

  async function searchData(value: string){
    const newValue = value.replace("#", "").replace("@", "")

    if(value.includes("#") && newValue !== ""){
        // search organization
        const filteredData = tempData.careers.filter((career: any)=> career.orgName.toLowerCase().includes(newValue) || career.jobRole.toLowerCase().includes(newValue) || career.duration.toLowerCase().includes(newValue) || career.tags.toLowerCase().includes(newValue))

        setTempData((prev: any)=>({...prev, careers: filteredData}))
    }
    if(value.includes("@") && newValue !== ""){
        // search user
        const localgithubUsers = JSON.parse(localStorage.getItem("githubUsers") as any);
        if( localgithubUsers.length > 0){
            const filteredData = localgithubUsers.filter((user: any)=> user?.login?.toLowerCase().includes(newValue.toLocaleLowerCase()))
            console.log(filteredData)
            
            if(newValue === "") return
            if (filteredData.length === 0) {
                // fetch users from github api
                try {
                    setLoader((prev: any)=>({...prev,  ["githubUsers"]: true}))
                    const url = `https://api.github.com/users/${newValue}`
                    const res = await fetch(url)
                    const data = await res.json()
                    setLoader((prev: any)=>({...prev,  ["githubUsers"]: false}))
                    
                    // append users to localstorage
                    const checkIfUserExists = localgithubUsers.filter((user: any)=> user?.login?.toLowerCase().includes(data.login))
                    if(checkIfUserExists.length === 0){
                        localgithubUsers.push(data)
                    }
                    localStorage.setItem("githubUsers", JSON.stringify(localgithubUsers))
                    // console.log([data], localgithubUsers)
                    setTempData((prev: any)=>({...prev, githubUsers: [data]}))
                    setData((prev: any)=>({...prev, githubUsers: localgithubUsers}))
                    window.location.reload()
                } catch (e: any) {
                    setLoader((prev: any)=>({...prev,  ["githubUsers"]: false}))
                    setError((prev: any)=>({...prev, ["githubUsers"]: `Something went wrong. ${e.message}`}))
                }
            }
            setTempData((prev: any)=>({...prev, githubUsers: filteredData}))
            setData((prev: any)=>({...prev, githubUsers: localgithubUsers}))
            setError((prev: any)=>({...prev, ["githubUsers"]: null}))
            return
        }
    }
  }

  const handleTargetUser = (e: any)=>{
    const dataset= e.target.dataset;
    if(Object.entries(dataset).length === 0) return;
    const {login} = dataset;
    setSelectedLogin(login)
    toggleActiveModal()
  }

  return (
    <div className="w-full h-screen relative overflow-x-hidden ">
        <Link to="/auth">
            <button className="w-[150px] absolute z-[100] top-5 right-4 px-3 py-3 bg-blue-300 rounded-[30px] text-white-100 font-extrabold">Get Started</button>
        </Link>
        <div className="relative w-full h-[400px] flex flex-col items-center justify-center overflow-hidden text-center">
            <h1 className="text-blue-300 font-extrabold font-sans text-[70px] ">
                JobMeet
            </h1>
            <p className="text-white-300 font-extrabold ">
                Ease the Process of Job Application for both <span className="text-blue-200 text-[15px] underline ">Hiring Manager</span> & <span className="text-blue-200 text-[15px] underline ">Candidates</span>
            </p>
            <br /> 
            <br />
            <br />
            <div className="w-full h-auto flex flex-row items-center justify-center">
                <div className="w-[500px] z-[100] px-0 h-auto bg-dark-300 rounded-[30px] ">
                    <input type="text" placeholder='@user, #orgName, #jobRole, #tags' className="w-[350px] rounded-[30px] bg-dark-300 outline-none px-5 py-4 text-white-200 " onKeyPress={(e)=>{
                        if(e.key === "Enter"){
                            searchData(searchWord)
                        }
                    }} onChange={handleOnchangeInput} />
                    <button className="w-[150px] px-3 py-3 bg-blue-300 rounded-[30px] text-white-100 font-extrabold" onClick={()=> searchData(searchWord)}>Search</button>
                </div>
            </div>

            <div id="circle1" className="w-[300px] h-[300px] rounded-[50%] bg-dark-200 absolute bottom-[-150px] left-[-100px] "></div>
            <div id="circle1" className="w-[300px] h-[300px] rounded-[50%] bg-dark-200 absolute top-[-150px] right-[-100px] "></div>
        </div>
        <br />
        <br />
        <div className="w-full flex flex-col items-center justify-center  ">
            <div className="w-[90%] px-4 flex items-start justify-start gap-10">
                <button className={`mt-3 text-[15px] text-white-100 px-4 py-2 ${activeState === 1 ? "bg-blue-300" : "bg-dark-300"} rounded-md capitalize`} onClick={()=>toggleActiveState(1)}>
                    Find Jobs
                </button>
                <button className={`mt-3 text-[15px] text-white-300 px-4 py-2 ${activeState === 2 ? "bg-blue-300" : "bg-dark-300"} rounded-md capitalize`} onClick={()=>toggleActiveState(2)}>
                    Hire Developers
                </button>
            </div>
        </div>
        {
            activeState === 1 ?
            <CareerCards careerData={tempData} />
            :
            <CandidateCards candidateData={tempData}  handleTargetUser={handleTargetUser}/>
        }
        <br />
        <br />
        <br />
        {activeModal && <SelectedUser userLogin={selectedLogin} active={activeModal} toggleModal={toggleActiveModal} />}
    </div>
  )
}

export default HomePage

function CareerCards({careerData}: any){
    
    const { Loader, Error} = useContext<any>(DataContext);

    const logoStyle ={
        backgroundSize: "cover",
        backgroundPosition:"center",
        backgroundRepeat: "no-repeat"
    }

    return (
        <div className="w-full flex flex-col items-center justify-center ">
            
            <br />
            <br />
            <br />
            <div className="w-full md:w-[90%] h-auto px-4 flex flex-wrap items-start justify-start gap-5 ">
                {
                    Loader.getCareer ?
                        <div className="w-full flex flex-col items-center justify-center">
                            <Spinner />
                        </div>
                        :
                    Error.getCareer !== null ?
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="text-white-200">{Error.getCareer}</p>
                        </div>
                        :
                     careerData.careers.length > 0 ?
                        careerData.careers.map((data: any, i: number)=>(
                        <div id="box" key={i} className="w-full md:w-[350px] h-[230px] bg-dark-200 p-4 rounded-md ">
                            <div id="top" className="w-full flex items-start justify-between gap-5">
                                <div id="img" style={{...logoStyle, backgroundImage:`url(${data?.logo})`}} className="w-[90px] h-[90px] bg-dark-400 rounded-md "></div>
                                <div id="info" className="w-auto flex flex-col items-start justify-start">
                                    <p className="text-white-100 font-extrabold capitalize ">{data.orgName.length > 10 ? data.orgName.slice(0, 10) : data.orgName}</p>
                                    <p className="text-white-300 text-[15px] ">{data.title}</p>
                                    <div className="flex items-start justify-start gap-3">
                                        <span className="mt-3 text-[10px] font-extrabold text-white-100 px-2 py-1 bg-dark-400 rounded-sm capitalize">
                                        {data.jobRole}
                                        </span>
                                        <span className="mt-3 text-[10px] font-extrabold text-white-100 px-2 py-1 bg-dark-400 rounded-sm capitalize">
                                        {data.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-row items-start justify-start flex-wrap gap-4">
                                {
                                    data.tags.split(",").map((tag: string)=>(
                                        <span key={tag} className="mt-3 text-[12px] text-white-300 px-2 py-1 bg-dark-300 rounded-sm capitalize">
                                            {tag}
                                        </span>
                                    ))
                                }
                            </div>
                            <br />
                            <a href={`/career/${data.id}`} target="_blank" className="w-full">
                                <button className="w-full h-auto px-7 py-2 bg-blue-300 hover:bg-dark-500 rounded-md text-white-200 font-extrabold">
                                    Apply
                                </button>
                            </a>
                        </div>
                    ))
                        :
                    <div className="w-full flex flex-col items-center justify-center ">
                        <p className="text-white-200">No Application available.</p>
                    </div>
                }
            </div>
        </div>
    )
}

function CandidateCards({candidateData, handleTargetUser}: any){
    const { Loader, Error} = useContext<any>(DataContext);
    const logoStyle ={
        backgroundSize: "cover",
        backgroundPosition:"center",
        backgroundRepeat: "no-repeat"
    }

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <br />
            <br />
            <br />
            <div className="w-full md:w-[90%] h-auto px-4 flex flex-wrap items-start justify-start gap-5 ">
                {
                    Loader.githubUsers ?
                        <div className="w-full flex flex-col items-center justify-center">
                            <Spinner />
                        </div>
                        :
                    Error.githubUsers !== null ?
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="text-white-200">{Error.githubUsers}</p>
                        </div>
                    :
                    candidateData.githubUsers.length > 0 ? 
                        candidateData.githubUsers.map((data: any, i: number)=>(
                            <div id="box" key={i} className="w-full md:w-[255px] h-[300px] bg-dark-200 p-4 rounded-md flex flex-col items-center justify-start ">
                                <div id="img" style={{...logoStyle, backgroundImage:`url(${data?.avatar_url})`}} className="w-[100px] h-[100px] bg-dark-400 rounded-[50%] mt-5 "></div>
                                <br />
                                <p className="text-blue-300 text-[20px] font-extrabold capitalize ">{data.login}</p>
                                <p className="text-white-300 text-[15px] ">@{data.login}</p>
                                <br />
                                <button className="w-full flex flex-col items-center justify-center rounded-[30px] bg-blue-300 px-3 py-3 font-extrabold text-white-100 " data-login={data.login} onClick={handleTargetUser}>
                                    View Profile
                                </button>
                            </div>
                    ))
                    :
                    <div className="w-full flex flex-col items-center justify-center ">
                        <p className="text-white-200">No Users available.</p>
                    </div>
                }
            </div>
        </div>
    )
}

function SelectedUser({userLogin, active, toggleModal}: any){

    const [data, setData] = useState<any>({})
    const [loader, setLoader]= useState(false)
    const [error, setError] = useState<any>(null)
    const [steps, setSteps] = useState(1)
    const [sendData, setSendData] = useState({
        email: data.email || "",
        careerUrl: "",
    })

    const handleSteps = (step: number) => setSteps(step)
    const handleInput = (e: any)=>{
        const value = e.target.value;
        const name = e.target.name;
        setSendData((prev: any)=> ({...prev, [name]: value}))
    }
    
    const logoStyle ={
        backgroundSize: "cover",
        backgroundPosition:"center",
        backgroundRepeat: "no-repeat"
    }

    useEffect(()=>{
        if(userLogin !== ""){
            fetchUser()
        }
    }, [])

    async function fetchUser(){
        try {
            setLoader(true)
            const url = `https://api.github.com/users/${userLogin}`
            const res = await fetch(url)
            const data = await res.json()
            setLoader(false)

            setData(data)
        } catch (e: any) {
            setLoader(false)
            setError(`Something went wrong. ${e.message}`)
        }
    }

    async function continueHire(){
        const {email, careerUrl} = sendData;
        if(email === "") return notif.error("email is missing")
        if(careerUrl === "") return notif.error("career Url is missing")

        const msgFormat = `
        Hello ${data.name} after checking your github profile, I realize you would be a good fit for the Job I would be requesting.

        Please send your resume/ cv to the link below:

        <a href="${careerUrl}">${careerUrl}</a>
        `
        sendMail(email, msgFormat)
        notif.success("hiring mesage sent successfully")        
        toggleModal()
    }

    return (
        <Modal isActive={active} colorType='dark' clickHandler={toggleModal}>
            <div className="w-[350px] h-autoflex flex-col items-center justify-center bg-dark-200 rounded-md ">
                {
                    loader ?
                        <div className="w-full p-3 flex flex-col items-center justify-center h-full">
                            <Spinner />
                        </div>
                        :
                    error !== null ?
                        <div className="w-full p-3 flex flex-col items-center justify-center h-full">
                            <p className="text-white-200 text[15px] ">{error}</p>
                        </div>
                        :
                    Object.entries(data).length > 0 ?
                        <>
                            <div className="w-full p-3 h-[100px] flex flex-col items-center justify-center bg-dark-600 relative">
                                <a href={`https://github.com/${data.login}`} target="_blank">
                                    <AiFillGithub className='text-blue-300 absolute top-4 right-4 text-[20px] ' />
                                </a>
                                <div id="img" style={{...logoStyle, backgroundImage:`url(${data?.avatar_url})`}} className="w-[100px] h-[100px] bg-dark-500 rounded-[50%] mt-5 absolute bottom-[-40px] border-[3px] border-solid border-blue-300 "></div>
                            </div>
                            <br />
                            <br />
                            <br />
                            { steps === 1 ? <div id="info" className="w-full flex flex-col items-center justify-center text-center px-5">
                                <p className="text-white-100 font-extrabold text-[20px] capitalize ">{data.name}</p>
                                <p className="text-white-300 text-[15px]">@{data.login}</p>
                                <br />
                                <br />
                                <div className="w-full flex flex-row items-center justify-around">
                                    <div id="box" className="w-auto flex flex-col items-center justify-center">
                                        <p className="text-white-200 font-extrabold text-[20px] ">{data.followers}</p>
                                        <p className="text-white-300 text-[12px] ">Followers</p>
                                    </div>
                                    <div id="box" className="w-auto flex flex-col items-center justify-center">
                                        <p className="text-white-200 font-extrabold text-[20px] ">{data.following}</p>
                                        <p className="text-white-300 text-[12px] ">Following</p>
                                    </div>
                                    <div id="box" className="w-auto flex flex-col items-center justify-center">
                                        <p className="text-white-200 font-extrabold text-[20px] ">{data.public_repos}</p>
                                        <p className="text-white-300 text-[12px] ">Repo</p>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <button className="w-full px-5 py-2 text-[20px] font-extrabold text-white-100 bg-blue-300 flex flex-col items-center justify-center rounded-[30px] hover:bg-dark-400 border-[2px] border-solid border-blue-300 " onClick={()=> handleSteps(2)}>
                                    Hire
                                </button>
                            </div>
                            :
                            <div className="w-full h-auto px-3 py-2 flex flex-col items-start justify-start">
                                <input type="text" name="email" className="w-full p-2 rounded-md text-white-100 bg-dark-400" value={sendData.email} disabled={sendData.email === null || sendData.email === "" ? false: true} placeholder="email" onChange={handleInput} />
                                <br />
                                <input type="text" name="careerUrl" className="w-full p-2 rounded-md text-white-100 bg-dark-400" value={sendData.careerUrl}  placeholder="career page url" onChange={handleInput} />
                                <br />
                                <div className="w-full flex flex-row items-center justify-between">
                                    <Button type='secondary' text='Back' onClick={()=> handleSteps(1)} />
                                    <Button type='primary' text='Hire Me' onClick={continueHire} />
                                </div>
                            </div>
                            }
                            <br />
                        </>
                        :
                    <div className="w-full p-3 flex flex-col items-center justify-center h-full">
                        <p className="text-white-200 text[15px] ">No user available</p>
                    </div>
                }
            </div>
        </Modal>

    )
}