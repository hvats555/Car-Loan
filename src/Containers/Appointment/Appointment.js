import React from 'react';
import {useState} from 'react';

import NewAppointment from '../../Components/Appointments/NewAppointment/NewAppointment';
import ListAppointments from '../../Components/Appointments/ListAppointments/ListAppointments';

import Modal from '../../Components/UI/Modal/Modal';

function Appointment() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const modalCloseHandler = () => {
        setIsModalOpen(false);
    }

    const modalOpenHandler = () => {
        setIsModalOpen(true);
    }    

    return (
        <div className="AppointmentContainer">
            <button onClick={modalOpenHandler}>New Appointment</button>

            {isModalOpen ? 
            <Modal modalCloseHandler={modalCloseHandler}>
                <NewAppointment modalCloseHandler={modalCloseHandler} />
            </Modal> : null}

            <ListAppointments />
        </div>

    )
}

export default Appointment
