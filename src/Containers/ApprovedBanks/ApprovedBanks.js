import React from 'react';
import { useState } from 'react';
import AddApprovedBanks from '../../Components/ApprovedBanks/AddApprovedBanks';
import ListApprovedBanks from '../../Components/ApprovedBanks/ListApprovedBanks/ListApprovedBanks';
import CarSearch from '../../Components/CarSearch/CarSearch';

import Modal from '../../Components/UI/Modal/Modal';

function ApprovedBanks(props) {
    const [newApprovedBankModal, setNewApprovedBankModal] = useState(false);

    const newApprovedBankModalHandler = (state) => {
        setNewApprovedBankModal(state);
    }

    return (
        <div>
            <button onClick={() => {newApprovedBankModalHandler(true)}}>Add Approved Bank</button>

            {newApprovedBankModal ? 
                <Modal modalCloseHandler={() => {newApprovedBankModalHandler(false)}}>
                    <AddApprovedBanks modalCloseHandler={() => {newApprovedBankModalHandler(false)}} customerId={props.customerId} />
                </Modal> : null
            }
            <ListApprovedBanks approvedBanks={props.appointment.approvedBanks}/>

            <CarSearch customerId={props.customerId} approvedBanks={props.appointment.approvedBanks} />

        </div>
    )
}

export default ApprovedBanks
