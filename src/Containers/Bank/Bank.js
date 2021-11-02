import React, { useState } from 'react';
import NewBank from '../../Components/Banks/NewBank/NewBank';
import ListBanks from '../../Components/Banks/ListBank/ListBank';
import Modal from '../../Components/UI/Modal/Modal';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import './Bank.css';

function Bank() {
    const [newBankModal, setNewBankModal] = useState(false);

    const newBankModalHandler = (state) => {
        setNewBankModal(state);
    }

    return (
        <div className="Bank">
            <Fab className="createButton" onClick={() => {newBankModalHandler(true)}} color="primary" aria-label="add">
                <AddIcon />
            </Fab>

            { newBankModal ? 
                <Modal modalCloseHandler={() => {newBankModalHandler(false)}}>
                    <NewBank modalCloseHandler = {() => {newBankModalHandler(false)}}/>
                </Modal> : null
            }

            <ListBanks />
        </div>
    )
}

export default Bank
