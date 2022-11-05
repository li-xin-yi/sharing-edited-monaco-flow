import { Handle, Position, useReactFlow } from 'reactflow';
import { MonacoBinding } from 'y-monaco'
import { ydoc, provider } from '../utils/ydoc';
import MonacoEditor from 'react-monaco-editor';
import { nodesMap } from '../utils/useNodesStateSynced';
import {
    dragHandleStyle,
    closeHandleStyle,
    yRemoteSelectionStyle,
    yRemoteSelectionHeadStyle,
    yRemoteSelectionHeadHoverStyle,
} from '../utils/styles';
import { makeMoveable, ResizableProps,Draggable, Resizable, OnResize} from 'react-moveable';
import { useRef, useEffect} from 'react';
import { useStore } from '../utils/store';

const Moveable = makeMoveable([Resizable]);

const seen = {};

function MonacoNode({id, data}) {

    const ytext = ydoc.getText('monaco' + data.id)
    const awareness = provider.awareness
    const nodeRef = useRef(null);
    const resizeRef = useRef(null);
    const selected = useStore(state => state.selectNode);

    useEffect(() => {
        nodeRef.current = document.querySelector(`.react-flow__node[data-id="${data.id}"]`);
        console.log(nodeRef);
      }, [data.id]);
    


    function editorDidMount(editor, monaco) {

        const monacoBinding = new MonacoBinding(ytext, /** @type {monaco.editor.ITextModel} */(editor.getModel()), new Set([editor]), awareness)

        // window.addEventListener('resize', handleResize);

        awareness.on("update", (change) => {
            const states = awareness.getStates();
            // console.log(change);
            const styles = document.createElement("style");
            const nodes = change.added.concat(change.updated);
            nodes.forEach((clientID) => {
                if (states.get(clientID).hasOwnProperty('user')) {
                    const user = states.get(clientID).user
                    if (!seen.hasOwnProperty(clientID)) {
                        seen[clientID] = true;
                        styles.append(yRemoteSelectionStyle(clientID, user.color));
                        styles.append(yRemoteSelectionHeadStyle(clientID, user.color));
                        styles.append(yRemoteSelectionHeadHoverStyle(clientID, user.color, user.name));
                    }
                }
            });
            if (styles.innerHTML.length > 0) {
                document.head.append(styles);
            }
            
        });

        // editor.layout({});
    }

    const onDeleteHandle = () => {
        console.log('delete');
        nodesMap.delete(data.id);
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

    const handleResize = () => this.editor.layout();


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
