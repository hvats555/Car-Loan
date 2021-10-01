import React from 'react';
import {useState, useEffect} from 'react';
import { doc, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore"; 
import calculateEmi from '../../utils/calculateEmi';
import prepareCarSearchResults from '../../utils/prepareCarSearchResults';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import db from '../../firebase';

function AddApprovedBanks(props) {
    const initialApprovedBankState = {
        bankId: null,
        bankName: null,
        amount: null,
        term: null,
        monthlyEmi: null,
        interestRate: null,
        downPayment: 0,
        tradeIn: 0
    }

    const validationInitialState = {
        bankName: {
            isError: false,
            errorText: ''
        },
        amount: {
            isError: false,
            errorText: ''
        },

        interestRate: {
            isError: false,
            errorText: ''
        },

        term: {
            isError: false,
            errorText: ''
        }
    }

    const [validationErrors, setValidationErrors] = useState(validationInitialState);

    const [approvedBank, setApprovedBank] = useState(initialApprovedBankState);
    const [banks, setBanks] = useState([]);
    const [profitMargin, setProfitMargin] = useState(0);

    const handleValidation = () => {
      const fields = approvedBank;
      let errors = {...validationErrors};
      let formIsValid = true;
      
      // Cannot be empty
      if(!fields['bankName']){
        formIsValid = false;
        errors.bankName['isError'] = !formIsValid;
        errors.bankName['errorText'] = 'Cannot be empty';
      }

      if(!fields['amount']){
        formIsValid = false;
        errors.amount['isError'] = !formIsValid;
        errors.amount['errorText'] = 'Cannot be empty';
      }

      if(!fields['interestRate']){
        formIsValid = false;
        errors.interestRate['isError'] = !formIsValid;
        errors.interestRate['errorText'] = 'Cannot be empty';
      }

      if(!fields['term']){
          formIsValid = false;
          errors.term['isError'] = !formIsValid;
          errors.term['errorText'] = 'Cannot be empty';
      }
  
      setValidationErrors(errors);
      return formIsValid;
    }

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
        
        if(handleValidation()) {
            approvedBank.monthlyEmi = calculateEmi(approvedBank.amount, approvedBank.interestRate, approvedBank.term, approvedBank.downPayment, approvedBank.tradeIn);

            const approvedBankRef = doc(db, "customers", props.customerId);
    
            await updateDoc(approvedBankRef, {
                approvedBanks: arrayUnion(approvedBank)
            });
    
            setApprovedBank(initialApprovedBankState);
            setValidationErrors(validationInitialState);
            props.modalCloseHandler();
        
            props.searchResultsHandler();
        }
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
            <h2>Add Bank</h2>
            <form onSubmit={(event) => {saveApprovedBankInDb(event)}}>
                <Grid container rowSpacing={1} spacing={1}>
                    <Grid item xs={12}>
                        <InputLabel id="bankName-label">Bank</InputLabel>
                        <Select
                            errorState={validationErrors.bankName.isError}
                            helperText={validationErrors.bankName.errorText}

                            placeholder="Banks"
                            fullWidth
                            size="small"
                            labelId="bankName-label"
                            id="bankName"
                            label="Bank"
                            name="bankName"
                            onChange={(event) => {bankInputHandler(event.target.value)}}
                        >

                        {
                            banks ? banks.map((bank, index) => (
                                <MenuItem key={bank.id} value={index}>{bank.name}</MenuItem>
                            )) : <MenuItem key='N/A' disabled value="N/A">No banks found</MenuItem>
                        }
                        </Select>

                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                        
                        errorState={validationErrors.interestRate.isError}
                        helperText={validationErrors.interestRate.errorText}

                        fullWidth id="outlined-basic" size="small" type="number" name="interestRate" label="Interest Rate" value={approvedBank.interestRate} onChange={(event) => {inputChangeHandler("interestRate", event.target.value)}} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                        
                        errorState={validationErrors.amount.isError}
                        helperText={validationErrors.amount.errorText}

                        fullWidth id="outlined-basic" label="Loan Amount" size="small" type="number" name="amount" value={approvedBank.amount} onChange={(event) => {inputChangeHandler("amount", event.target.value)}} />
                    </Grid>
                    
                    <Grid fullWidth item xs={12}>
                        <TextField 
                        
                        errorState={validationErrors.term.isError}
                        helperText={validationErrors.term.errorText}
                        
                        label="Term" fullWidth id="outlined-basic" size="small" type="number" name="term" value={approvedBank.term} onChange={(event) => {inputChangeHandler("term", event.target.value)}} />
                    </Grid>

                    {/* <Grid fullWidth item xs={12}>
                        <TextField label="Profit Margin" fullWidth id="outlined-basic" size="small" type="number" name="term" value={profitMargin} onChange={(event) => {setProfitMargin(event.target.value)}} />
                    </Grid>


                    <Grid fullWidth item xs={12}>
                        <TextField label="Down Payment" label="Down payment" fullWidth id="outlined-basic" size="small" type="number" name="downPayment" value={approvedBank.downPayment} onChange={(event) => {inputChangeHandler("downPayment", event.target.value)}} />
                    </Grid>


                    <Grid fullWidth item xs={12}>
                        <TextField label="Trade In Value" fullWidth id="outlined-basic" size="small" type="number" name="tradeIn" value={approvedBank.tradeIn} onChange={(event) => {inputChangeHandler("tradeIn", event.target.value)}} />
                    </Grid> */}
                </Grid>

                <Button sx={{margin: '20px 0'}} type="submit" variant="contained">Add Bank</Button>

            </form>
        </div>
    )
}

export default AddApprovedBanks
