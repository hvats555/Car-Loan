import React from 'react';
import { useState, useEffect } from 'react';

import db from '../../../firebase';
import { query, collection, onSnapshot, orderBy, deleteDoc, doc} from "firebase/firestore"; 

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditBank from '../EditBank/EditBank';
import Modal from '../../UI/Modal/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';import { toast } from 'react-hot-toast';

import {DateTime} from 'luxon';
import {isNull, startCase} from 'lodash';


function ListBanks() {
    const [banks, setbanks] = useState([]);
    const [editBankModal, setEditBankModal] = useState(false);
    const [bankIndex, setBankIndex] = useState();
    
    useEffect(() => {
        const fetchBanks = async () => {
            const q = query(collection(db, "banks"), orderBy('createdAt', 'desc'));
            onSnapshot(q, (querySnapshot) => {
                console.log(querySnapshot);
                const banks = [];
                querySnapshot.forEach((doc) => {
                    const object = {
                        id: doc.id,
                        name: doc.data().name,
                        vehicalBookingGuideLastUpdate: doc.data().vehicalBookingGuideLastUpdate ? doc.data().vehicalBookingGuideLastUpdate.toMillis() : null,
                        
                        bankInterestLastUpdate: doc.data().bankInterestLastUpdate ? doc.data().bankInterestLastUpdate.toMillis() : null
                    }
                    banks.push(object);
                });
                console.log(banks);
                setbanks(banks);
            });
        }

        fetchBanks();

    }, []);

    const bankDeleteHandler = async (id) => {
        await deleteDoc(doc(db, `banks`, id));
        toast.success("Bank successfully deleted")
    }

    const formatDate = (mills) => {
        console.log("this is who i m", mills)
        if(!isNull(mills)) {
            const date = new Date(parseInt(mills)).toISOString();
            return DateTime.fromISO(date).toFormat('dd MMMM yyyy');
        } else {
            return 'N/A'
        }
    }

    return (
        <div>
            {banks ? <Table size="medium">
                <TableHead>
                    <TableRow >
                        <TableCell><strong>Bank Name</strong></TableCell>
                        <TableCell><strong>Vehical Booking Guide</strong></TableCell>
                        <TableCell><strong>Bank Interest File</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                { banks ? banks.map((bank, index) => (
                    <TableRow key={bank.id}>
                        <TableCell>{startCase(bank.name)}</TableCell>

                        <TableCell>
                            Last Updated: { bank.vehicalBookingGuideLastUpdate ? formatDate(bank.vehicalBookingGuideLastUpdate) : 'N/A' }
                        </TableCell>

                        <TableCell>
                            Last Updated: { bank.bankInterestLastUpdate ? formatDate(bank.bankInterestLastUpdate) : 'N/A' }
                        </TableCell>

                        <TableCell>
                            <IconButton onClick={() => {setBankIndex(index); setEditBankModal(true)}}>
                                <EditIcon />
                            </IconButton>

                            <IconButton aria-label="delete" onClick={() => {bankDeleteHandler(bank.id)}}>
                                <DeleteIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    )) : <p>No banks available</p>
                }
                </TableBody>
            </Table>: <p>No Appointments found on this date, feel free to create one</p>}

            {
                editBankModal ? 
                <Modal modalCloseHandler={() => {setEditBankModal(false)}}>
                    <EditBank bank={banks[bankIndex]} modalCloseHandler = {() => {setEditBankModal(false)}}/>
                </Modal> : null
                
            }
        </div>
    )
}

export default ListBanks
