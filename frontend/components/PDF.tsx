import React, { useState, useEffect } from 'react';
import { usePDF } from 'react-to-pdf';
import { Change, diffChars } from 'diff';
import Home from '../app/page';

type Props = {
  originals: string;
  corrected: string;
};

const PDF: React.FC<Props> = ({ originals, corrected }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [improved, setImproved] = useState<React.ReactElement[]>([]);

  const compareSentences = (original: string, corrected: string): React.ReactElement[] => {
    const diff: Change[] = diffChars(original, corrected);
    const result: React.ReactElement[] = [];

    diff.forEach((part: Change, index: number) => {
      
      const color: string = part.added ? 'green' : part.removed ? 'red' : 'black';
      const backgroundColor = part.added ? '#51d80e6d' : part.removed ? '#f0232366' : '';
      const textDecoration = part.added ? 'underline' : part.removed ? 'line-through' : '';

      const style: React.CSSProperties = {
        color: color,
        backgroundColor,
        textDecoration,
      };
      const span: React.ReactElement = (
        <span key={index} style={style}>
          {part.value}
        </span>
      );
      result.push(span);
    });

    return result;
  };

  useEffect(() => {
    setImproved(compareSentences(originals, corrected));
  }, [corrected]);

  return (
    <div>
      <button className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md" onClick={() => toPDF()}>
        PDF
      </button>
      <div className="flex justify-center content-center items-center h-full flex-col w-full " ref={targetRef}>
        <div className="w-11/12 ">
          <div className="text-3xl leading-8 h-2 p-10">
            {improved.length > 0 ? (
              improved.map((element: React.ReactElement, index: number) => (
                <React.Fragment  key={index}>{element}</React.Fragment>
              ))
            ) : (
              <div className="p-2">
                <p>your corrected data will be here </p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PDF;
