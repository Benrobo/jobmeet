import React, { useContext, useEffect, useRef, useState } from "react";
import { Layout } from "../../components";
import { Button, Input } from "../../components/UI-COMP";
import { BiTrashAlt, BiEditAlt, BiTrash } from "react-icons/bi";
import Notification from "../../utils/toast";
import { validateEmail } from "../../utils/validate";
import DataContext from "../../context/DataContext";
import Fetch from "../../utils/fetch";
import APIROUTES from "../../apiRoutes";
import moment from "moment"
import { LoaderScreen } from "../../components/UI-COMP/loader";
import { sleep } from "../../utils";

const notif = new Notification();


function CareerAuthorPage() {
  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
  const [careerForm, setCareerForm] = useState(false);
  const [steps, setSteps] = useState(1);

  const toggleCareerForm = () => setCareerForm(!careerForm);

  const toggleSteps = (step: number) => setSteps(step);

  const [inputData, setInputData] = useState<any>({
    orgName: "",
    title: "",
    email: "",
    tags: "",
    duration: "",
    jobRole: "",
    logo: "",
    overview: "",
    requirements: "",
    benefits: ""
  });

  const handleInputData = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputData((prev: any) => ({ ...prev, [name]: value }));
  };

  async function createCareer(step: number) {
    // const {name} = payload;
    if (step === 1) {
      const { orgName, title, email, tags, duration, jobRole } = inputData;

      if (
        orgName === "" ||
        title === "" ||
        email === "" ||
        tags === "" ||
        duration === "" ||
        jobRole === ""
      ) {
        return notif.error("input fields cant be empty");
      }
      // validate email
      if (!validateEmail(email)) return notif.error("email is invalid");
      return true;
    }
    if (step === 2) {
      const { logo } = inputData;
      if (logo === "") {
        return notif.error("organization logo image cant be empty");
      }
      return true;
    }
    if (step === 3) {
      const { overview } = inputData;
      if (overview === "") {
        return notif.error("career overview image cant be empty");
      }
      return true;
    }
    if (step === 4) {
      const { requirements } = inputData;
      if (requirements === "") {
        return notif.error("career requirements image cant be empty");
      }
      return true;
    }

    if (step === 5) {
      const { benefits } = inputData;
      if (benefits === "") {
        return notif.error("career benefits image cant be empty");
      }
      
      // create career page
      
      try {
        setLoader((prev: any)=>({...prev,  ["createCareer"]: true}))
        const url = APIROUTES.createCareer
        const {res, data} = await Fetch(url, {
          method: "POST",
          body: JSON.stringify(inputData)
        })
        setLoader((prev: any)=>({...prev,  ["createCareer"]: false}))

        if(!data.success){
          notif.error(data.message)
          return
        }

        notif.success(data.message)
        setData((prev: any)=>({...prev, ["careers"]: data.data || []}))
        toggleCareerForm()
        window.location.reload()

      } catch (e: any) {
        setLoader((prev: any)=>({...prev,  ["createCareer"]: false}))
        notif.error(`something went wrong. ${e.message}`)
      }



    }
    
  }

  useEffect(() => {
    fetchAllCareers()
  }, []);

  async function fetchAllCareers(){
    try {
      setLoader((prev: any)=>({...prev,  ["getCareer"]: true}))
      const url = APIROUTES.careerByUserId
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

  return (
    <Layout sideBarActiveName="career">
      <div
        id="head"
        className="w-full h-auto flex flex-row items-center justify-between px-6 py-7"
      >
        <div
          id="left"
          className="w-auto flex flex-col items-start justify-start"
        >
          <h2 className="text-white-100 font-extrabold text-[20px] ">
            All Pages
          </h2>
          <span className="text-white-200 text-[12px] ">
            Create a new career page.
          </span>
        </div>
        <div id="right" className="w-auto">
          <Button
            text="Create Career Page"
            type="primary"
            onClick={toggleCareerForm}
          />
        </div>
      </div>
      <br />
      <br />
      <div
        id="all-pages"
        className="w-full flex flex-wrap h-auto items-center justify-start px-6 py-5 gap-3"
      >
        {
          Loader.getCareer ?
            <div className="w-full flex flex-col items-center">
              <p className="text-white-200">Loading...</p>
            </div>
            :
          Error.getCareer !== null ?
            <div className="w-full flex flex-col items-center">
              <p className="text-white-200">{Error.getCareer}</p>
            </div>
            :
          Data.careers.length > 0 ?
          Data.careers.map((list: any, i: number) => (
            <PageCards data={list} key={i} />
          ))
          :
          <div className="w-full flex flex-col items-center">
            <p className="text-white-200">No careers available</p>
          </div>
        }
      </div>
      {careerForm && <CreateCareerPage handleInputData={handleInputData} steps={steps} toggleSteps={toggleSteps} createCareer={createCareer} toggleCareerForm={toggleCareerForm} inputData={inputData} loader={Loader} />}
    </Layout>
  );
}

export default CareerAuthorPage;

function PageCards({data}: any) {
  const {setLoader, Loader, Error, setError, Data, setData} = useContext<any>(DataContext)
  // const [actionActive, setMoreActive] = useState(0);

  const logoStyle ={
    backgroundSize: "cover",
    backgroundPosition:"center",
    backgroundRepeat: "no-repeat"
  }

  async function deleteCareer(id: string){

    const confirm = window.confirm("Are you sure about this?")
    if(!confirm) return;

    try {
      setLoader((prev: any)=>({...prev,  ["deleteCareer"]: true}))
      const url = APIROUTES.deleteCareer
      const {res, data} = await Fetch(url, {
        method: "DELETE",
        body: JSON.stringify({careerId: id})
      })
      setLoader((prev: any)=>({...prev,  ["deleteCareer"]: false}))
      
      if(!data.success){
        notif.error(data.message)
        return
      }
      
      notif.success(data.message)
      await sleep(1)
      window.location.reload()

    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["getCareer"]: false}))
      setError((prev: any)=>({...prev, ["getCareer"]: `Something went wrong. ${e.message}`}))
    }
  }

  function cardActions(e: any){
    const dataset = e.target.dataset;
    if(Object.entries(dataset).length > 0){
      const { id, type } = dataset;

      if (type === "delete") deleteCareer(id)
    }
  }
    

  return (
    <>
      {Loader.deleteCareer && <LoaderScreen text="Loading..." />}
      <div
        id="career-page-card"
        className="w-[250px] h-[280px] p-3 flex flex-col items-start justify-start bg-dark-300 rounded-md relative"
      >
        
        <div
          id="card-action"
          
          className="absolute top-2 right-3 cursor-pointer flex flex-row items-center justify-center gap-4"
        >
          <BiEditAlt className="text-[25px] cursor-pointer scale-[.90] text-white-100 p-1 rounded-md opacity-[.90] bg-blue-300 " data-id={data?.id} data-type="edit" />
          <BiTrashAlt className="text-[25px] cursor-pointer scale-[.90] text-white-100 p-1 rounded-md opacity-[.90] bg-red-200 " data-id={data?.id} data-type="delete" onClick={cardActions} />
        </div>

        <div
          id="top"
          className="w-full flex flex-row items-center justify-start gap-3"
        >
          <div id="img" style={{...logoStyle, backgroundImage:`url(${data?.logo})`}} className=" p-7 rounded-md bg-dark-200 w-[70px] h-[70px] "></div>
        </div>
        <br />
        <div id="info" className="flex flex-col items-start justify-start">
          <a
            href={`/career/${data.id}`}
            target="_blank"
            className="text-[15px] font-extrabold text-white-100 underline cursor-pointer capitalize "
          >
            {data?.title}
          </a>
          <p className="text-[12px] font-extrabold text-white-200 capitalize">
            {data?.jobRole}
          </p>
        </div>
        <br />
        <div
          id="tags"
          className="w-full flex flex-wrap items-start justify-start gap-3"
        >
          <span className="text-[10px] font-extrabold text-white-200 px-2 py-1 bg-dark-100 rounded-md capitalize">
            {data?.duration}
          </span>
        </div>
        <br />
        <p className="text-[10px] pb-2 text-white-200">
          {moment(new Date(+data?.createdAt)).startOf('hour').fromNow()}
        </p>
      </div>
    </>
  );
}

