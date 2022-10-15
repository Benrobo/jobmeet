import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import APIROUTES from "../../apiRoutes";
import { Spinner } from "../../components/UI-COMP/loader";
import DataContext from "../../context/DataContext";
import Fetch from "../../utils/fetch";

function CandidateDocument() {
  const { setLoader, Loader, Error, setError, Data, setData } = useContext<any>(DataContext);
  const [filteredCandidateDoc, setFilteredCandidateDoc] = useState("")
  const {candidateId} = useParams()

  useEffect(() => {
    fetchAllCandidate()
  }, []);

  async function fetchAllCandidate() {
    try {
      setLoader((prev: any)=>({...prev,  ["fetchCandidates"]: true}))
      const url = `${APIROUTES.allCandidate}`
      const {res, data} = await Fetch(url, {
        method: "GET",
      })
      setLoader((prev: any)=>({...prev,  ["fetchCandidates"]: false}))
      
      if(!data.success){
        setError((prev: any)=>({...prev, ["fetchCandidates"]: data.message}))
        return
      }
      

      const filteredData : any = data.data.length > 0 ? data.data.filter((user: any)=> user.id === candidateId)[0] : ""
      setFilteredCandidateDoc(filteredData?.document || "")

    } catch (e: any) {
      setLoader((prev: any)=>({...prev,  ["fetchCandidates"]: false}))
      setError((prev: any)=>({...prev, ["fetchCandidates"]: `Something went wrong. ${e.message}`}))
    }
  }

  return <div className="w-full h-screen">
    {
      Loader.fetchCandidates ? 
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Spinner />
        </div>
        :
      Error.fetchCandidates !== null ?
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <p className="text-white-300 text-[15px] ">{Error.fetchCandidates}</p>
        </div>
        :
      filteredCandidateDoc !== "" ?
        <iframe src={filteredCandidateDoc} width="100%" height="100%"></iframe>
        :
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <p className="text-white-300 text-[15px] ">No document found.</p>
        </div>
    }
  </div>;
}

export default CandidateDocument;
