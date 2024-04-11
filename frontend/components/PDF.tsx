import React from 'react';
import { usePDF } from 'react-to-pdf';



type Props = {
  correctedGrammer: string; 
};


const PDF: React.FC<Props> = ({ correctedGrammer }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

  return (
    <div>
      {/* <button className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md" onClick={() => toPDF()}>PDF</button> */}
      <div className='flex justify-center content-center items-center h-full flex-col w-full ' ref={targetRef}>
        <div className='w-11/12 '>

        <h1 style={{fontSize:"25px"}} className=' bold antialiased leading-10 p-20 '>{correctedGrammer}</h1>
        <p>_____</p>
        </div>
      </div>
    </div>
  );
};

export default PDF;
