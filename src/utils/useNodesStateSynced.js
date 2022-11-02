import { useCallback, useEffect, useState } from "react";
import { applyNodeChanges, getConnectedEdges} from "reactflow";
import {ydoc, provider} from './ydoc';
import {edgesMap} from "./useEdgesStateSynced";
import { useStore } from "./store";


export const nodesMap = ydoc.getMap('node');



const isNodeAddChange = (change) => change.type === 'add';
const isNodeRemoveChange = (change) => change.type === 'remove';
const isNodeResetChange = (change) => change.type === 'reset';

function useNodesStateSynced(nodeList) {
    const [nodes, setNodes] = useState(nodeList);
    const setNodeId = useStore((state) => state.setSelectNode);
    const selected = useStore((state) => state.selectNode);

    const onNodesChanges = useCallback((changes) => {
        const nodes = Array.from(nodesMap.values());

        const nextNodes = applyNodeChanges(changes, nodes);
        changes.forEach((change) => {
            // console.log(change);
            // console.log(nodes);
            if (!isNodeAddChange(change) && !isNodeResetChange(change)) {
                
                if(change.type === 'select'){
                    setNodeId(change.id);
                    return;
                }

                const node = nextNodes.find((n) => n.id === change.id);

                if (node && !isNodeRemoveChange(change)) {
                    nodesMap.set(change.id, node);
                } else if (isNodeRemoveChange(change)) {
                    nodesMap.delete(change.id);
                    const edges = Array.from(edgesMap.values().map((e) => e));
                    const connectedEdges = getConnectedEdges(node, edges);
                    connectedEdges.forEach((edge) => edgesMap.delete(edge.id));
                }
            }
            
        });
    }, []);

    useEffect(() => {
        const observer = () => {
            setNodes(Array.from(nodesMap.values()));
        }

        setNodes(Array.from(nodesMap.values()));
        nodesMap.observe(observer);

        return () => {
            nodesMap.unobserve(observer);
        }
    }, [setNodes]);

    return [nodes.filter((n) => n), onNodesChanges];
}

export default useNodesStateSynced;