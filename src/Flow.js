import React, { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MonacoNode from './MonacoNode';
import QuillNode from './QuillNode';
import useNodesStateSynced, { nodesMap } from './useNodesStateSynced';
import { getNodes, edges as initialEdges } from './initial-elements';
import {provider } from './ydoc';

// const onDragOver = (event) => {
//   event.preventDefault();
//   event.dataTransfer.dropEffect = 'move';
//   console.log('dragging');
// };


const Flow = (props) => {
  const nodeTypes = useMemo(() => ({ monacoNode: MonacoNode, quillNode:QuillNode}), []);
  provider.awareness.setLocalStateField('user', { name: props.user, color: props.color });
  const initialNodes = getNodes();
  const [nodes, onNodesChange] = useNodesStateSynced(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const InitHandler = () => {
    if (nodesMap.size === 0) {
      nodes.forEach((node) => {
        if (!nodesMap.has(node.id)) {
          nodesMap.set(node.id, node);
        }
      }
      );
    }
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

  return (
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
      onPaneClick={(event) => {
        console.log('pane clicked', event);
      }
      }
        
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
      {/* <Controls onDoubleClick={ (event, element) => {console.log('double click control', element, event);}} /> */}
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default Flow;
