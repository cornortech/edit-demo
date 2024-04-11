"use client";

import NotesPicker from "@/components/NotePicker";
//import Notes from '@/components/Notes'
import { useEffect, useState } from "react";
import Page from "@/components/Chardiff";
import axios from "axios";
import PDF from "@/components/PDF";
import { usePDF } from "react-to-pdf";
export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [correctedGrammer, setCorrectedGrammer] = useState("")
  
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
        <NotesPicker setPrompt={setPrompt} handleGrammerCheck={handleGrammerCheck} />
       
        
        {/* <Notes /> */}
        <Page originals={prompt} corrected={correctedGrammer}   />
      </div>
      <PDF originals={prompt} corrected={correctedGrammer} />
    </div>
  );
}
