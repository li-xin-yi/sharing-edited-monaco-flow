import { Handle, Position } from 'reactflow';
import 'react-quill/dist/quill.snow.css';
import React,{useEffect} from 'react';
import ReactQuill,{Quill} from 'react-quill';
import { useStore, ydoc, provider } from '../utils/store';
import { QuillBinding } from 'y-quill'
import QuillCursors from 'quill-cursors';
import { nodesMap } from '../utils/useNodesStateSynced';
import {dragHandleStyle, closeHandleStyle} from '../utils/styles';

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
        // console.log(quillRef, ytext);
        const quillBinding = new QuillBinding(ytext, quillRef, provider.awareness);
        // console.log(quillBinding);
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

    const onDeleteHandle = () => {
        console.log('delete');
        nodesMap.delete(data.id);
    }

    return (
        <>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div className='quill-container' style={{ width: 500 }}>
            <label style={{ fontFamily: 'Segoe UI'}}
            >Text: 
             </label>

             <span className="quill-close-handle" style={closeHandleStyle} onClick={onDeleteHandle}></span>
             
            <span className="quill-drag-handle" style={dragHandleStyle}></span>

            <ReactQuill theme="snow" ref={  (el) => { reactQuillRef = el } } modules={modulesRef} style={{backgroundColor:'#fff'}} />
            </div> 
            <Handle type="source" position={Position.Bottom} style={{ bottom: 0, background: '#555'}} />
        </>)
}

export default QuillNode;