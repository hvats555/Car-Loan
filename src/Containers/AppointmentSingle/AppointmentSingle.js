import React from 'react';
import {useState, useEffect} from 'react';
import db from '../../firebase';
import { doc, onSnapshot, deleteDoc } from "firebase/firestore";

import todaysDate from '../../utils/todayDate';

import Modal from '../../Components/UI/Modal/Modal';
import EditAppointment from '../../Components/Appointments/EditAppointment/EditAppointment';
import ConfirmationPrompt from '../../Components/ConfirmationPrompt/ConfirmationPrompt';

import {useHistory} from 'react-router-dom';

function AppointmentDetails({ match }) {
    const history = useHistory();

    const appointmentInitialState = {
        fullName: '',
        phoneNumber: '',
        email: '',
        isTradeIn: false,
        appointmentDate: todaysDate()
    }

    const [appointment, setAppointment] = useState(appointmentInitialState);

    const [deleteAppointmentModal, setDeleteAppointmentModal] = useState(false);

    const openDeleteAppointmentModal = () => setDeleteAppointmentModal(true);
    const closeDeleteAppointmentModal = () => setDeleteAppointmentModal(false);

    const [editAppointmentModal, setEditAppointmentModal] = useState(false);

    const openEditAppointmentModal = () => setEditAppointmentModal(true);
    const closeEditAppointmentModal = () => setEditAppointmentModal(false);

    const [editAppointmentId, setEditAppointmentId] = useState('');
    const [deleteAppointmentId, setDeleteAppointmentId] = useState('');


    useEffect(() => {
        const fetchAppointments = async (id) => {
            const unsub = onSnapshot(doc(db, "customers", id), (doc) => {
                if (doc.exists()) {
                    setAppointment({
                        id: doc.id,
                        fullName: doc.data().fullName,
                        phoneNumber: doc.data().phoneNumber,
                        email: doc.data().email,
                        isTradeIn: doc.data().isTradeIn,
                        createdAt: new Date(doc.data().createdAt.seconds * 1000).toString(),
                        appointmentDate: new Date(doc.data().appointmentDate.seconds * 1000).toString(),
                    })
                } else {
                        console.log("No such document!");
                    }
            });
        }

        fetchAppointments(match.params.id);

        return () => {
            setAppointment({});
        }
    }, []);

    const appointmentDeleteHandler = async (id) => {
        await deleteDoc(doc(db, "customers", id));
        setDeleteAppointmentId('');
        closeDeleteAppointmentModal();
        history.push('/appointments')
    }

    return (
        <div>
            <h3>{appointment.fullName}</h3>
            <p>{appointment.email} | {appointment.phoneNumber}</p>
            <p>Trade In: {appointment.isTradeIn.toString()}</p>
            <p><em>Appointment Date: {appointment.appointmentDate}</em></p>

            <button onClick={() => {openDeleteAppointmentModal(); setDeleteAppointmentId(appointment.id)}}>Delete (X)</button>

            <button onClick={() => {openEditAppointmentModal(); setEditAppointmentId(appointment.id)}}>Edit</button>
                {
                    editAppointmentModal ? 
                    <Modal modalCloseHandler={closeEditAppointmentModal}>
                        <EditAppointment id={editAppointmentId} modalCloseHandler={closeEditAppointmentModal}/>
                    </Modal>
                    : null
                }
                {   deleteAppointmentModal ?
                    <Modal modalCloseHandler={closeDeleteAppointmentModal}>
                        <ConfirmationPrompt 
                        headline="Are you sure that you want to delete the appointment?"

                        yesButtonText="Yes"
                        yesButtonHandler={() => {appointmentDeleteHandler(deleteAppointmentId)}}

                        noButtonText="No"
                        noButtonHandler={closeDeleteAppointmentModal}
                        />
                    </Modal> 
                    :null
                }
        </div>
    )
}

export default AppointmentDetails
