"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import Tiptap from "./Tiptap";

const Todo = ({
  setPrompt,
  handleGrammerCheck,
  handleExportPdf,
}: {
  setPrompt: Dispatch<SetStateAction<string>>;
  handleGrammerCheck: () => void;
  handleExportPdf: () => void;
}) => {
  const [content, setContent] = useState<string>("");
  const handleContentChange = (reason: any) => {
    setContent(reason);
    setPrompt(content);
  };

  console.log(content);

  // const handleSubmit = (e: any) => {
  //   e.preventDefault()
  //   const data = {
  //     id: uuidv4(),
  //     content: content,
  //   }
  //   console.log(data)
  //   const existingDataString = localStorage.getItem('myData')
  //   const existingData = existingDataString
  //     ? JSON.parse(existingDataString)
  //     : []
  //   const updatedData = [...existingData, data]
  //   localStorage.setItem('myData', JSON.stringify(updatedData))
  //   setContent('')
  // }

  return (
    <div
      //onSubmit={handleSubmit}
      className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10"
    >
      <div className="text-center text-dark pb-10">
        <h1 className="text-xl bold">Submit your story</h1>
        <p className=" text-slate-700 p-8">
          write your story below ,or copy/paste from your favourite editor.
          please keep your submission between 1k_3k words
        </p>
        <h6 className="p-2"> Submission title</h6>
        <input
          type="text"
          placeholder="Enter the title..."
          className="w-3/4  px-4 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
        />

        <p className="mt-2"> select upto 3 categroies</p>
      </div>
      <Tiptap
        handleExportPdf={handleExportPdf}
        content={content}
        handleGrammerCheck={handleGrammerCheck}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
    </div>
  );
};

export default Todo;
