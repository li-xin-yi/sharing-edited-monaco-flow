import { Handle, Position } from 'reactflow';
import { MonacoBinding } from 'y-monaco'
import {ydoc, provider} from './ydoc';
import MonacoEditor from 'react-monaco-editor';


const seen = {};




function MonacoNode({ data }) {

    const ytext = ydoc.getText('monaco'+data.id)
    const awareness = provider.awareness


    function editorDidMount(editor, monaco) {

        const monacoBinding = new MonacoBinding(ytext, /** @type {monaco.editor.ITextModel} */(editor.getModel()), new Set([editor]), awareness)

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
                        styles.append(`.yRemoteSelection-${clientID} { background-color: ${user.color}; opacity: 0.5; }`);
                        styles.append(`.yRemoteSelectionHead-${clientID} {  position: absolute;
                        border-left: ${user.color} solid 2px;
                        border-top: ${user.color} solid 2px;
                        border-bottom: ${user.color} solid 2px;
                        height: 100%;
                        box-sizing: border-box;}`);
                        styles.append(`.yRemoteSelectionHead-${clientID}:hover::after { content: "${user.name}"; background-color: ${user.color}; box-shadow: 0 0 0 2px ${user.color}; border: 1px solid ${user.color};
                        opacity: 1; }`);
                    }
                }
            });
            if(styles.innerHTML.length > 0) {
            document.head.append(styles);
            }
        });
    }

    const dragHandleStyle = {
        display: 'inline-block',
        width: 18,
        height: 18,
        backgroundColor: 'teal',
        // marginLeft: 100,
        borderRadius: '50%',
        float: 'right',
      };


    return (<>
        <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
        <div style={{padding:"10px"}}>
            <label style={{ fontFamily: 'Segoe UI'}}
            >Code: 
            <span className="monaco-drag-handle" style={dragHandleStyle}></span>
            </label>
            <MonacoEditor
                width="400"
                height="200"
                language="python"
                theme="vs-light"
                options={{
                    selectOnLineNumbers: true,
                    minimap: { enabled: false },
                }}
                editorDidMount={editorDidMount} />
        </div>
        <Handle type="source" position={Position.Bottom} />
    </>)

}

export default MonacoNode;
