import React from 'react';

import { useState } from 'react';

import db from '../../../firebase';
import {collection, addDoc, serverTimestamp} from "firebase/firestore"; 
import _ from 'lodash';
import upload from '../../../utils/upload';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Dropzone from 'react-dropzone'

import './NewBank.css';

function NewBank(props) {
    const bankInitialState = {
        name: '',
        vehicalBookingGuide: null
    }

    const [bank, setBank] = useState(bankInitialState);

    const inputChangeHandler = (key, value) => {
        setBank({...bank, [key]: value})
    }

    const saveBankInDb = async (event) => {
        event.preventDefault();

        bank.createdAt = serverTimestamp();

        const bankRes = await addDoc(collection(db, "banks"), _.omit(bank, ['vehicalBookingGuide']));

        if(bank.vehicalBookingGuide) {
            upload(bank.vehicalBookingGuide, bankRes.id);
        }

        // reset appointment state
        setBank(bankInitialState);
        props.modalCloseHandler();
    }

    return (
        <div>
            Add a new bank

            <form onSubmit={saveBankInDb}>
                <Grid container rowSpacing={1}>
                    <Grid item xs={12}>
                        <TextField label="Bank name" fullWidth id="outlined-basic" size="small" type="text" name="name" placeholder="Bank name" value={bank.name} onChange={(event) => {inputChangeHandler("name", event.target.value)}} />
                    </Grid>
                    <Grid item xs={12}>
                        <Dropzone accept=".csv" onDrop={(acceptedFiles) => {setBank({"vehicalBookingGuide": acceptedFiles[0]})}}>   
                            {({getRootProps, getInputProps, isDragActive}) => (
                                <section>
                                    <div class="dropZoneBorder" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {
                                            bank.vehicalBookingGuide && !isDragActive ? <p>{bank.vehicalBookingGuide.name}</p> : <p>Drag 'n' drop some files here, or click to select files</p>
                                        }
    
                                        {isDragActive ? <p>Drop files here</p>: null}                                   
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </Grid>
                    <Button sx={{marginTop: '20px'}} type="submit" variant="contained">Add bank</Button>
                </Grid>
            </form>
        </div>
    )
}

export default NewBank