function CreateCareerPage({ toggleCareerForm, createCareer, handleInputData, steps, toggleSteps, inputData, loader }: any) {


  return (
    <div className="w-full h-screen bg-dark-500 absolute top-0 left-0 flex flex-col items-center justify-center ">
      <div id="box" className="w-[450px] h-auto p-5 bg-dark-300 rounded-md ">
        <div id="head" className="flex flex-col items-start justify-start">
          <p className="text-[15px] font-extrabold text-white-200">
            Create Career Page
          </p>
          <p className="text-[12px] text-white-200">
            Create a live career page.
          </p>
        </div>
        <br />
        <div
          id="form"
          className="w-full flex flex-col items-start justify-start"
        >
          {steps === 1 ? (
            <Step1
              toggleSteps={toggleSteps}
              toggleCareerForm={toggleCareerForm}
              inputData={inputData}
              createCareer={createCareer}
              handleInputData={handleInputData}
            />
          ) : steps === 2 ? (
            <Step2
              toggleSteps={toggleSteps}
              toggleCareerForm={toggleCareerForm}
              inputData={inputData}
              createCareer={createCareer}
            />
          ) : steps === 3 ? (
            <Step3
              toggleSteps={toggleSteps}
              inputData={inputData}
              createCareer={createCareer}
              handleInputData={handleInputData}
            />
          ) : steps === 4 ? (
            <Step4
              toggleSteps={toggleSteps}
              inputData={inputData}
              createCareer={createCareer}
              handleInputData={handleInputData}
            />
          ) : steps === 5 ? (
            <Step5
              toggleSteps={toggleSteps}
              inputData={inputData}
              createCareer={createCareer}
              handleInputData={handleInputData}
              loader={loader}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

function Step1({
  toggleCareerForm,
  toggleSteps,
  createCareer,
  inputData,
  handleInputData,
}: any) {
  

  return (
    <div className="w-full flex flex-col items-start justify-start">
      <Input
        placeHolder="Organization Name"
        name="orgName"
        onChange={handleInputData}
        value={inputData.orgName}
      />
      <Input
        placeHolder="Title"
        name="title"
        onChange={handleInputData}
        value={inputData.title}
      />
      <Input
        placeHolder="Email"
        name="email"
        onChange={handleInputData}
        value={inputData.email}
      />
      <Input
        placeHolder="Tags: separate each words with comma (,)"
        name="tags"
        onChange={handleInputData}
        value={inputData.tags}
      />
      <div className="w-full flex flex-row items-center justify-between gap-5">
        <Input
          placeHolder="Duration: fulltime, part-time"
          name="duration"
          onChange={handleInputData}
          value={inputData.duration}
        />
        <Input
          placeHolder="Job Role: designer, developer"
          name="jobRole"
          onChange={handleInputData}
          value={inputData.jobRole}
        />
      </div>
      <br />
      <div className="w-full flex flex-row items-center justify-between">
        <Button text="Close" type="danger" onClick={toggleCareerForm} />
        <Button
          text="Continue"
          type="primary"
          onClick={() => {
            const result = createCareer(1);
            if (!result) return;
            toggleSteps(2);
          }}
        />
      </div>
    </div>
  );
}

function Step2({ toggleSteps, createCareer, inputData }: any) {
  let fileElem = useRef(null);

  function handleImgUpload(e: any) {
    const validType = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"];
    const file = (fileElem as any).current.files[0];
    const type = file?.type.split("/")[1];

    if (!validType.includes(type)) {
      return notif.error("Invalid file type uploaded");
    }
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        inputData["logo"]=(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="w-full h-auto">
      <div className="w-full h-auto flex flex-col items-start justify-start">
        <p className="text-white-100 pb-3 font-extrabold">
          Upload Organization Logo
        </p>
        <div
          id="upload-img"
          className="w-full p-4 border-dashed border-[2px] border-white-300 flex flex-col items-center justify-center "
        >
          <input type="file" id="fileupload" onChange={handleImgUpload} className='fileUpload w-full rounded-md ourtline-none bg-dark-200 px-3 py-3 mt-4 text-white-200' ref={fileElem} />
        </div>
      </div>
      <br />
      <div className="w-full flex flex-row items-center justify-between">
        <Button text="Back" type="secondary" onClick={() => toggleSteps(1)} />
        <Button
          text="Continue"
          type="primary"
          onClick={ () => {
            const result = createCareer(2);
            if (!result) return;
            toggleSteps(3);
          }}
        />
      </div>
    </div>
  );
}

function Step3({ toggleSteps, handleInputData, createCareer }: any) {
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <textarea
        name="overview"
        id=""
        cols={30}
        rows={10}
        className="w-full rounded-md ourtline-none bg-dark-200 px-3 py-3 mt-4 text-white-200"
        placeholder="Overview"
        onChange={handleInputData}
      ></textarea>
      <br />
      <div className="w-full flex flex-row items-center justify-between">
        <Button text="Back" type="secondary" onClick={() => toggleSteps(2)} />
        <Button text="Continue" type="primary" onClick={() => {
            const result = createCareer(3);
            if (!result) return;
            toggleSteps(4);
          }} />
      </div>
    </div>
  );
}

function Step4({ toggleSteps, handleInputData, createCareer }: any) {
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <textarea
        name="requirements"
        id=""
        cols={30}
        rows={10}
        className="w-full rounded-md ourtline-none bg-dark-200 px-3 py-3 mt-4 text-white-200"
        placeholder="Requirements"
        onChange={handleInputData}
      ></textarea>
      <br />
      <div className="w-full flex flex-row items-center justify-between">
        <Button text="Back" type="secondary" onClick={() => toggleSteps(3)} />
        <Button text="Continue" type="primary" onClick={ () => {
            const result = createCareer(4);
            if (!result) return;
            toggleSteps(5);
          }} />
      </div>
    </div>
  );
}

function Step5({ toggleSteps, handleInputData, createCareer, loader }: any) {
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <textarea
        name="benefits"
        id=""
        cols={30}
        rows={10}
        className="w-full rounded-md ourtline-none bg-dark-200 px-3 py-3 mt-4 text-white-200"
        placeholder="Benefits"
        onChange={handleInputData}
      ></textarea>
      <br />
      <div className="w-full flex flex-row items-center justify-between">
        <Button text="Back" type="secondary" onClick={() => toggleSteps(4)} />
        <Button
          text={loader.createCareer ? "Creating" : "Create Page"}
          type="primary"
          disabled={loader.createCareer}
          onClick={() => createCareer(5)}
        />
      </div>
    </div>
  );
}
