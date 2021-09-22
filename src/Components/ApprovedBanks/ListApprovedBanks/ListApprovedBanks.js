import React from 'react'

function ListApprovedBanks(props) {
    return (
        <div>
            { 
                props.approvedBanks ? props.approvedBanks.map((approvedBank) => (
                    <div>
                        <hr />
                        <p><strong>Bank Name:</strong> {approvedBank.bankName}</p>
                        <p><strong>Approval Type:</strong> {approvedBank.approvalType}</p>
                        <p><strong>Term:</strong> {approvedBank.term} Months</p>
                        <p><strong>Amount:</strong> ${approvedBank.amount}</p>
                        <hr />
                    </div>
                )) : <p>No approved Banks available</p>
            }
        </div>
    )
}

export default ListApprovedBanks
