export const nodes =[
    {
      id: '8'
      , data: { label: 'Code:', id: '8' }, type: 'monacoNode', position: { x: 0, y: 0 }, style: { width: 400, height: 200 }, dragHandle: '.monaco-drag-handle'
    }, 
    {
      id: '9'
      , data: { label: 'Code:', id: '9' }, type: 'monacoNode', position: { x: 200, y: 400 }, dragHandle: '.monaco-drag-handle', style: { width: 400, height: 200 }
    },

    {
      id: '10'
      , data: { label: 'Code:', id: '10' }, type: 'monacoNode', position: { x: 600, y: 100 }, dragHandle: '.monaco-drag-handle', deletable: true, style: { width: 400, height: 200 }
    },
    {
      id: '11'
      , data: { label: 'Text:', id: '11' }, type: 'quillNode', position: { x: 700, y: 400 }, dragHandle: '.quill-drag-handle'
    },

  //   {
  //     id: '19'
  //     , data: { label: 'Code:', id: 'prefix-19' }, type: 'monacoNode', position: { x: 850, y: 100 }, dragHandle: '.monaco-drag-handle'
  //   },
  ];

export const edges = [

  { id: 'op1', source: '8', target: '9', animated: true, style:{stroke: '#f6ab6c'}},
  { id: 'op2', source: '9', target: '10', animated: true, style:{stroke: '#f6ab6c'}},
];
