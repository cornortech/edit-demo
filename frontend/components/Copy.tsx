import React, { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

type Props = {
  corrected: string;
};

const Copy = (props: Props) => {
  const { corrected } = props;
  const [copied, setCopied] = useState(false);
 

  useEffect(() => {
    setCopied(false);
  }, [corrected]);

  return (
    <CopyToClipboard text={corrected} onCopy={() => setCopied(true)}>
      <button className="btn btn-primary">{copied ? "Copied" : "Copy"}</button>
    </CopyToClipboard>
  );
};

export default Copy;
