import React from 'react';
import { MarkerType } from 'reactflow';

export const getNodes = () => {
  return ([
    {
      id: '8'
      , data: { label: 'Code:', id: 'prefix-8' }, type: 'monacoNode', position: { x: 0, y: 0 }, dragHandle: '.monaco-drag-handle'
    },
    {
      id: '9'
      , data: { label: 'Code:', id: 'prefix-9' }, type: 'monacoNode', position: { x: 200, y: 400 }, dragHandle: '.monaco-drag-handle'
    },

    {
      id: '10'
      , data: { label: 'Code:', id: 'prefix-10' }, type: 'monacoNode', position: { x: 600, y: 100 }, dragHandle: '.monaco-drag-handle'
    },
    {
      id: '11'
      , data: { label: 'Text:', id: 'prefix-11' }, type: 'quillNode', position: { x: 700, y: 400 }, dragHandle: '.quill-drag-handle'
    },

  //   {
  //     id: '19'
  //     , data: { label: 'Code:', id: 'prefix-19' }, type: 'monacoNode', position: { x: 850, y: 100 }, dragHandle: '.monaco-drag-handle'
  //   },
  ]);
}

export const edges = [

  { id: 'op1', source: '8', target: '9', animated: true, style: { stroke: '#f6ab6c' }, },
  { id: 'op2', source: '9', target: '10', style: { stroke: '#66ffcc' }, },
];
