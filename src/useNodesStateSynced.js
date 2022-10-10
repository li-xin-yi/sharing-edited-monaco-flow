import { useCallback, useEffect, useState } from "react";
import { applyNodeChanges} from "reactflow";
import ydoc from './ydoc';

export const nodesMap = ydoc.getMap('node');


const isNodeAddChange = (change) => change.type === 'add';
const isNodeRemoveChange = (change) => change.type === 'remove';
const isNodeResetChange = (change) => change.type === 'reset';

function useNodesStateSynced(nodeList) {
    const [nodes, setNodes] = useState(nodeList);
    console.log("nodeList", nodeList);
    console.log(nodesMap);
    console.log("nodes", nodes)

    const onNodesChanges = useCallback((changes) => {
        const nodes = Array.from(nodesMap.values());

        const nextNodes = applyNodeChanges(changes, nodes);
        changes.forEach((change) => {
            if (!isNodeAddChange(change) && !isNodeResetChange(change)) {
                const node = nextNodes.find((n) => n.id === change.id);
                console.log("change", node);


                if (node && !isNodeRemoveChange(change)) {
                    nodesMap.set(change.id, node);
                } else if (isNodeRemoveChange(change)) {
                    nodesMap.delete(change.id);
                }
            }
        });
        console.log(nodesMap);
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