import React from 'react';
import {useState, useEffect} from 'react';
import { doc, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore"; 

import db from '../../firebase';

function AddApprovedBanks(props) {
    const initialApprovedBankState = {
        bankName: '',
        approvalType: '',
        amount: '',
        term: ''
    }

    const [approvedBank, setApprovedBank] = useState(initialApprovedBankState);
    const [banks, setBanks] = useState([])

    useEffect(() => {
        const fetchBanks = async () => {
            const querySnapshot = await getDocs(collection(db, "banks"));
            const banksArray = []
            querySnapshot.forEach((doc) => {
                banksArray.push({
                    name: doc.data().name
                });
            });
            setBanks(banksArray);
        }

        fetchBanks();
    })

    const saveApprovedBankInDb = async (event) => {
        event.preventDefault();
        
        const appointmentRef = doc(db, "customers", props.customerId);

        await updateDoc(appointmentRef, {
            approvedBanks: arrayUnion(approvedBank)
        });

        setApprovedBank(initialApprovedBankState);
        props.modalCloseHandler();
    }

    const inputChangeHandler = (key, value) => {
        setApprovedBank({...approvedBank, [key]: value});
    }

    return ( 
        <div>
            <h2>Add Approved Bank</h2>
            <form onSubmit={(event) => {saveApprovedBankInDb(event)}}>

                Bank name: 

                <select value={approvedBank.bankName} name="bankName" placeholder="Select Banks" onChange={(event) => {inputChangeHandler('bankName', event.target.value)}}>
                    {
                        banks ? banks.map((bank) => (
                            <option key={banks.id} value={banks.id}>{bank.name}</option>
                        )) : <option key='N/A' disabled value="N/A">No banks found</option>
                    }
                </select>

                Approval Type: 

                <select value={approvedBank.approvalType} name="approvalType" placeholder="Approval Type" onChange={(event) => {inputChangeHandler('approvalType', event.target.value)}}>
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                </select>

                Amount: 
                
                <input type="number" name="amount" placeholder="Amount" value={approvedBank.amount} onChange={(event) => {inputChangeHandler("amount", event.target.value)}} />

                Term: 

                <input type="number" name="term" placeholder="Term" value={approvedBank.term} onChange={(event) => {inputChangeHandler("term", event.target.value)}} />

                <input type="submit" value="Add to Approved bank"/>
            </form>
        </div>
    )
}

export default AddApprovedBanks
