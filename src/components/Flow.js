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
import useNodesStateSynced, { nodesMap } from '../utils/useNodesStateSynced';
import useEdgesStateSynced, { edgesMap } from '../utils/useEdgesStateSynced';
import { nodes as initialNodes, edges as initialEdges } from '../utils/initialElements';
import { provider } from '../utils/ydoc';
import PaneContextMenu from './PaneContextMenu';
import { useStore } from '../utils/store';


export const Flow = (props) => {
  const nodeTypes = useMemo(() => ({ monacoNode: MonacoNode, quillNode: QuillNode }), []);
  provider.awareness.setLocalStateField('user', { name: props.user, color: props.color });
  const [nodes, onNodesChange] = useNodesStateSynced(initialNodes);
  const [edges, onEdgesChange, onConnect] = useEdgesStateSynced(initialEdges);
  const [show, setShow] = useState(props.show);
  const wrapperRef = React.useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [points, setPoints] = useState({x:0, y:0})
  const [client, setClient] = useState({x:0, y:0})
  const setSelectNode = useStore(state => state.setSelectNode);
  // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const InitHandler = (e) => {
    setReactFlowInstance(e);
    // nodesMap.clear();
    if (nodesMap.size === 0) {
      nodes.forEach((node) => {
        if (!nodesMap.has(node.id)) {
          nodesMap.set(node.id, node);
        }
      }
      );
    }
    // edgesMap.clear();
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
    setSelectNode(null);
    setShow(true);
    setPoints({ x: event.pageX, y: event.pageY });
    setClient({ x: event.clientX, y: event.clientY });
  };

  const onNodeDragStart = useCallback((_, node) => {
    // console.log('dragging', node.id);
    const currentNode = nodesMap.get(node.id);
    if (currentNode) {
      nodesMap.set(node.id, {
        ...currentNode,
        style: {...currentNode.style, backgroundColor: props.color, opacity: 0.3},
      });
    }

  });

  const onPaneClick = useCallback((event) => {
    setSelectNode(null);
  });

  const onNodeDragStop = useCallback((_, node) => {
    // console.log('dragging stopped', node.id);
    const currentNode = nodesMap.get(node.id);
    if (currentNode) {
      nodesMap.set(node.id, {
        ...currentNode,
        style: {...currentNode.style, backgroundColor: '#eee', opacity: 1},
      });
    }
  });

  useEffect(() => {
    const handleClick = () => {
      setShow(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);


  const addMonacoNode = () => {
    if(wrapperRef.current){}
      const rect = wrapperRef.current.getBoundingClientRect();
      const position = reactFlowInstance.project({ x: client.x - rect.left, y: client.y - rect.top });
      const id = `monacoNode-${Math.random()}`;
      const newNode = {
        id,
        type: 'monacoNode',
        position,
        data: { id,  label:'Code'},
        dragHandle: '.monaco-drag-handle',
        style: { 
          width:400,
          height:200,
        }
    }
    nodesMap.set(newNode.id, newNode);
  };

  const addQuillNode = () => {
    if(wrapperRef.current){}
      const rect = wrapperRef.current.getBoundingClientRect();
      const position = reactFlowInstance.project({ x: client.x - rect.left, y: client.y - rect.top});
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
        onPaneClick={onPaneClick}

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
        <PaneContextMenu top={points.y} left={points.x}
          addMonacoNode={addMonacoNode}
          addQuillNode={addQuillNode}
        >
        </PaneContextMenu>}
    </div>
    );
};

export default Flow;
