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
import {usePDF}  from 'react-to-pdf';

const Page: React.FC<{ inputText: string; corrected: string; }> = ({ inputText, corrected }) => {
  const [improved, setImproved] = useState<React.ReactNode[]>([]);

  const compareSentences = (original: string, corrected: string): React.ReactNode[] => {
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

export const SimpleEditor: React.FC = () => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>(""); // State to hold input text
  const [correctedText, setCorrectedText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false); // State to track if text is copied
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
    content: "<p>Your initial content here</p>",
  }) as Editor;

  const handleGrammarCheck = async () => {
    try {
      const currentContent: string = editor.getHTML();
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
    editor.commands.setContent(correctedText);
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

  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  if (!editor) {
    return null;
  }
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
          onClick={handleGrammarCheck}
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
        <button
          className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
          onClick={() => toPDF()}
        >
          PDF
        </button>
      </div>
      <div ref={targetRef}>
        <EditorContent editor={editor} />
      </div>
      {modalIsOpen && (
        <Page inputText={inputText} corrected={correctedText} />
      )}
    </div>
  );
};
