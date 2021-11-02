import React from 'react';
import {useState, useEffect} from 'react';
import { doc, updateDoc, arrayUnion, getDocs, collection, getDoc, addDoc, query, onSnapshot, setDoc } from "firebase/firestore"; 

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import toast from 'react-hot-toast';

import {includes} from 'lodash';

import db from '../../firebase';

function AddApprovedBanks(props) {
    const initialApprovedBankState = {
        bankProgram: null,
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
        },

        monthlyEmi: {
            isError: false,
            errorText: ''
        },

        bankProgram: {
            isError: false,
            errorText: ''
        }
    }

    const [validationErrors, setValidationErrors] = useState(validationInitialState);

    const [approvedBank, setApprovedBank] = useState(initialApprovedBankState);
    const [alreadyApprovedBanks, setAlreadyApprovedBanks] = useState([]);
    const [banks, setBanks] = useState([]);
    const [bankProgram, setbankProgram] = useState(null);

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

      if(!fields['bankProgram']){
        formIsValid = false;
        errors.bankProgram['isError'] = !formIsValid;
        errors.bankProgram['errorText'] = 'Cannot be empty';
      }

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
        const fetchApprovedBanks = async () => {
            const q = query(collection(db, `customers/${props.customerId}/approvedBanks`));

            onSnapshot(q, (querySnapshot) => {
                const banks = [];
                querySnapshot.forEach((doc) => {
                    banks.push(doc.id);
                });

                setAlreadyApprovedBanks(banks)
            });
        }

        fetchApprovedBanks();

        const fetchBanks = async () => {
            const querySnapshot = await getDocs(collection(db, "banks"));

            const banksArray = []
            querySnapshot.forEach((doc) => {
                banksArray.push({
                    id: doc.id,
                    name: doc.data().name,
                    bankProgram: doc.data().bankInterest
                });
            });
            setBanks(banksArray);
        }
        fetchBanks();
    }, []);

    const saveApprovedBankInDb = async (event) => {
        event.preventDefault();
        
        if(handleValidation()) {
            // approvedBank.monthlyEmi = calculateEmi(approvedBank.amount, approvedBank.interestRate, approvedBank.term, approvedBank.downPayment, approvedBank.tradeIn);

            // await addDoc(collection(db, ), approvedBank);

            await setDoc(doc(db, `customers/${props.customerId}/approvedBanks`, approvedBank.bankId), approvedBank);
    
            setApprovedBank(initialApprovedBankState);
            setValidationErrors(validationInitialState);
            props.modalCloseHandler();
            props.searchResultsHandler();

            toast('Bank Successfully Added', {
                icon: '🏦'
            });
        }
    }

    const inputChangeHandler = (key, value) => {
        setApprovedBank({...approvedBank, [key]: value});
    }

    const bankInputHandler = (index) => {
        console.log("index", index);
        setApprovedBank({
            ...approvedBank,
            bankId: banks[index].id,
            bankName: banks[index].name
        });

        setbankProgram(banks[index].bankProgram);
    }

    const programInputHandler = (index) => {
        setApprovedBank({
            ...approvedBank, bankProgram: bankProgram[index]
        })
    }

    return ( 
        <div>
            <h2>Add Bank</h2>
            <form onSubmit={(event) => {saveApprovedBankInDb(event)}}>
                <Grid container rowSpacing={1} spacing={1}>
                    <Grid item xs={12}>
                        <InputLabel id="bankName-label">Bank</InputLabel>
                        <Select
                            defaultValue=""
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
                                <MenuItem disabled={includes(alreadyApprovedBanks, bank.id)} key={bank.id} value={index}>{bank.name}</MenuItem> 
                            )) : null
                        }

                        </Select>

                    </Grid>

                    {approvedBank.bankId ? <Grid item xs={12}>
                        <InputLabel id="bankName-label">Bank Program</InputLabel>
                        <Select
                            errorState={validationErrors.bankProgram.isError}
                            helperText={validationErrors.bankProgram.errorText}
                            defaultValue=""

                            placeholder="Banks"
                            fullWidth
                            size="small"
                            labelId="bankProgram-label"
                            id="bankProgram"
                            label="Bank Program"
                            name="bankProgram"
                            onChange={(event) => {programInputHandler(event.target.value)}}
                        >

                        {
                            bankProgram.map((program, index) => (
                                <MenuItem key={index} value={index}>{program.Program} - {program.RatesFrom}</MenuItem>
                            ))
                        }

                        </Select>

                    </Grid> : null}


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

                <Button fullWidth  sx={{margin: '20px 0'}} type="submit" variant="contained">Add Bank</Button>

            </form>
        </div>
    )
}

export default AddApprovedBanks
