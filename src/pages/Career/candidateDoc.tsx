import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import APIROUTES from "../../apiRoutes";
import { Spinner } from "../../components/UI-COMP/loader";
import DataContext from "../../context/DataContext";
import Fetch from "../../utils/fetch";
import { Viewer, Worker } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

function CandidateDocument() {
  const { setLoader, Loader, Error, setError, Data, setData } = useContext<any>(DataContext);
  const [filteredCandidateDoc, setFilteredCandidateDoc] = useState("")
  const [base64url, setBase64Url] = useState("")
  const {candidateId} = useParams()

  useEffect(() => {
    fetchAllCandidate()
  }, []);

  useEffect(()=>{
    if(filteredCandidateDoc !== "" || filteredCandidateDoc !== null){
      console.log({filteredCandidateDoc})
      const url = URL.createObjectURL(base64toBlob(filteredCandidateDoc));
      setBase64Url(url)
    }
  },[filteredCandidateDoc])

  const base64toBlob = (data: string) => {
    const pdfContentType = 'application/pdf';
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr(`data:${pdfContentType};base64,`.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: pdfContentType });
  };

  

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
      // window.location.href = filteredData.document

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
        // <iframe src={filteredCandidateDoc} width="100%" height="100%"></iframe>
        // <embed src={filteredCandidateDoc} width="100%" height="100%"/>
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '750px',
            }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
            <Viewer fileUrl={base64url} />
          </Worker>
        </div>
        :
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <p className="text-white-300 text-[15px] ">No document found.</p>
        </div>
    }
  </div>;
}

export default CandidateDocument;
