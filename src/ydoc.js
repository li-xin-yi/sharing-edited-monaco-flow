import {Doc} from 'yjs';
// import {WebrtcProvider} from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Doc();
// const provider = new WebrtcProvider('layout-demos', ydoc, {signaling: ['ws://localhost:1235']});
const provider = new WebsocketProvider('ws://localhost:1234', 'layout', ydoc);

provider.connect();

export default ydoc;