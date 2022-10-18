import { useCallback, useEffect, useState } from "react";
import { applyEdgeChanges} from "reactflow";
import {ydoc, provider} from './ydoc';

export const edgesMap = ydoc.getMap('edges');

const isEdgeAddChange = (change) => change.type === 'add';
const isEdgeRemoveChange = (change) => change.type === 'remove';
const isEdgeResetChange = (change) => change.type === 'reset';

function useEdgesStateSynced(edgeList) {
    const [edges, setEdges] = useState(edgeList);

    const onEdgesChanges = useCallback((changes) => {
        const edges = Array.from(edgesMap.values()).filter((e) => e);

        const nextEdges = applyEdgeChanges(changes, edges);
        changes.forEach((change) => {
            if (isEdgeRemoveChange(change)) {
                edgesMap.delete(change.id);
            } else if (!isEdgeAddChange(change) && !isEdgeResetChange(change)) {
                edgesMap.set(change.id, nextEdges.find((e) => e.id === change.id));
            }
        });
    }, []);

    const onConnect = useCallback((params) => {
        const {source, sourceHandle, target, targetHandle} = params;
        const id = `edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
        edgesMap.set(id, {id, ...params, animated: true, style:{stroke: '#f6ab6c'}});
    }, []);

    useEffect(() => {
        const observer = () => {
            setEdges(Array.from(edgesMap.values()));
        }

        setEdges(Array.from(edgesMap.values()));
        edgesMap.observe(observer);

        return () => {
            edgesMap.unobserve(observer);
        }
    }, [setEdges]);

    return [edges, onEdgesChanges, onConnect];
}

export default useEdgesStateSynced;