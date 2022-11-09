import create from 'zustand'
import produce from 'immer'
import {Doc} from 'yjs';
import { WebrtcProvider} from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';
import {
    yRemoteSelectionStyle,
    yRemoteSelectionHeadStyle,
    yRemoteSelectionHeadHoverStyle,
} from '../utils/styles';

export const ydoc = new Doc()
export const provider = new WebrtcProvider('react-flow-demo-test', ydoc, {signaling: ['ws://localhost:5555']});

function addAwarenessStyle(clientID, color, name) {
    const styles = document.createElement("style");
    styles.append(yRemoteSelectionStyle(clientID, color));
    styles.append(yRemoteSelectionHeadStyle(clientID, color));
    styles.append(yRemoteSelectionHeadHoverStyle(clientID, color, name));
    document.head.append(styles);
}

export const useStore = create(set => ({
    selectNode: null,
    setSelectNode: (node) => set(() => ({ selectNode: node })),
    user: null,
    color: null,
    setUser: (user, color) => set(() => ({ user: user, color: color })),
    clients: new Map(),
    
    addclients: (clientID, name, color) => set(state => {
        if(!state.clients.has(clientID)) {
            addAwarenessStyle(clientID, color, name);
            return {clients: new Map(state.clients).set(clientID, {name: name, color: color})}
        }
        return {clients: state.clients}
    }),
    deleteclients: (clientID) => set(state =>{
        const clients = new Map(state.clients);
        clients.delete(clientID);
        return {clients: clients}
    }),

    lineNumbers: 'on',
    flipLineNumbers: () => set((state) => ({ lineNumbers:  state.lineNumbers === 'on' ? 'off' : 'on' })),
    

}))

