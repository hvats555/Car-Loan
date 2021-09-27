import React from 'react';

import { useState } from 'react';

import db from '../../../firebase';
import {collection, addDoc, serverTimestamp} from "firebase/firestore"; 
import _ from 'lodash';
import upload from '../../../utils/upload';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

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
            upload({
                file: bank.vehicalBookingGuide,
                endpoint: '/upload',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-upload-collection': 'banks',
                    'x-bankid': bankRes.id
                }
            });
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
                        <input accept=".csv" type="file" name="file" onChange={(event) => {inputChangeHandler("vehicalBookingGuide", event.target.files[0])}}/>
                    </Grid>
                    <Button sx={{marginTop: '20px'}} type="submit" variant="contained">Add bank</Button>
                </Grid>
            </form>
        </div>
    )
}

export default NewBank
