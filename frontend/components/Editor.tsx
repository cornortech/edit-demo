import React, { useCallback, useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import * as Icons from "./Icons";
import { diffChars, Change } from "diff";
// import PDF from "./PDF"
import "../app/globals.css";
import usePdfStore from "@/app/store/usePdf";
import { usePDF } from "react-to-pdf";
const Page = ({
  inputText,
  corrected,
}: {
  inputText: string;
  corrected: string;
}) => {
  const [improved, setImproved] = useState<React.ReactNode[]>([]);

  const compareSentences = (
    original: string,
    corrected: string
  ): React.ReactNode[] => {

    original = original.replace(/<\/?p>/g, "");
    corrected = corrected.replace(/<\/?p>/g, "");
    console.log(original,corrected)

    const diff: Change[] = diffChars(original, corrected);
    const result: React.ReactNode[] = [];

    diff.forEach((part: Change, index: number) => {
      let style: React.CSSProperties = {};
      if (part.added) {
        style = {
          color: "green",
          backgroundColor: "lightgreen",
          textDecoration: "none",
        };
      } else if (part.removed) {
        style = {
          color: "red",
          backgroundColor: "lightcoral",
          textDecoration: "line-through",
        };
      } else {
        style = {
          color: "black",
          backgroundColor: "transparent",
          textDecoration: "none",
        };
      }
      result.push(
        <span key={index} style={style}>
          {part.value}
        </span>
      );
    });

    return result;
  };

  useEffect(() => {
    setImproved(compareSentences(inputText, corrected));
  }, [inputText, corrected]);

  return <div className="mt-4">{improved}</div>;
};

export function SimpleEditor() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(""); // State to hold input text
  const [correctedText, setCorrectedText] = useState("");
  const [copied, setCopied] = useState(false); // State to track if text is copied
  const [improved, setImproved] = useState<React.ReactNode[]>([]);
  const [final, setFinal] = useState("");
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const setStoredFunction = usePdfStore((state) => state.setPdfExportFunction);
  const [isCheckingGrammer, setIsCheckingGrammer] = useState(false);

  useEffect(() => {
    setStoredFunction(toPDF);
  }, []);

  const getCorrectedContent = (original: string, corrected: string) => {
    original = original.replace(/<\/?p>/g, '');
    const diff: Change[] = diffChars(original, corrected);
    let text = "";
    diff.forEach((node) => {
      if (node.added) {
        console.log("added");
        text += `<u>${node.value}</u>`;
      } else if (node.removed) {
        console.log("removed");
        text += `<del>${node.value}</del>`;
      } else {
        text += node.value;
      }
    });

    let stringWithoutPTags = text.replace(/<p><\/p>/g, "");



    return stringWithoutPTags;
  };

  const compareSentences = (
    original: string,
    corrected: string
  ): React.ReactNode[] => {
    original = original.replace(/<\/?p>/g, "");
    corrected = corrected.replace(/<\/?p>/g, "");
    console.log(original, corrected);

    const diff: Change[] = diffChars(original, corrected);
    
    //  corrected = corrected.replace(/<\/?p>/g, "");


    const result: React.ReactNode[] = [];

    diff.forEach((part: Change, index: number) => {
      let style: React.CSSProperties = {};

      if (part.added) {
        style = {
          color: "green",
          backgroundColor: "lightgreen",
          textDecoration: "underline",
          height: "40px",
        };
      } else if (part.removed) {
        style = {
          color: "red",
          backgroundColor: "lightcoral",
          //  textDecoration: "line-through",
          height: "40px",
        };
      } else {
        style = {
          color: "black",
          backgroundColor: "transparent",
          textDecoration: "none",
          height: "40px",
        };
      }

      result.push(
        <div key={index} style={style}>
          {part.value}
        </div>
      );
    });

    return result;
  };

  useEffect(() => {
    handleUpdate();
  }, [correctedText]);

  useEffect(() => {
    setImproved(compareSentences(inputText, correctedText));
  }, [inputText, correctedText]);

  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
    ],
    content: "Write your story here",
  }) as Editor;

  const handleExport = () => {
    toPDF();
  };

  const handleGrammerCheck = async () => {
    try {
      if (isCheckingGrammer) {
        alert("please accept or reject the current gpt solution ");
        return;
      }
      const currentContent = editor.getHTML();
      const { data, status } = await axios.post(
        "http://localhost:8000/ask-ai",
        { prompt: currentContent }
      );

      if (status === 200) {
        setInputText(currentContent); // Set input text
        setCorrectedText(data.message); // Set corrected text
        setIsOpen(true);
        setCopied(false); // Reset copied state
        setIsCheckingGrammer(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleAcceptAll = () => {
    if (editor) {
      editor.commands.setContent(`${correctedText}`);
    }
    setIsCheckingGrammer(false);
  };
  const handleReject = () => {
    if (editor) {
      editor.commands.setContent(`${inputText}`);
    }
    setIsCheckingGrammer(false);
  };

  const handleUpdate = () => {
    if (editor) {
      editor.commands.setContent(
        `${getCorrectedContent(inputText, correctedText)}`
      );
    }
    // setIsOpen(false);
  };

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const handleCopy = () => {
    navigator.clipboard.writeText(correctedText); // Copy corrected text to clipboard
    setCopied(true); // Set copied state to true
  };
  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="editor bg-white p-4 rounded shadow-md w-full">
        <div className="menu flex justify-center items-center gap-5 mb-4 flex-col">
          <div className="flex gap-3 ">
            <button
              className="menu-button mr-2 w-5 h-5 "
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Icons.RotateLeft />
            </button>
            <button
              className="menu-button mr-2"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Icons.RotateRight />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("bold"),
              })}
              onClick={toggleBold}
            >
              <Icons.Bold />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("underline"),
              })}
              onClick={toggleUnderline}
            >
              <Icons.Underline />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("italic"),
              })}
              onClick={toggleItalic}
            >
              <Icons.Italic />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("strike"),
              })}
              onClick={toggleStrike}
            >
              <Icons.Strikethrough />
            </button>
            <button
              className={classNames("menu-button mr-2", {
                "is-active": editor.isActive("code"),
              })}
              onClick={toggleCode}
            >
              <Icons.Code />
            </button>
            <button
              className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
              onClick={handleGrammerCheck}
              disabled={isCheckingGrammer}
            >
              Grammar
            </button>
            {isCheckingGrammer && (
              <>
                <button
                  className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </button>
                <button
                  className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
                  onClick={handleReject}
                >
                  Reject All
                </button>
              </>
            )}

            <button
              className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
              onClick={handleCopy}
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
              onClick={handleExport}
            >
              Export pdf
            </button>
          </div>
        </div>

        <EditorContent editor={editor} />
      </div>

      <div
        className="flex items-center   h-[100vh] flex-col w-full  "
        ref={targetRef}
      >
        <div className="w-11/12 p-6">
          <div className="text  text-[17px]">
            {isCheckingGrammer ? (
              improved.length > 0 ? (
                improved.map((element) => <>{element}</>)
              ) : (
                <div className="p-2">
                  <p>your corrected data will be here </p>
                </div>
              )
            ) : (
              correctedText
            )}
          </div>
        </div>
      </div>
    </>
  );
}
