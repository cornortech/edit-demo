"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";

const Tiptap = ({
  onChange,
  content,
  handleGrammerCheck,
  handleExportPdf,
}: any) => {
  const handleChange = (newContent: string) => {
    const filtered_data = removePTagsAndWhitespace(newContent);
    onChange(filtered_data);
  };
  function removePTagsAndWhitespace(inputString: string) {
    // Remove both opening and closing <p> tags
    let stringWithoutPTags = inputString.replace(/<\/?p[^>]*>/g, "");

    // Remove extra whitespace
    let stringWithoutWhitespace = stringWithoutPTags
      .replace(/\s+/g, " ")
      .trim();

    return stringWithoutWhitespace;
  }

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-400 text-gray-700 items-start w-full gap-3 font-medium text-[14px] pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });



    console.log(" this prompt",editor)

    
  return (
    <div className="w-full px-4">
      <Toolbar
        editor={editor}
        content={content}
        handleExportPdf={handleExportPdf}
        handleGrammerCheck={handleGrammerCheck}
      />
      <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
};

export default Tiptap;
