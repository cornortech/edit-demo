"use client";

 import { SimpleEditor } from "@/components/Editor";
//import Notes from '@/components/Notes'
import {  useState } from "react";
// import Page from "@/components/Chardiff";
import axios from "axios";
import { usePDF } from "react-to-pdf";
// import PDF from "@/components/PDF";

import Copy from '@/components/Copy';
export default function Home() {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [prompt, setPrompt] = useState("");
  const [correctedGrammer, setCorrectedGrammer] = useState("")
   
  const handleExportPdf = () => {
    toPDF()
  }

  // const exportPdf = () => {
    
  // }
  const handleGrammerCheck = async () => {
    // const filtered_prompt = removePTagsAndWhitespace(prompt);

    try {
      const { data, status } = await axios.post(
        "http://localhost:8000/ask-ai",
        { prompt }
      );
      
      if (status === 200) {
        setCorrectedGrammer(data.message)
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  
   

  
  return (
    <div className="bg-slate-100 w-full min-h-screen pb-10 flex flex-col items-center justify-center">
      <div className="w-8/12 border-solid border border-slate-200 flex flex-col">
        <div className="w-11/12 lex flex-col items-center justify-center" >
          <h2 className="txt-3xl txt-dark p-5">Submit your story</h2>
           <p  className="txt-xl txt-slate-800 p-5" >Write your story below ,or copy/paste from your favourite editor.Please keep your submission between 1k-3k words</p>
           {/* <h6 className="txt-3xl txt-slate-800 p-5">Submission Title</h6> */}
           {/* <input className="shadow appearance-none border rounded w-full py-2 px-3 m-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Enter title"></input> */}
        </div>

       <SimpleEditor  />

        {/* <Notes /> */}
      </div>
      
      {/* <Copy corrected={correctedGrammer}  /> */}
      {/* <PDF originals={prompt} corrected={correctedGrammer} /> */}
        {/* <Page originals={prompt} corrected={correctedGrammer} /> */}
      
    </div>
  );
}

// 


  //  <div
  //    className=" justify-center content-center items-center h-full flex-col w-full  relative z-[-10]"
  //    ref={targetRef}
  //  >
  //    <div className="w-11/12 ">
  //      <h1
  //        style={{ fontSize: "25px" }}
  //        className=" bold antialiased leading-10 p-20 "
  //      >
  //        {correctedGrammer}
  //      </h1>
  //      {/* <p>_____</p> */}
  //    </div>
  //  </div>;

 