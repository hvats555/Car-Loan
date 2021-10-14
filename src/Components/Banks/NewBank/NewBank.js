import React from 'react';

import { useState } from 'react';

import db from '../../../firebase';
import {collection, addDoc, serverTimestamp} from "firebase/firestore"; 
import _ from 'lodash';
import upload from '../../../utils/upload';
import uploadBankInterestFile from '../../../utils/uploadBankInterestFile';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Dropzone from 'react-dropzone';
import toast from 'react-hot-toast';

import './NewBank.css';

function NewBank(props) {
    const bankInitialState = {
        name: '',
        vehicalBookingGuide: null,
        bankInterestFile: null
    }

    const [bank, setBank] = useState(bankInitialState);

    const inputChangeHandler = (key, value) => {
        setBank({...bank, [key]: value})
    }

    const validationInitialState = {
        name: {
            isError: false,
            errorText: ''
        },

        vehicalBookingGuide: {
            isError: false,
            errorText: ''
        },

        bankInterestFile: {
            isError: false,
            errorText: ''
        }
    }

    const [validationErrors, setValidationErrors] = useState(validationInitialState);

    const handleValidation = () => {
        const fields = bank;
        let errors = {...validationErrors};
        let formIsValid = true;
        
        // Cannot be empty
        if(!fields['name']){
          formIsValid = false;
          errors.name['isError'] = !formIsValid;
          errors.name['errorText'] = 'Cannot be empty';
        }
  
        if(!fields['vehicalBookingGuide']){
          formIsValid = false;
          errors.vehicalBookingGuide['isError'] = !formIsValid;
          errors.vehicalBookingGuide['errorText'] = 'Please upload vehical booking guide';
        }

        if(!fields['bankInterestFile']){
            formIsValid = false;
            errors.bankInterestFile['isError'] = !formIsValid;
            errors.bankInterestFile['errorText'] = 'Please upload bank interest file';
          }
    
        setValidationErrors(errors);
        return formIsValid;
      }


    const saveBankInDb = async (event) => {
        event.preventDefault();
        if(handleValidation()) {
            bank.createdAt = serverTimestamp();
            const bankRes = await addDoc(collection(db, "banks"), _.omit(bank, ['vehicalBookingGuide', 'bankInterestFile']));

            if(bank.vehicalBookingGuide) {
                upload(bank.vehicalBookingGuide, bankRes.id);
            }

            if(bank.bankInterestFile) {
                uploadBankInterestFile(bank.bankInterestFile, bankRes.id);
            }
    
            setBank(bankInitialState);
            setValidationErrors(validationInitialState);
            props.modalCloseHandler();

            toast('Bank Successfully Added', {
                icon: '🏦'
            });
        }
    }

    return (
        <div>
            Add a new bank

            <form onSubmit={saveBankInDb}>
                <Grid container rowSpacing={1} columnSpacing={1}>
                    <Grid item xs={12}>
                        <TextField
                        
                        errorState={validationErrors.name.isError}
                        helperText={validationErrors.name.errorText}
                        
                        label="Bank name" fullWidth id="outlined-basic" size="small" type="text" name="name" placeholder="Bank name" value={bank.name} onChange={(event) => {inputChangeHandler("name", event.target.value)}} />
                    </Grid>
                    <Grid item xs={6}>
                        <Dropzone accept=".csv" onDrop={(acceptedFiles) => {setBank({...bank, 'vehicalBookingGuide': acceptedFiles[0]})}}>   
                            {({getRootProps, getInputProps, isDragActive}) => (
                                <section>
                                    <div class="dropZoneBorder" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {
                                            bank.vehicalBookingGuide && !isDragActive ? <p>{bank.vehicalBookingGuide.name}</p> : <p>Drop vehical booking guide here</p>
                                        }
    
                                        {isDragActive ? <p>Drop files here</p>: null}                                   
                                    </div>
                                </section>
                            )}

                        </Dropzone>
                        {validationErrors.vehicalBookingGuide.isError ? 
                         <p>{validationErrors.vehicalBookingGuide.errorText}</p>: null}
                    </Grid>

                    <Grid item xs={6}>
                        <Dropzone accept=".csv" onDrop={(acceptedFiles) => {setBank({...bank, 'bankInterestFile': acceptedFiles[0]})}}>   
                            {({getRootProps, getInputProps, isDragActive}) => (
                                <section>
                                    <div class="dropZoneBorder" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {
                                            bank.bankInterestFile && !isDragActive ? <p>{bank.bankInterestFile.name}</p> : <p>Drop bank interest file here</p>
                                        }
    
                                        {isDragActive ? <p>Drop files here</p>: null}                                   
                                    </div>
                                </section>
                            )}

                        </Dropzone>
                        {validationErrors.bankInterestFile.isError ? 
                         <p>{validationErrors.bankInterestFile.errorText}</p>: null}
                    </Grid>
                    <Button fullWidth sx={{marginTop: '20px'}} type="submit" variant="contained">Add bank</Button>
                </Grid>
            </form>
        </div>
    )
}

export default NewBank
