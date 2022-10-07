import React from 'react';

import { createRoot } from "react-dom/client";
import Flow from './Flow';

const userColors = [ '#30bced',
'#6eeb83',
'#ffbc42',
'#ecd444',
'#ee6352',
'#9ac2c9',
'#8acb88',
'#1be7ff',]

const userNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank']

class App extends React.Component {
    constructor(props) {
        super(props);
        const idx = Math.floor(Math.random() * userNames.length);
        this.state = { user: userNames[idx], color: userColors[idx] };
    }

    render() {
        return (
            <React.StrictMode>
                <h3> You are: <span style={{color:this.state.color}}>{this.state.user}</span></h3>
                <Flow user={this.state.user} color={this.state.color}/>
            </React.StrictMode>
        );
    }  
}

export default App;