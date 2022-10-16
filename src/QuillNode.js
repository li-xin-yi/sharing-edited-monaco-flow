import { Handle, Position } from 'reactflow';
import 'react-quill/dist/quill.snow.css';
import React,{useEffect} from 'react';
import ReactQuill,{Quill} from 'react-quill';
import {ydoc, provider} from './ydoc';
import { QuillBinding } from 'y-quill'
import QuillCursors from 'quill-cursors';


const dragHandleStyle = {
    display: 'inline-block',
    width: 18,
    height: 18,
    backgroundColor: 'teal',
    // marginLeft: 100,
    borderRadius: '50%',
    float: 'right',
};

Quill.register('modules/cursors', QuillCursors);

function QuillNode ({ data }) {

    let quillRef = null;
    let reactQuillRef = null;

    const attachQuillRefs = () => {
        if(typeof reactQuillRef.getEditor !== 'function') return;
        quillRef = reactQuillRef.getEditor();
    }

    useEffect(() => {
        attachQuillRefs();
        const ytext = ydoc.getText('quillx'+data.id);
        console.log(quillRef, ytext);
        const quillBinding = new QuillBinding(ytext, quillRef, provider.awareness);
        console.log(quillBinding);
    }, []);

    const modulesRef = {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
          ],
          ["link", "image"],
          ["clean"]
        ],
        cursors: true
      };

    return (
        <>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div className='quill-container' style={{ width: 500 }}>
            <label style={{ fontFamily: 'Segoe UI'}}
            >Text: 
             </label>
            <span className="quill-drag-handle" style={dragHandleStyle}></span>
            <ReactQuill theme="snow" ref={  (el) => { reactQuillRef = el } } modules={modulesRef} style={{backgroundColor:'#fff'}} />
            </div> 
            <Handle type="source" position={Position.Bottom} style={{ bottom: 0, background: '#555'}} />
        </>)
}

export default QuillNode;