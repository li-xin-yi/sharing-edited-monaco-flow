import React from 'react';
import Flow from './components/Flow';
import { useStore, provider } from './utils/store';



const userColors = ['#30bced',
    '#6eeb83',
    '#ffbc42',
    '#ecd444',
    '#ee6352',
    '#9ac2c9',
    '#8acb88',
    '#1be7ff',]

const userNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank']



const idx = Math.floor(Math.random() * userNames.length);
const user = userNames[idx];
const color = userColors[idx];
const awareness = provider.awareness;
awareness.setLocalStateField('user', { name: user, color: color });

function App() {

    const setUser = useStore((state) => state.setUser);
    const addclients = useStore((state) => state.addclients);
    const clients = useStore((state) => state.clients);
    const deleteclients = useStore((state) => state.deleteclients);
    setUser(user, color);

    awareness.on("update", (change) => {
        const states = awareness.getStates();
        const nodes = change.added.concat(change.updated);
        nodes.forEach((clientID) => {
            const user = states.get(clientID)?.user
            if (user) addclients(clientID, user.name, user.color);
        });
        change.removed.forEach((clientID) => {
            deleteclients(clientID);
        })
    });


    return (
        <>
            <h3> You are: <span style={{ color: color }}>{user}</span></h3>
            <p> Online Users ({clients.size}): {Array.from(clients.values()).map((client) => (
                <>
                    <span> {client.name} </span>
                    <span style={{ color: client.color }}> ● </span>
                </>

            ))}
            </p>
            <Flow />
        </>
    );
}

export default App;