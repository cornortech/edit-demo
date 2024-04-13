import React, { ReactElement, useEffect, useState } from "react";
import { diffChars, Change } from "diff";

const Page = ({
  originals,
  corrected,
  updateContent,
}: {
  originals: string;
  corrected: string;
  updateContent: (comparedData: string) => void;
}): ReactElement => {
  const [improved, setImproved] = useState<ReactElement[]>([]);

  const compareSentences = (
    original: string,
    corrected: string
  ): ReactElement[] => {
    const diff: Change[] = diffChars(original, corrected);
    const result: ReactElement[] = [];

    diff.forEach((part: Change, index: number) => {
      const color: string = part.added ? "green" : part.removed ? "red" : "grey";
      const backgroundColor = part.added ? "#51d80e6d" : part.removed ? "#f0232366" : "";
      const textDecoration = part.added ? "underline" : part.removed ? "line-through" : "";

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
    setImproved(compareSentences(originals, corrected));
  }, [corrected]);

  const handleUpdateContent = () => {
    const comparedData = corrected;
    updateContent(comparedData);
  };

  return (
    <div>
      {improved.length > 0 ? (
        improved.map((element: ReactElement, index: number) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))
      ) : (
        <div className="p-2">
          <p>Your corrected data will be here.</p>
        </div>
      )}
      <button onClick={handleUpdateContent}>Update Tiptap Editor</button>
    </div>
  );
};

export default Page;
