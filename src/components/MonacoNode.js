import { Handle, Position, useReactFlow } from 'reactflow';
import { MonacoBinding } from 'y-monaco'
import MonacoEditor from 'react-monaco-editor';
import { nodesMap } from '../utils/useNodesStateSynced';
import {
    dragHandleStyle,
    closeHandleStyle,
} from '../utils/styles';
import { makeMoveable, Resizable} from 'react-moveable';
import { useRef, useEffect} from 'react';
import { useStore, ydoc, provider } from '../utils/store';

const Moveable = makeMoveable([Resizable]);

function MonacoNode({id}) {

    const ytext = ydoc.getText('monaco' + id)
    const awareness = provider.awareness
    const nodeRef = useRef(null);
    const resizeRef = useRef(null);
    const selected = useStore(state => state.selectNode);
    const lineNumbers = useStore(state => state.lineNumbers);

    useEffect(() => {
        nodeRef.current = document.querySelector(`.react-flow__node[data-id="${id}"]`);
        console.log(nodeRef);
      }, [id]);
    


    function editorDidMount(editor, monaco) {

        const monacoBinding = new MonacoBinding(ytext, /** @type {monaco.editor.ITextModel} */(editor.getModel()), new Set([editor]), awareness);
        // editor.layout({});
    }

    const onDeleteHandle = () => {
        console.log('delete');
        nodesMap.delete(id);
    }

    const onResize = (event) => {
        console.log('resize', event);
        if(!nodeRef.current) {return;}

        const cur = nodesMap.get(id);
        const style = {...cur?.style};
        if(event.delta[0] !== 0){
            nodeRef.current.style.width = `${event.width}px`
            style.width = event.width;
        }
        if(event.delta[1] !== 0){
            nodeRef.current.style.height = `${event.height}px`
            style.height = event.height;
        }
        nodesMap.set(id, {...cur, style: style});

        console.log(nodesMap.get(id))


    }


    return (<>
    <Moveable resizable={(selected===id)} onResize={onResize} target={resizeRef} throttleResize={10} hideDefaultLines={(selected!==id)}/>
    <div ref={resizeRef} style={{height:'100%'}}>
        <Handle type="target" position={Position.Top}/>
        <div style={{ padding: "10px", height:'100%'}}>
            <label style={{ fontFamily: 'Segoe UI' }}
            >Code:
                <span className="monaco-close-handle" style={closeHandleStyle} onClick={onDeleteHandle}></span>
                <span className="monaco-drag-handle" style={dragHandleStyle}></span>

            </label>
            <MonacoEditor
                language="python"
                theme="vs-light"
                options={{
                    selectOnLineNumbers: true,
                    lineNumbers: lineNumbers,
                    minimap: { enabled: false },
                    automaticLayout: true,
                }}
                editorDidMount={editorDidMount}
                 />
        </div>
        <Handle type="source" position={Position.Bottom} />
    </div>
    
    </>)

}

export default MonacoNode;
