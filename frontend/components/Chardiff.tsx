import React, { ReactElement, useEffect, useState } from "react";
import { diffChars, Change } from "diff";
import Tiptap from "./Tiptap";
import { usePDF } from 'react-to-pdf';
const Page = ({
  originals,
  corrected,
}: {
  originals: string;
  corrected:string
}): ReactElement => {
  // const originals: string = "Two Dogs and the theives who steals Lives. ";

  const [improved,setImproved] =useState <ReactElement[]>([])




  const compareSentences = (
    original: string,
    corrected: string
  ): ReactElement[] => {
    const diff: Change[] = diffChars(original, corrected);
    const result: ReactElement[] = [];

    diff.forEach((part: Change, index: number) => {
      // Green for additions, red for deletions, grey for common parts
      const color: string = part.added
        ? "green"
        : part.removed
        ? "red"
          : "grey";
      
      const backgroundColor= part.added
          ? "#51d80e6d"
          : part.removed
          ? "#f0232366"
          : ""
      const textDecoration = part.added ? "underline": part.removed ?"line-through":""

      
      const style: React.CSSProperties = {
        color: color,
        backgroundColor,
        textDecoration,
      };
      const span: ReactElement = (
        <span key={index} style={style}>
          {part.value}
        </span>
      );
      result.push(span);
    });

    return result;
  };

  useEffect(() => {
  setImproved( compareSentences(originals, corrected))
  },[corrected])


 
  

  return (
   
    <div className="">
      {improved.length > 0 ? (
        improved.map((element: ReactElement, index: number) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))
      ) : (
        <div className="p-2">
          <p>your corrected data will be here </p>
        </div>
      )}
      </div>
  
  );
};

export default Page;
