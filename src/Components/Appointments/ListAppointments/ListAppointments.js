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

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import './ListAppointments.css';

var _ = require('lodash');

function ListAppointments() {
    const [appointments, setAppointments] = useState([]);
    
    const [deleteAppointmentModal, setDeleteAppointmentModal] = useState(false);

    const closeDeleteAppointmentModal = () => setDeleteAppointmentModal(false);

    const [editAppointmentModal, setEditAppointmentModal] = useState(false);

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
        <div className="listAppointment">
            <div className="listAppointment__head">
                <h2>Appointments</h2>
                <FilterAppointments appointmentFilterHandler={appointmentFilterHandler}/>
            </div>

            {!_.isUndefined(appointments) && appointments.length > 0 ? <Table size="medium">
                <TableHead>
                    <TableRow >
                        <TableCell>Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone Number</TableCell>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                {appointments.map((appointment, index) => (
                    <TableRow className="listAppointment__table-row" key={index} >
                            <TableCell component={Link} to={`/appointments/${appointment.id}`}>{appointment.fullName}
                            </TableCell>
                            <TableCell component={Link} to={`/appointments/${appointment.id}`}>{appointment.appointmentDate}</TableCell>
                            <TableCell component={Link} to={`/appointments/${appointment.id}`}>{appointment.email}</TableCell>
                            <TableCell component={Link} to={`/appointments/${appointment.id}`}>{appointment.phoneNumber}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>: <p>No Appointments found on this date, feel free to create one</p>}

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
