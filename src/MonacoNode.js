import { Handle, Position } from 'reactflow';
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import MonacoEditor from 'react-monaco-editor';


const seen = {};




function MonacoNode({ data }) {

    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('monaco')
    const provider = new WebsocketProvider('ws://localhost:1234', data.id, ydoc)
    const awareness = provider.awareness


    function editorDidMount(editor, monaco) {

        const monacoBinding = new MonacoBinding(ytext, /** @type {monaco.editor.ITextModel} */(editor.getModel()), new Set([editor]), awareness)
        provider.connect();
        awareness.setLocalStateField('user', { name: data.user, color: data.color })

        // console.log(data.user, "add", awareness.clientID)
        awareness.on("update", (change) => {
            const states = awareness.getStates();
            const styles = document.createElement("style");
            change.added.forEach((clientID) => {
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
                        styles.append(`.yRemoteSelectionHead-${clientID}:hover::after { content: "${user.name}"; background-color: ${user.color}; box-shadow: 0 0 0 4px ${user.color}; opacity: 1; }`);
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
                language="javascript"
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
