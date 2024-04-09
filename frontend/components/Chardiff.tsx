import React, { ReactElement } from "react";
import { diffChars, Change } from "diff";

const Page = (): ReactElement => {
  const originals: string = "Two Dogs and the theives who steals Lives. ";
  const correcteds: string = "Two Dogs and the Life-Stealing-Thief";

  const compareSentences = (original: string, corrected: string): ReactElement[] => {
    const diff: Change[] = diffChars(original, corrected);
    const result: ReactElement[] = [];

    diff.forEach((part: Change, index: number) => {
      // Green for additions, red for deletions, grey for common parts
      const color: string = part.added ? "green" : part.removed ? "red" : "grey";
      const style: React.CSSProperties = { color: color };
      const span: ReactElement = <span key={index} style={style}>{part.value}</span>;
      result.push(span);
    });

    return result;
  };

  const result: ReactElement[] = compareSentences(originals, correcteds);
  console.log(result);

  return <div>{result.map((element: ReactElement, index: number) => <React.Fragment key={index}>{element}</React.Fragment>)}</div>;
};

export default Page;
