// TODO: Default list: update and delete view appointments
import React from 'react';
import {useState, useEffect} from 'react';
import db from '../../../firebase';
import { doc, query, where, collection, onSnapshot, orderBy, Timestamp, deleteDoc} from "firebase/firestore"; 

import {Link} from 'react-router-dom';

import FilterAppointments from '../FilterAppointments/FilterAppointments';
import Modal from '../../UI/Modal/Modal';
import EditAppointment from '../EditAppointment/EditAppointment';
import ConfirmationPrompt from '../../ConfirmationPrompt/ConfirmationPrompt';

var _ = require('lodash');

function ListAppointments() {
    const [appointments, setAppointments] = useState([]);
    
    const [deleteAppointmentModal, setDeleteAppointmentModal] = useState(false);

    const openDeleteAppointmentModal = () => setDeleteAppointmentModal(true);
    const closeDeleteAppointmentModal = () => setDeleteAppointmentModal(false);

    const [editAppointmentModal, setEditAppointmentModal] = useState(false);

    const openEditAppointmentModal = () => setEditAppointmentModal(true);
    const closeEditAppointmentModal = () => setEditAppointmentModal(false);

    const [editAppointmentId, setEditAppointmentId] = useState('');
    const [deleteAppointmentId, setDeleteAppointmentId] = useState('');

    const q = query(collection(db, "customers"), orderBy('createdAt', 'desc'));
    
    useEffect(() => {
        const fetchAppointments = async () => {
            onSnapshot(q, (querySnapshot) => {
                const appointments = [];
    
                querySnapshot.forEach((doc) => {
                    const object = {
                        id: doc.id,
                        fullName: doc.data().fullName,
                        phoneNumber: doc.data().phoneNumber,
                        email: doc.data().email,
                        isTradeIn: doc.data().isTradeIn,
                        createdAt: doc.data().createdAt && new Date(doc.data().createdAt.seconds * 1000).toString(),
                        appointmentDate: doc.data().appointmentDate && new Date(doc.data().appointmentDate.seconds * 1000).toString(),
                    }
                    appointments.push(object);
                });
                setAppointments(appointments);
            });
        }

        fetchAppointments();

    }, []);

    const appointmentFilterHandler = (value) => {
        const timestamp = Timestamp.fromDate(new Date(value));

        const q = query(collection(db, "customers"), orderBy('createdAt', 'desc'), where('appointmentDate', '==', timestamp));

        onSnapshot(q, (querySnapshot) => {
            const appointments = [];
            querySnapshot.forEach((doc) => {
                const object = {
                    id: doc.id,
                    fullName: doc.data().fullName,
                    phoneNumber: doc.data().phoneNumber,
                    email: doc.data().email,
                    isTradeIn: doc.data().isTradeIn,
                    createdAt: doc.data().createdAt && new Date(doc.data().createdAt.seconds * 1000).toString(),
                    appointmentDate: doc.data().appointmentDate && new Date(doc.data().appointmentDate.seconds * 1000).toString(),
                }
                appointments.push(object);
            });
            setAppointments(appointments);
        });
    }

    const appointmentDeleteHandler = async (id) => {
        await deleteDoc(doc(db, "customers", id));
        setDeleteAppointmentId('');
        closeDeleteAppointmentModal();
    }

    return (
        <div>
            <h2>Appointments</h2>

            <FilterAppointments appointmentFilterHandler={appointmentFilterHandler}/>

            {!_.isUndefined(appointments) && appointments.length > 0 ? appointments.map((appointment, index) => (
                    <div key={index} className="listDiv">
                        <hr />

                        <Link to={`/appointments/${appointment.id}`}>
                            <h3>{appointment.fullName}</h3>
                        </Link>

                        <p>{appointment.email} | {appointment.phoneNumber}</p>
                        <p>Trade In: {appointment.isTradeIn.toString()}</p>
                        <p><em>Created at: {appointment.createdAt}</em></p>
                        <p><em>Appointment Date: {appointment.appointmentDate}</em></p>

                        <button onClick={() => {openDeleteAppointmentModal(); setDeleteAppointmentId(appointment.id)}}>Delete (X)</button>

                        <button onClick={() => {openEditAppointmentModal(); setEditAppointmentId(appointment.id)}}>Edit</button>

                        <hr />
                    </div>
            )): <p>No Appointments found on this date, feel free to create one</p>
            }

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

export default ListAppointments
