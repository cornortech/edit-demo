import React from 'react';
import { usePDF,  Resolution, Margin  } from 'react-to-pdf';
import Home from '../app/page';

type Props = {
  correctedGrammer: string; // Assuming correctedGrammer is of type string
};

const PDF: React.FC<Props> = ({ correctedGrammer }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

  return (
    <div>
      <button className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md" onClick={() => toPDF()}>PDF</button>
      <div className='flex justify-center h-full flex-col' ref={targetRef}>
        <div>

        <p className='text-center '>{correctedGrammer}</p>
        <p>_____</p>
        </div>
      </div>
    </div>
  );
};

export default PDF;
