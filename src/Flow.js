import React, { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MonacoNode from './MonacoNode';
import QuillNode from './QuillNode';
import useNodesStateSynced, { nodesMap } from './useNodesStateSynced';
import useEdgesStateSynced, { edgesMap } from './useEdgesStateSynced';
import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import { provider } from './ydoc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faComment } from '@fortawesome/free-solid-svg-icons';

// const onDragOver = (event) => {
//   event.preventDefault();
//   event.dataTransfer.dropEffect = 'move';
//   console.log('dragging');
// };

const Flow = (props) => {
  const nodeTypes = useMemo(() => ({ monacoNode: MonacoNode, quillNode: QuillNode }), []);
  provider.awareness.setLocalStateField('user', { name: props.user, color: props.color });
  const [nodes, onNodesChange] = useNodesStateSynced(initialNodes);
  const [edges, onEdgesChange, onConnect] = useEdgesStateSynced(initialEdges);
  const [show, setShow] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [client, setClient] = useState({ x: 0, y: 0 });
  const wrapperRef = React.useRef(null);
  // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const InitHandler = () => {
    nodesMap.clear();
    if (nodesMap.size === 0) {
      nodes.forEach((node) => {
        if (!nodesMap.has(node.id)) {
          nodesMap.set(node.id, node);
        }
      }
      );
    }
    edgesMap.clear();
    if (edgesMap.size === 0) {
      edges.forEach((edge) => {
        if (!edgesMap.has(edge.id)) {
          edgesMap.set(edge.id, edge);
        }
      }
      );
    }
  };

  const onPaneContextMenu = (event) => {
    event.preventDefault();
    console.log('right click')
    setShow(true);
    console.log(show);
    setPoints({ x: event.pageX, y: event.pageY });
    setClient({ x: event.clientX, y: event.clientY });
    return <PaneContextMenu />;
  };
  const onNodeDragStart = useCallback((_, node) => {
    // console.log('dragging', node.id);
    const currentNode = nodesMap.get(node.id);
    if (currentNode) {
      nodesMap.set(node.id, {
        ...currentNode,
        style: { backgroundColor: props.color, opacity: 0.3 },
      });
    }

  });

  const onNodeDragStop = useCallback((_, node) => {
    // console.log('dragging stopped', node.id);
    const currentNode = nodesMap.get(node.id);
    if (currentNode) {
      nodesMap.set(node.id, {
        ...currentNode,
        style: { backgroundColor: '#eee', opacity: 1 },
      });
    }
  });

  useEffect(() => {
    const handleClick = () => setShow(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const PaneContextMenu = (props) => {
    return (
      <div
        className='pane-context-menu'
        style={{
          left: `${points.x}px`,
          top: `${points.y}px`,
          zIndex: 100,
          position: 'absolute',
          boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.1)',
          width: '200px',
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxSizing: 'border-box',
        }}>
          <div style={{padding: '10px 5px 10px 5px', fontFamily: "sans-serif",borderBottomColor:'f555' } } onClick={addMonacoNode}>
            <FontAwesomeIcon icon={faCode}/> 
            <span>  New Code Editor</span>
          </div>
          <div style={{padding: '10px 5px 10px 5px', fontFamily: "sans-serif", borderRadius: '5px 5px 0 0', borderBottomColor:'f555' }} onClick={addQuillNode}>
          <FontAwesomeIcon icon={faComment} />
            <span>  New Text Editor</span>
          </div>
        </div>
    );
  }

  const addMonacoNode = () => {
    if(wrapperRef.current){}
      const rect = wrapperRef.current.getBoundingClientRect();
      const position = { x: client.x - rect.left - 80, y: client.y - rect.top - 20 };
      const id = `monacoNode-${Math.random()}`;
      const newNode = {
        id,
        type: 'monacoNode',
        position,
        data: { id,  label:'Code'},
        dragHandle: '.monaco-drag-handle'
    }
    nodesMap.set(newNode.id, newNode);
  };

  const addQuillNode = () => {
    if(wrapperRef.current){}
      const rect = wrapperRef.current.getBoundingClientRect();
      const position = { x: client.x - rect.left - 80, y: client.y - rect.top - 20 };
      const id = `quillNode-${Math.random()}`;
      const newNode = {
        id,
        type: 'quillNode',
        position,
        data: { id,  label:'Text'},
        dragHandle: '.quill-drag-handle'
    }
    nodesMap.set(newNode.id, newNode);
  }


  return (
    <div className='flowContainer' ref={wrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={InitHandler}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        zoomOnDoubleClick={false}
        onPaneContextMenu={onPaneContextMenu}

        fitView
        attributionPosition="top-right"
      >
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            if (n.type === 'input') return '#0041d0';
            if (n.type === 'output') return '#ff0072';
            if (n.type === 'default') return '#1a192b';

            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;

            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      {show &&
        <PaneContextMenu top={points.x} left={points.y}
        >
        </PaneContextMenu>}
    </div>
    );
};

export default Flow;
