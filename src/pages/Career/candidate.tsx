import React,{useState, useEffect, useContext, useRef} from 'react'
import ReactMarkdown from 'react-markdown'
import {BsNewspaper, BsEyeglasses} from "react-icons/bs"
import {GrOverview} from "react-icons/gr"
import {MdOutlineFactCheck} from "react-icons/md"
import {BiSmile, BiTargetLock} from "react-icons/bi"
import { Button, Input } from '../../components/UI-COMP'
import DataContext from '../../context/DataContext'
import Notification from '../../utils/toast'
import { useParams } from 'react-router-dom'
import APIROUTES from '../../apiRoutes'
import Fetch from '../../utils/fetch'
import { Spinner } from '../../components/UI-COMP/loader'
import moment from 'moment'
import { sleep } from '../../utils'

const notif = new Notification();


const overview = `
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam neque voluptates cupiditate mollitia nisi, enim, dolor optio officia voluptate at, explicabo recusandae. Quam dolorem dicta fugit impedit odio obcaecati quos!
<br/>
<br/>
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas earum ipsum doloremque. Est minima neque repellendus corrupti maiores saepe nobis!
<br/>
<br/>
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas earum ipsum doloremque. Est minima neque repellendus corrupti maiores saepe nobis!
`



function CandidateCareerPage() {

  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
  const [inputData, setInputData] = useState<any>({
    fullName: "",
    email: "",
    link: "",
    document: ""
  })
  const {career_id} = useParams()
  
  const candidateStatus = localStorage.getItem("meetvast_application_status") === null ? [] : JSON.parse(localStorage.getItem("meetvast_application_status") as any);

  const logoStyle ={
    backgroundSize: "cover",
    backgroundPosition:"center",
    backgroundRepeat: "no-repeat"
  }

  // let fileElem = useRef();

  useEffect(() => {
    fetchAllCareers()
    
  }, []);

  async function fetchAllCareers(){
    try {
      setLoader((prev: any)=>({...prev,  ["careerPage"]: true}))
      const url = `${APIROUTES.careerById}/${career_id}`
      const {res, data} = await Fetch(url, {
        method: "GET",
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

  const handleInput = (e: any)=>{
    const name = e.target.name;
    const value= e.target.value;
    setInputData((prev: any)=>({...prev, [name]:value}))
  }

  function handleFileUpload(e: any) {
    const target = e.target;
    const validType = ["pdf", "PDF"];
    const file = target.files[0];
    const type = file?.type.split("/")[1];

    if (!validType.includes(type)) {
      return notif.error("Invalid file type uploaded");
    }
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        inputData["document"]=(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  
  function storeMeetvastCareerIds(){
    let storage : any[] = candidateStatus?.careersId || [];
    if(storage.includes(career_id)) return;
    storage.push(career_id)
    localStorage.setItem("meetvast_application_status", JSON.stringify({careersId: storage}))
  }

  async function submitApplication(){

    const {fullName, email, link, document} = inputData;
    if (fullName === "" || email === "" || link === "" || document === "") {
      return notif.error("some fields are missing!.")
    }

    inputData["careerId"] = career_id;
    inputData["jobRole"] = Data.careerPage[0].jobRole;
    inputData["duration"] = Data.careerPage[0].duration;
    
    try {
      setLoader((prev: any)=>({...prev,  ["candidateApplication"]: true}))
      const url = APIROUTES.addCandidate
      const {res, data} = await Fetch(url, {
        method: "POST",
        body: JSON.stringify(inputData)
      })
      setLoader((prev: any)=>({...prev,  ["candidateApplication"]: false}))
      
      if(!data.success){
        notif.error(data.message)
        return
      }

      notif.success(data.message)
      await sleep(1)
      storeMeetvastCareerIds()
      window.location.reload()

    } catch (e: any) {
      console.log(e);
      setLoader((prev: any)=>({...prev,  ["candidateApplication"]: false}))
      notif.error(`something went wrong. ${e.message}`)
    }
    
  }

  const data = Data.careerPage[0];

  console.log(data)

  return (
    <>
      {
        Loader.careerPage ? 
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <Spinner />
            <p className="text-white-200">Loading...</p>
          </div>
          :
        Error.careerPage !== null ?
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <p className="text-white-200">{Error.careerPage}</p>
          </div>
          :
        Data.careerPage.length === 0 ?
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <BsEyeglasses className=' text-blue-300 text-[70px] mb-2 ' />
            <p className="text-white-200">Oops!!. Looks like this page no longer exists.</p>
          </div>
          :
          <div className="w-full h-screen overflow-x-hidden">
            <div id="head" className="w-full h-[130px] bg-[#4791e0]"></div>
            <div id="content" className="w-full h-screen flex flex-row items-start justify-start bg-dark-100">
              <div id="left" className="w-[800px] h-screen px-10">
                <div id="head" className="w-full relative top-[-50px] flex flex-col items-start justify-start">
                  <div id="img" style={{...logoStyle, backgroundImage:`url(${data?.logo})`}} className=" p-7 rounded-md bg-dark-200 w-[100px] h-[100px] "></div>
                  <br />
                  <div className="w-full flex flex-col items-start justify-start">
                    <p className="text-white-100 text-[20px] font-extrabold capitalize ">
                      {data?.orgName} <span className="text-green-200 ml-5 underline font-extrabold text-[12px] ">{moment(new Date(+data?.createdAt)).startOf('hour').fromNow()}</span> </p>
                    <p className="text-white-200 text-[15px] mt-3 capitalize ">
                      {data?.title} <span className="text-white-300">( {data?.jobRole} )</span>
                    </p>
                    <div className="mt-5 w-full flex flex-row items-start justify-start ">
                      <p className="px-3 py-1 flex flex-row items-center justify-start gap-2 txet-[12px] text-white-100 rounded-[3px] bg-blue-300 capitalize  ">
                        <BsNewspaper className=' text-[14px] text-white-100' />
                        {data?.duration}
                      </p>
                      <span className="ml-2 mr-2 text-white-300  "></span>
                      {
                        data?.tags?.split(",").map((list: any, i:number)=>(
                          <p key={i} className="px-3 py-1 flex flex-row items-center justify-start gap-2 txet-[12px] text-white-300 rounded-[3px] bg-dark-200 ml-1 ">
                            {list}
                          </p>
                        ))
                      }
                    </div>
                    <br />
                    <div className="mt-5 w-full flex flex-col items-start justify-start ">
                      <div id="overview" className="w-full flex flex-col items-start justify-start">
                        <p className="text-white-100 font-extrabold text-[25px]  flex flex-row items-center justify-start gap-3 ">
                          <GrOverview className="text-white-100 text-[25px] bg-blue-400 opacity-[.6] p-1 rounded-md " /> Overview
                        </p>
                        <br />
                        <CustomContent content={data.overview} />
                      </div>
                      <br />
                      <div id="requirements" className="w-full flex flex-col items-start justify-start">
                        <p className="text-white-100 font-extrabold text-[25px]  flex flex-row items-center justify-start gap-3 ">
                          <BiTargetLock className="text-white-100 text-[25px] bg-blue-400 opacity-[.6] p-1 rounded-md " /> Requirements
                        </p>
                        <br />
                        <CustomContent content={data.requirements} />
                      </div>
                      <br />
                      <div id="benefits" className="w-full flex flex-col items-start justify-start">
                        <p className="text-white-100 font-extrabold text-[25px]  flex flex-row items-center justify-start gap-3 ">
                          <BiSmile className="text-white-100 text-[25px] bg-blue-400 opacity-[.6] p-1 rounded-md " /> Benefits
                        </p>
                        <br />
                        <CustomContent content={data.benefits} />
                      </div>
                      <br />
                      <div className="w-full h-[50px]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="right" className="w-[500px] px-3 h-screen ">
                {
                  candidateStatus?.careersId?.includes(career_id)  ? 
                  <div className="w-[400px] h-full mt-10 rounded-md border-[1px] border-solid border-dark-200 py-4 px-3 text-center flex flex-col items-center justify-center ">
                    <MdOutlineFactCheck className=" text-[40px] text-green-400 " />
                    <p className="text-green-400 text-[30px] ">
                      Application Sent.
                    </p>
                    <p className="text-white-200 text-[15px] ">
                      Your application for this job has been sent and awaiting review.
                    </p>
                  </div>
                  :
                    <div id="form" className="w-full h-auto mt-10 rounded-md border-[1px] border-solid border-dark-200 py-4 px-3 flex flex-col items-center justify-center ">
                      <div id="head" className="w-full flex flex-col items-start justify-start">
                        <p className="text-white-200 text-[20px] font-extrabold ">Application</p>
                      </div>
                      <br />
                      <Input value={inputData.fullName} placeholder="Full Name" type="text" name="fullName" onChange={handleInput} />
                      <br />
                      <Input value={inputData.email} placeholder="Email" type="email" name="email" onChange={handleInput} />
                      <br />
                      <Input value={inputData.link} placeholder="Website url" type="url" name="link" onChange={handleInput} />
                      <br />
                      <small className="text-white-300 w-full">CV / Resume</small>
                      <Input type="file" id="fileupload" onChange={handleFileUpload} />
                      <br />
                      <Button text={Loader.candidateApplication ? "Submitting..." : 'Submit Application' } onClick={submitApplication} disabled={Loader.candidateApplication} long={true} type="primary" size='xl' />
                    </div>
                }
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default CandidateCareerPage

interface ContentType{
  content: string;
}

function CustomContent({content}: ContentType){

  return (
    <div className="w-full text-white-200">
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
}