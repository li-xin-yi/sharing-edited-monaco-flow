import { Handle, Position } from 'reactflow';
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

const seen = {};

function MonacoNode({ data }) {

    const ytext = ydoc.getText('monaco' + data.id)
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
    }

    const onDeleteHandle = () => {
        console.log('delete');
        nodesMap.delete(data.id);
    }


    return (<>
        <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
        <div style={{ padding: "10px" }}>
            <label style={{ fontFamily: 'Segoe UI' }}
            >Code:
                <span className="monaco-close-handle" style={closeHandleStyle} onClick={onDeleteHandle}></span>
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
