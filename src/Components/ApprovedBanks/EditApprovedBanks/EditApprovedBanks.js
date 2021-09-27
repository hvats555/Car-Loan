import React from 'react';
import {useState, useEffect} from 'react';
import { doc, updateDoc, arrayUnion, getDocs, collection, arrayRemove } from "firebase/firestore"; 
import calculateEmi from '../../../utils/calculateEmi';
import prepareCarSearchResults from '../../../utils/prepareCarSearchResults';
import db from '../../../firebase';
import store from 'store';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function EditApprovedBanks(props) {
    const initialApprovedBankState = {
        bankId: '',
        bankName: '',
        amount: 0,
        term: 0,
        monthlyEmi: 0,
        interestRate: 0,
        downPayment: 0,
        tradeIn: 0,
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
        
        approvedBank.monthlyEmi = calculateEmi(approvedBank.amount, approvedBank.interestRate, approvedBank.term, approvedBank.downPayment, approvedBank.tradeIn);

        const approvedBankRef = doc(db, "customers", props.customerId);

        store.remove(props.approvedBank.bankId);
        // remove from state

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
            <h2>Update Bank</h2>
            <form onSubmit={(event) => {saveApprovedBankInDb(event)}}>
                <Grid container rowSpacing={1} spacing={1}>
                    <Grid item xs={12}>
                        <TextField fullWidth id="outlined-basic" size="small" type="number" name="interestRate" label="Interest Rate" value={approvedBank.interestRate} onChange={(event) => {inputChangeHandler("interestRate", event.target.value)}} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth id="outlined-basic" label="Loan Amount" size="small" type="number" name="amount" value={approvedBank.amount} onChange={(event) => {inputChangeHandler("amount", event.target.value)}} />
                    </Grid>
                    
                    <Grid fullWidth item xs={12}>
                        <TextField label="Term" fullWidth id="outlined-basic" size="small" type="number" name="term" value={approvedBank.term} onChange={(event) => {inputChangeHandler("term", event.target.value)}} />
                    </Grid>

                    <Grid fullWidth item xs={12}>
                        <TextField label="Profit Margin" fullWidth id="outlined-basic" size="small" type="number" name="term" value={profitMargin} onChange={(event) => {setProfitMargin(event.target.value)}} />
                    </Grid>


                    <Grid fullWidth item xs={12}>
                        <TextField label="Down Payment" label="Down payment" fullWidth id="outlined-basic" size="small" type="number" name="downPayment" value={approvedBank.downPayment} onChange={(event) => {inputChangeHandler("downPayment", event.target.value)}} />
                    </Grid>


                    <Grid fullWidth item xs={12}>
                        <TextField label="Trade In Value" fullWidth id="outlined-basic" size="small" type="number" name="tradeIn" value={approvedBank.tradeIn} onChange={(event) => {inputChangeHandler("tradeIn", event.target.value)}} />
                    </Grid>
                </Grid>

                <Button sx={{margin: '20px 0'}} type="submit" variant="contained">Update Bank</Button>
            </form>
        </div>
    )
}

export default EditApprovedBanks
