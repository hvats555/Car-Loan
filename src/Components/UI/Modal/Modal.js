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

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// export default function Modal(props) {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <div>
//       <Button onClick={handleOpen}>Open modal</Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           {props.children}
//         </Box>
//       </Modal>
//     </div>
//   );
// }
