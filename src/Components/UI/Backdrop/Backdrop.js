import React from 'react';
import './Backdrop.css';


function Backdrop(props) {
    return (
        <div 
        className="backdrop" 
        onClick={props.modalCloseHandler}>
            {props.children}
        </div>
    )
}

export default Backdrop
