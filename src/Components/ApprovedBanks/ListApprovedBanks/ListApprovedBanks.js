import React, {useState} from 'react';
import Modal from '../../UI/Modal/Modal';
import EditApprovedBanks from '../EditApprovedBanks/EditApprovedBanks';

function ListApprovedBanks(props) {
    const [approvedBankIndex, setApprovedBankIndex] = useState(null);
    const [approvedBankEditModal, setApprovedBankEditModal] = useState(false);

    const approvedBankEditModalHandler = (state) => {
        setApprovedBankEditModal(state);
    }

    return (
        <div>
            { 
                props.approvedBanks ? props.approvedBanks.map((approvedBank, index) => (
                    <div key={index}>
                        <hr />
                        <p><strong>Bank Name:</strong> {approvedBank.bankName}</p>
                        <p><strong>Approval Type:</strong> {approvedBank.approvalType}</p>
                        <p><strong>Term:</strong> {approvedBank.term} Months</p>
                        <p><strong>Amount:</strong> ${approvedBank.amount}</p>
                        <p><strong>Interest Rate:</strong> ${approvedBank.interestRate}</p>
                        <p><strong>Monthly EMI:</strong> ${approvedBank.monthlyEmi}</p>

                        {/* <button onClick={() => {openDeleteAppointmentModal(); setDeleteAppointmentId(appointment.id)}}>Delete (X)</button> */}

                        <button onClick={() => {setApprovedBankIndex(index); approvedBankEditModalHandler(true)}}>Edit</button>

                        <hr />
                    </div>
                )) : <p>No approved Banks available</p>
            }


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
