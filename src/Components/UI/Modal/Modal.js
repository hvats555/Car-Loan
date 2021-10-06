import React from 'react';
import Backdrop from '../Backdrop/Backdrop';

import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

import './Modal.css';

function Modal(props) {
    return (
        <Backdrop modalCloseHandler={props.modalCloseHandler}>
            <div style={props.style} className="modal" onClick={(event) => {event.stopPropagation()}}>
                <IconButton className="modal__closeBtn" onClick={props.modalCloseHandler} aria-label="closeModal">
                    <ClearIcon />
                </IconButton>
                {props.children}    
            </div>
        </Backdrop>
    )
}

export default Modal