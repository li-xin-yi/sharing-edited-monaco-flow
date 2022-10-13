import { useCallback, useEffect, useState } from "react";
import { applyNodeChanges} from "reactflow";
import {ydoc, provider} from './ydoc';

export const nodesMap = ydoc.getMap('node');


const isNodeAddChange = (change) => change.type === 'add';
const isNodeRemoveChange = (change) => change.type === 'remove';
const isNodeResetChange = (change) => change.type === 'reset';

function useNodesStateSynced(nodeList) {
    const [nodes, setNodes] = useState(nodeList);

    const onNodesChanges = useCallback((changes) => {
        const nodes = Array.from(nodesMap.values());

        const nextNodes = applyNodeChanges(changes, nodes);
        changes.forEach((change) => {
            console.log(change);
            console.log(nodes);
            if (!isNodeAddChange(change) && !isNodeResetChange(change) && change.type!=='select') {
                const node = nextNodes.find((n) => n.id === change.id);

                if (node && !isNodeRemoveChange(change)) {
                    nodesMap.set(change.id, node);
                } else if (isNodeRemoveChange(change)) {
                    nodesMap.delete(change.id);
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