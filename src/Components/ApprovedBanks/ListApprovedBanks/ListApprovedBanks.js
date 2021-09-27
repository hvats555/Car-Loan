import React, {useState} from 'react';
import Modal from '../../UI/Modal/Modal';
import EditApprovedBanks from '../EditApprovedBanks/EditApprovedBanks';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ListApprovedBanks(props) {
    const [approvedBankIndex, setApprovedBankIndex] = useState(null);
    const [approvedBankEditModal, setApprovedBankEditModal] = useState(false);

    const approvedBankEditModalHandler = (state) => {
        setApprovedBankEditModal(state);
    }

    return (
        <div>
            { 
                props.approvedBanks ?
                    <Table size="medium">
                    <TableHead>
                        <TableRow >
                            <TableCell>Bank Name:</TableCell>
                            <TableCell>Term:</TableCell>
                            <TableCell>Amount:</TableCell>
                            <TableCell>Interest Rate:</TableCell>
                            <TableCell>Monthly EMI</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                    {props.approvedBanks.map((approvedBank, index) => (
                        <TableRow>
                                <TableCell>{approvedBank.bankName}</TableCell>
                                <TableCell>{approvedBank.term}</TableCell>
                                <TableCell>{approvedBank.amount}</TableCell>
                                <TableCell>{approvedBank.interestRate}</TableCell>
                                <TableCell>${approvedBank.monthlyEmi}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => {setApprovedBankIndex(index); approvedBankEditModalHandler(true)}}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table> : <p>Approved Banks will be displayer here</p>}

            {
                approvedBankEditModal ?
                <Modal modalCloseHandler={() => {approvedBankEditModalHandler(false)}}>
                    <EditApprovedBanks fetchCarSearchResults={props.fetchCarSearchResults} modalCloseHandler={() => {approvedBankEditModalHandler(false)}} customerId={props.customerId} approvedBank={props.approvedBanks[approvedBankIndex]} />
                </Modal> : null
            }

        </div>
    )
}

export default ListApprovedBanks
