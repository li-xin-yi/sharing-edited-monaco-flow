import {Doc} from 'yjs';
import {WebrtcProvider} from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';

export const ydoc = new Doc();
export const provider = new WebrtcProvider('react-flow-demo-test', ydoc);


// It becomes much faster to use webRTC than webSocket, I also don't know why. comment out the following lines to use webSocket.
// const provider = new WebsocketProvider('wss://yjs.demo.dev', 'test-layout', ydoc);

// provider.connect();