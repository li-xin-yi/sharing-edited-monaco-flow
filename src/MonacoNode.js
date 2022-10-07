import { Handle, Position } from 'reactflow';
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import MonacoEditor from  'react-monaco-editor';

const StyleElement = document.createElement("style");


function MonacoNode({data}) {

    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('monaco')
    const provider = new WebsocketProvider('wss://demos.yjs.dev', data.id, ydoc)
    const awareness = provider.awareness


    function editorDidMount(editor, monaco) {

        const monacoBinding = new MonacoBinding(ytext, /** @type {monaco.editor.ITextModel} */ (editor.getModel()), new Set([editor]), awareness)
        provider.connect();
        //TODO: it doesn't work at all
        awareness.setLocalStateField('user', { name: data.user, color: data.color })
        
    }

    
    return(<>
    <Handle type="target" position={Position.Top}  style={{ background: '#555' }} />
    <div>
        <label htmlFor="text">Code:</label>
        <MonacoEditor
            width="400"
            height="200"
            language="javascript"
            theme="vs-light"
            options={{selectOnLineNumbers: true,
            minimap: {enabled: false},}}
            editorDidMount={editorDidMount}/>
    </div>
    <Handle type="source" position={Position.Bottom} />
    </>)
    
}

export default MonacoNode;
