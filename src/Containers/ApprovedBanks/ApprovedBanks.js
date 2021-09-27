import React from 'react';
import { useState } from 'react';
import AddApprovedBanks from '../../Components/ApprovedBanks/AddApprovedBanks';
import ListApprovedBanks from '../../Components/ApprovedBanks/ListApprovedBanks/ListApprovedBanks';
import CarSearch from '../../Components/CarSearch/CarSearch';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Modal from '../../Components/UI/Modal/Modal';

function ApprovedBanks(props) {
    const [newApprovedBankModal, setNewApprovedBankModal] = useState(false);

    const newApprovedBankModalHandler = (state) => {
        setNewApprovedBankModal(state);
    }

    return (
        <div>
            <Grid sx={{alignItems: 'center'}} className="appointmentSingle__info-container" container spacing={2}>
                <Grid item xs={10}>   
                    <h3>Approved Banks</h3>
                </Grid>

                <Grid item xs={2}>              
                    <Button variant="contained" size="small" onClick={() => {newApprovedBankModalHandler(true)}}>Add New</Button>
                </Grid>
            </Grid>

            {newApprovedBankModal ? 
                <Modal modalCloseHandler={() => {newApprovedBankModalHandler(false)}}>
                    <AddApprovedBanks modalCloseHandler={() => {newApprovedBankModalHandler(false)}} customerId={props.customerId} />
                </Modal> : null
            }
            <ListApprovedBanks customerId={props.customerId} approvedBanks={props.appointment.approvedBanks}/>

            <CarSearch customerId={props.customerId} approvedBanks={props.appointment.approvedBanks} />

        </div>
    )
}

export default ApprovedBanks
