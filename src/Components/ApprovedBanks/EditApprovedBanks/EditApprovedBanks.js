import React from 'react';
import {useState, useEffect} from 'react';
import { doc, updateDoc, arrayUnion, getDocs, collection, arrayRemove } from "firebase/firestore"; 
import calculateEmi from '../../../utils/calculateEmi';
import prepareCarSearchResults from '../../../utils/prepareCarSearchResults';
import db from '../../../firebase';
import store from 'store';

function EditApprovedBanks(props) {
    const initialApprovedBankState = {
        bankId: '',
        bankName: '',
        amount: 0,
        term: 0,
        monthlyEmi: 0,
        interestRate: 0
    }

    const [approvedBank, setApprovedBank] = useState(props.approvedBank);
    const [profitMargin, setProfitMargin] = useState(3000);
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        const fetchBanks = async () => {
            const querySnapshot = await getDocs(collection(db, "banks"));
            const banksArray = []
            querySnapshot.forEach((doc) => {
                banksArray.push({
                    id: doc.id,
                    name: doc.data().name
                });
            });
            setBanks(banksArray);
        }
        fetchBanks();
    });

    const saveApprovedBankInDb = async (event) => {
        event.preventDefault();
        
        approvedBank.monthlyEmi = calculateEmi(approvedBank.amount, approvedBank.interestRate, approvedBank.term);

        const approvedBankRef = doc(db, "customers", props.customerId);

        store.remove(props.approvedBank.bankId);

        await updateDoc(approvedBankRef, {
            approvedBanks: arrayRemove(props.approvedBank)
        });

        await updateDoc(approvedBankRef, {
            approvedBanks: arrayUnion(approvedBank)
        });

        setApprovedBank(initialApprovedBankState);
        props.modalCloseHandler();

        prepareCarSearchResults(props.customerId, approvedBank.bankId, profitMargin);
    }

    const inputChangeHandler = (key, value) => {
        setApprovedBank({...approvedBank, [key]: value});
    }

    const bankInputHandler = (index) => {
        setApprovedBank({
            ...approvedBank,
            bankId: banks[index].id,
            bankName: banks[index].name
        });
    }

    return ( 
        <div>
            <h2>Add Approved Bank</h2>
            <form onSubmit={(event) => {saveApprovedBankInDb(event)}}>

                {/* Bank name: 

                <select name="bankName" placeholder="Select Banks" onChange={(event) => {bankInputHandler(event.target.value)}}>
                    <option key='0' disabled selected value={null}>Select Bank</option>

                    {
                        banks ? banks.map((bank, index) => (
                            <option key={bank.id} value={index}>{bank.name}</option>
                        )) : <option key='N/A' disabled value="N/A">No banks found</option>
                    }
                </select> */}

                Interest Rate:

                <input type="number" name="interestRate" placeholder="Interest Rate" value={approvedBank.interestRate} onChange={(event) => {inputChangeHandler("interestRate", event.target.value)}} />

                Amount: 
                
                <input type="number" name="amount" placeholder="Amount" value={approvedBank.amount} onChange={(event) => {inputChangeHandler("amount", event.target.value)}} />

                Term: 

                <input type="number" name="term" placeholder="Term" value={approvedBank.term} onChange={(event) => {inputChangeHandler("term", event.target.value)}} />

                Profit Margin: 

                <input type="number" name="term" placeholder="Term" value={profitMargin} onChange={(event) => {setProfitMargin(event.target.value)}} />

                <input type="submit" value="Update Approved bank"/>
            </form>

            ** You would loose past search results

        </div>
    )
}

export default EditApprovedBanks
