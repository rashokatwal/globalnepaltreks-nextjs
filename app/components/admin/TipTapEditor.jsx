'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faHeading,
  faSuperscript,
  faSubscript,
  faTable,
  faLink,
  faImage,
  faUndo,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const MenuBar = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  if (!editor) return null;

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const Button = ({ onClick, isActive, icon, title }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded transition ${
        isActive ? 'bg-accent-color text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={title}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-gray-300 rounded-t-lg bg-gray-50 sticky top-0 z-10">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={faBold} title="Bold (Ctrl+B)" />
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={faItalic} title="Italic (Ctrl+I)" />
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={faUnderline} title="Underline (Ctrl+U)" />
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={faStrikethrough} title="Strikethrough" />
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={faHeading} title="Heading 2" />
      <Button onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} icon={faSuperscript} title="Superscript (x²)" />
      <Button onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} icon={faSubscript} title="Subscript (x₂)" />
      <Button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} icon={faTable} title="Insert Table" />

      {/* Link button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          title="Add Link"
        >
          <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
        </button>
        {showLinkInput && (
          <div className="absolute top-10 left-0 bg-white border rounded shadow p-2 z-20 flex gap-2">
            <input
              type="text"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="px-2 py-1 border rounded text-sm w-48"
            />
            <button onClick={addLink} className="px-2 py-1 bg-accent-color text-white rounded text-sm">Add</button>
          </div>
        )}
      </div>

      {/* Image button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          title="Add Image"
        >
          <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
        </button>
        {showImageInput && (
          <div className="absolute top-10 left-0 bg-white border rounded shadow p-2 z-20 flex gap-2">
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="px-2 py-1 border rounded text-sm w-48"
            />
            <button onClick={addImage} className="px-2 py-1 bg-accent-color text-white rounded text-sm">Add</button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button onClick={() => editor.chain().focus().undo().run()} icon={faUndo} title="Undo (Ctrl+Z)" />
      <Button onClick={() => editor.chain().focus().redo().run()} icon={faRedo} title="Redo (Ctrl+Y)" />
    </div>
  );
};

export default function TipTapEditor({ value, onChange, placeholder = 'Write something...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}