import React from 'react';
import {useState, useEffect} from 'react';
import { doc, updateDoc, arrayUnion, getDocs, collection, arrayRemove } from "firebase/firestore"; 
import db from '../../../firebase';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const _ = require('lodash');

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
    const [banks, setBanks] = useState([]);

    const validationInitialState = {
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
        },

        monthlyEmi: {
            isError: false,
            errorText: ''
        }
    }

    const [validationErrors, setValidationErrors] = useState(validationInitialState);


    const handleValidation = () => {
      const fields = approvedBank;
      let errors = {...validationErrors};
      let formIsValid = true;
      
      if(!fields['amount']){
        formIsValid = false;
        errors.amount['isError'] = !formIsValid;
        errors.amount['errorText'] = 'Cannot be empty';
      }

      if(fields['amount'] < 0){
        formIsValid = false;
        errors.amount['isError'] = !formIsValid;
        errors.amount['errorText'] = 'Value cannot be negative';
      }

      if(!fields['interestRate']){
        formIsValid = false;
        errors.interestRate['isError'] = !formIsValid;
        errors.interestRate['errorText'] = 'Cannot be empty';
      }

      if(fields['interestRate'] < 0){
        formIsValid = false;
        errors.interestRate['isError'] = !formIsValid;
        errors.interestRate['errorText'] = 'Value cannot be negative';
      }

      if(!fields['term']){
          formIsValid = false;
          errors.term['isError'] = !formIsValid;
          errors.term['errorText'] = 'Cannot be empty';
      }

      if(fields['term'] < 0){
        formIsValid = false;
        errors.term['isError'] = !formIsValid;
        errors.term['errorText'] = 'Value cannot ne negative';
    }

      if(!fields['monthlyEmi']){
        formIsValid = false;
        errors.term['isError'] = !formIsValid;
        errors.term['errorText'] = 'Cannot be empty';
    }

    if(fields['monthlyEmi'] < 0){
        formIsValid = false;
        errors.term['isError'] = !formIsValid;
        errors.term['errorText'] = 'Value cannot be negative';
    }

      setValidationErrors(errors);
      return formIsValid;
    }

    useEffect(() => {
        const fetchBanks = async () => {
            const querySnapshot = await getDocs(collection(db, "banks"));
            const banksArray = [];
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
            // approvedBank.monthlyEmi = calculateEmi(approvedBank.amount, approvedBank.interestRate, approvedBank.term, approvedBank.downPayment, approvedBank.tradeIn);

            const approvedBankRef = doc(db, "customers", props.customerId);
    
            let objectToDelete = props.approvedBank;
            if(!_.isUndefined(props.approvedBank.foundCount)) {
                objectToDelete = _.omit(props.approvedBank, ['foundCount', 'calculatedEmi']);
            }
    
            let objectToAdd = approvedBank;
            if(!_.isUndefined(approvedBank.foundCount)) {
                objectToAdd = _.omit(approvedBank, ['foundCount', 'calculatedEmi']);
            }
            
            console.log("Object to delete", objectToDelete);
    
            await updateDoc(approvedBankRef, {
                approvedBanks: arrayRemove(objectToDelete)
            });
    
    
            await updateDoc(approvedBankRef, {
                approvedBanks: arrayUnion(objectToAdd)
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

    return ( 
        <div>
            <h2>Update Bank</h2>
            <form onSubmit={(event) => {saveApprovedBankInDb(event)}}>
                <Grid container rowSpacing={1} spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                        onWheel={(e) => e.target.blur()}
                        errorState={validationErrors.interestRate.isError}
                        helperText={validationErrors.interestRate.errorText}

                        fullWidth id="outlined-basic" size="small" type="number" name="interestRate" label="Interest Rate" value={approvedBank.interestRate} onChange={(event) => {inputChangeHandler("interestRate", event.target.value)}} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                        onWheel={(e) => e.target.blur()}
                        errorState={validationErrors.amount.isError}
                        helperText={validationErrors.amount.errorText}

                        fullWidth id="outlined-basic" label="Loan Amount" size="small" type="number" name="amount" value={approvedBank.amount} onChange={(event) => {inputChangeHandler("amount", event.target.value)}} />
                    </Grid>
                    
                    <Grid fullWidth item xs={12}>
                        <TextField
                        onWheel={(e) => e.target.blur()}
                        errorState={validationErrors.term.isError}
                        helperText={validationErrors.term.errorText}
                        
                        label="Term" fullWidth id="outlined-basic" size="small" type="number" name="term" value={approvedBank.term} onChange={(event) => {inputChangeHandler("term", event.target.value)}} />
                    </Grid>

                    <Grid fullWidth item xs={12}>
                        <TextField
                        onWheel={(e) => e.target.blur()}
                        errorState={validationErrors.monthlyEmi.isError}
                        helperText={validationErrors.monthlyEmi.errorText}
                        
                        label="Monthly EMI" fullWidth id="outlined-basic" size="small" type="number" name="monthlyEmi" value={approvedBank.monthlyEmi} onChange={(event) => {inputChangeHandler("monthlyEmi", event.target.value)}} />
                    </Grid>
                </Grid>

                <Button fullWidth sx={{margin: '20px 0'}} type="submit" variant="contained">Update Bank</Button>
            </form>
        </div>
    )
}

export default EditApprovedBanks
