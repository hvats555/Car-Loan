import React, {useState} from 'react';
import Modal from '../../UI/Modal/Modal';
import EditApprovedBanks from '../EditApprovedBanks/EditApprovedBanks';
import db from '../../../firebase';
import { doc, deleteDoc } from "firebase/firestore";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ApprovedBankCartoon from '../../Cartoons/ApprovedBankCartoon';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const _ = require('lodash');

function ListApprovedBanks(props) {
    const [approvedBankIndex, setApprovedBankIndex] = useState(null);
    const [approvedBankEditModal, setApprovedBankEditModal] = useState(false);

    const approvedBankEditModalHandler = (state) => {
        setApprovedBankEditModal(state);
    }

    const approvedBankDeleteHandler = async (id) => {
        console.log(props.customerId);
        await deleteDoc(doc(db, `customers/${props.customerId}/approvedBanks`, id));
    }

    return (
        <div className="tableContainer">
            { props.approvedBanks && !_.isEmpty(props.approvedBanks) ?
                    <Table size="medium">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{textAlign: 'center'}}><strong>Bank Name</strong></TableCell>
                            <TableCell sx={{textAlign: 'center'}}><strong>Term of Borrowing</strong></TableCell>
                            <TableCell sx={{textAlign: 'center'}}><strong>Amount Financed</strong></TableCell>
                            <TableCell sx={{textAlign: 'center'}}><strong>Annual Interest Rate</strong></TableCell>
                            <TableCell sx={{textAlign: 'center'}}><strong>Installment Payment/Month</strong></TableCell>
                            <TableCell sx={{textAlign: 'center'}}><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                    {props.approvedBanks.map((approvedBank, index) => (
                        <TableRow key={approvedBank.bankId}>
                                <TableCell sx={{textAlign: 'center'}}>{approvedBank.bankName}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{approvedBank.term} months</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>${approvedBank.amount}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{approvedBank.interestRate}%</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>${approvedBank.monthlyEmi}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <IconButton onClick={() => {setApprovedBankIndex(index); approvedBankEditModalHandler(true)}}>
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton onClick={() => {approvedBankDeleteHandler(approvedBank.bankId)}} aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table> : <ApprovedBankCartoon />}

            {
                approvedBankEditModal ?
                <Modal modalCloseHandler={() => {approvedBankEditModalHandler(false)}}>
                    <EditApprovedBanks 
                    searchResultsHandler={props.searchResultsHandler} 
                    fetchCarSearchResults={props.fetchCarSearchResults} 
                    setCars={props.setCars} 
                    modalCloseHandler={() => {approvedBankEditModalHandler(false)}} 
                    customerId={props.customerId} 
                    approvedBank={props.approvedBanks[approvedBankIndex]} />
                </Modal> : null
            }

        </div>
    )
}

export default ListApprovedBanks
