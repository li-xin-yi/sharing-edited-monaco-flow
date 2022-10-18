export const dragHandleStyle = {
    display: 'inline-block',
    width: 18,
    height: 18,
    backgroundColor: 'teal',
    // marginLeft: 100,
    borderRadius: '50%',
    float: 'right',
};

export const closeHandleStyle = {
    display: 'inline-block',
    width: 18,
    height: 18,
    backgroundColor: '#C41E3A',
    // marginLeft: 100,
    borderRadius: '50%',
    float: 'right',
    marginLeft: 8
};

export const yRemoteSelectionStyle = (clientID, color) => {
    return `.yRemoteSelection-${clientID} 
    { background-color: ${color}; opacity: 0.5;} `;
};

export const yRemoteSelectionHeadStyle = (clientID, color) => {
    return `.yRemoteSelectionHead-${clientID} {  
        position: absolute;
        border-left: ${color} solid 2px;
        border-top: ${color} solid 2px;
        border-bottom: ${color} solid 2px;
        height: 100%;
        box-sizing: border-box;}`;
};

export const yRemoteSelectionHeadHoverStyle = (clientID, color, name) => {
    return `.yRemoteSelectionHead-${clientID}:hover::after { 
        content: "${name}"; 
        background-color: ${color}; 
        box-shadow: 0 0 0 2px ${color};
        border: 1px solid ${color};
        opacity: 1; }`;
};

export const contexMenuStyle = (top, left) => {
    return {
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 100,
        position: 'absolute',
        boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.1)',
        // width: '200px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxSizing: 'border-box',
    };
};
