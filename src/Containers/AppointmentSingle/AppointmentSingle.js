import React from 'react';
import {useState, useEffect} from 'react';
import db from '../../firebase';
import { doc, onSnapshot, deleteDoc, query, collection } from "firebase/firestore";

import todaysDate from '../../utils/todayDate';

import Modal from '../../Components/UI/Modal/Modal';
import EditAppointment from '../../Components/Appointments/EditAppointment/EditAppointment';
import ConfirmationPrompt from '../../Components/ConfirmationPrompt/ConfirmationPrompt';

import ApprovedBanks from '../../Containers/ApprovedBanks/ApprovedBanks';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';

import './AppointmentSingle.css';


import {useHistory} from 'react-router-dom';

function AppointmentDetails({ match }) {
    const history = useHistory();

    const appointmentInitialState = {
        fullName: '',
        phoneNumber: '',
        email: '',
        taxExemption: false,
        appointmentDate: todaysDate()
    }

    const [appointment, setAppointment] = useState(appointmentInitialState);
    const [approvedBanks, setApprovedBanks] = useState({});

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
                        taxExemption: doc.data().taxExemption,
                        approvedBanks: doc.data().approvedBanks
                    })
                } else {
                        console.log("No such document!");
                    }
            });
        }

        const fetchApprovedBanks = async () => {
            const q = query(collection(db, `customers/${match.params.id}/approvedBanks`));

            onSnapshot(q, (querySnapshot) => {
                const banks = [];
                querySnapshot.forEach((doc) => {
                    banks.push(doc.data());
                });

                setApprovedBanks(banks)
            });
        }

        fetchApprovedBanks();

        fetchAppointments(match.params.id);

        return () => {
            setAppointment({});
            setApprovedBanks({});
        }
    }, []);

    const appointmentDeleteHandler = async (id) => {
        await deleteDoc(doc(db, "customers", id));
        setDeleteAppointmentId('');
        closeDeleteAppointmentModal();
        history.push('/')
    }

    return (
        <div>
            <Box sx={{
                marginBottom: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                width: "100%",
                height: "150px",
            }}}>

                <div className="userInfo">
                    <div className="appointmentSingle__info">
                        <h1>{appointment.fullName? capitalizeFirstLetter(appointment.fullName): null}</h1>
                        <p>Email: {appointment.email ? appointment.email : "N/A"}</p>
                        <p>Phone Number: {appointment.phoneNumber ? appointment.phoneNumber : "N/A"}</p>
                        <p>Tax exempt: {appointment.taxExemption ? "Yes" : "No"}</p>
                    </div>

                    <div>              
                        <IconButton onClick={() => {openEditAppointmentModal(); setEditAppointmentId(appointment.id)}}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => {openDeleteAppointmentModal(); setDeleteAppointmentId(appointment.id)}} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
            </Box>

            <ApprovedBanks customerId={match.params.id} approvedBanks={approvedBanks} appointment={appointment} />

                {
                    editAppointmentModal ? 
                    <Modal modalCloseHandler={closeEditAppointmentModal}>
                        <EditAppointment id={editAppointmentId} modalCloseHandler={closeEditAppointmentModal}/>
                    </Modal>
                    : null
                }
                {   deleteAppointmentModal ?
                    <Modal style={{height: window.innerWidth <520 ? "min(50%, 500px)" : "min(30%, 500px)"}}  modalCloseHandler={closeDeleteAppointmentModal}>
                        <ConfirmationPrompt
                        headline="Are you sure that you want to delete this credit application?"

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
