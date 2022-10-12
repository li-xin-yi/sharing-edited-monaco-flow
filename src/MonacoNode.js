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
                        styles.append(`.yRemoteSelectionHead-${clientID}:hover::after { content: "${user.name}"; background-color: ${user.color}; box-shadow: 0 0 0 4px ${user.color}; border: 2px solid ${user.color}; 
                        opacity: 1; }`);
                    }
                }
            });
            document.head.append(styles);
        });
    }





    return (<>
        <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
        <div>
            <label htmlFor="text">Code:</label>
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
