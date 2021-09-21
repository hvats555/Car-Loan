import React from 'react';
import Backdrop from '../Backdrop/Backdrop';

import './Modal.css';

function Modal(props) {
    return (
        <Backdrop modalCloseHandler={props.modalCloseHandler}>
            <div className="modal" onClick={(event) => {event.stopPropagation()}}>
                <button onClick={props.modalCloseHandler}>Close (X)</button>
                {props.children}    
            </div>
        </Backdrop>
    )
}

export default Modal
