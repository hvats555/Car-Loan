import React from 'react';
import {useState} from 'react';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import NewAppointment from '../../Components/Appointments/NewAppointment/NewAppointment';
import ListAppointments from '../../Components/Appointments/ListAppointments/ListAppointments';

import Modal from '../../Components/UI/Modal/Modal';

import './Appointment.css';

function Appointment() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="Appointment">

            <Fab className="createButton" onClick={() => {setIsModalOpen(true)}} color="primary" aria-label="add">
                <AddIcon />
            </Fab>

            {isModalOpen ? 
            <Modal modalCloseHandler={() => {setIsModalOpen(false)}}>
                <NewAppointment modalCloseHandler={() => {setIsModalOpen(false)}} />
            </Modal> : null}

            <ListAppointments />
        </div>

    )
}

export default Appointment
