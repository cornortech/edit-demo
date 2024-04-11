"use client";

import NotesPicker from "@/components/NotePicker";
//import Notes from '@/components/Notes'
import { useEffect, useState } from "react";
import Page from "@/components/Chardiff";
import axios from "axios";
import { usePDF } from "react-to-pdf";
export default function Home() {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [prompt, setPrompt] = useState("");
  const [correctedGrammer, setCorrectedGrammer] = useState("")

  const handleExportPdf = () => {
    
    toPDF()
  }
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
      <div className="w-96 border-solid border border-slate-200 ">
        <NotesPicker
          handleExportPdf={handleExportPdf}
          setPrompt={setPrompt}
          handleGrammerCheck={handleGrammerCheck}
        />

        {/* <Notes /> */}
        <Page originals={prompt} corrected={correctedGrammer} />
      </div>
      {/* <PDF correctedGrammer={correctedGrammer} /> */}
      <div>
        {/* <button className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md" onClick={() => toPDF()}>PDF</button> */}
        <div 
          
          className=" justify-center content-center items-center h-full flex-col w-full  relative z-[-10]"
          ref={targetRef}
        >
          <div className="w-11/12 ">
            <h1
              style={{ fontSize: "25px" }}
              className=" bold antialiased leading-10 p-20 "
            >
              {correctedGrammer}
            </h1>
            <p>_____</p>
          </div>
        </div>
      </div>
    </div>
  );
}
