import React, { useState } from 'react';
import NewBank from '../../Components/Banks/NewBank/NewBank';
import ListBanks from '../../Components/Banks/ListBank/ListBank';
import Modal from '../../Components/UI/Modal/Modal';

function Bank() {
    const [newBankModal, setNewBankModal] = useState(false);

    const newBankModalHandler = (state) => {
        setNewBankModal(state);
    }

    return (
        <div>
            <button onClick={() => {newBankModalHandler(true)}}>Add Approved Bank</button>

            {newBankModal ? 
                <Modal modalCloseHandler={() => {newBankModalHandler(false)}}>
                    <NewBank modalCloseHandler = {() => {newBankModalHandler(false)}}/>
                </Modal> : null
            }

            <ListBanks />
        </div>
    )
}

export default Bank
