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
import { Del, Ins } from "@/app/extension/Extension";
// import PDF from "./PDF"
import "../app/globals.css";
import Toolbar from "./Toolbar";
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

  const getCorrectedContent = (original:string, corrected:string) => {
    const diff: Change[] = diffChars(original, corrected);
    let text = ""
    diff.forEach(node => {
      if (node.added) {
        console.log("added")
        text+=`<u>${node.value}</u>`
      } else if (node.removed) {
        console.log("removed");
        text += `<del>${node.value}</del>`;
      } else {
        text+=node.value
      }
    })
    console.log(text)
    return text;
  }

  const compareSentences = (
    original: string,
    corrected: string
  ): React.ReactNode[] => {
    const diff: Change[] = diffChars(original, corrected);

    console.log("the diff", diff);

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

      if (part.added) {
        return result.push(
          <ins key={index} style={style}>
            {part.value}
          </ins>
        );
      } else if (part.removed) {
        return result.push(
          <del key={index} style={style}>
            {part.value}
          </del>
        );
      } else {
        result.push(
          <span key={index} style={style}>
            {part.value}
          </span>
        );
      }
    });

    return result;
  };

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
    content:
      " <p> <del>hello how are you </del><u>i am inserted here </u> </p>",
  }) as Editor;

  const handleGrammerCheck = async () => {
    try {
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
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdate = () => {
    editor.commands.setContent(getCorrectedContent(inputText,correctedText));
    setIsOpen(false);
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

  console.log(improved);
  return (
    <div className="editor bg-white p-4 rounded shadow-md">
      <div className="menu flex justify-center items-center gap-5 mb-4">
        <div className="flex">
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
        </div>
        <button
          className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
          onClick={handleGrammerCheck}
        >
          Grammar
        </button>
        <button
          className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
        {modalIsOpen && (
          <button
            className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
            onClick={handleUpdate}
          >
            Update
          </button>
        )}
      </div>

      {/* <Toolbar content={ correctedText} editor={editor} handleExportPdf={hand } /> */}
      
      <EditorContent editor={editor} />

      {modalIsOpen && <Page inputText={inputText} corrected={correctedText} />}
    </div>
  );
}
