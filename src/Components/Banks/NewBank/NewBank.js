import React from 'react';

import { useState } from 'react';

import db from '../../../firebase';
import {collection, addDoc, serverTimestamp} from "firebase/firestore"; 
import _ from 'lodash';
import upload from '../../../utils/upload';

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
                <input type="text" name="name" placeholder="Bank Name" value={bank.name} onChange={(event) => {inputChangeHandler("name", event.target.value)}}/>

                <input type="file" name="file" onChange={(event) => {inputChangeHandler("vehicalBookingGuide", event.target.files[0])}}/>

                <button type="submit">Add bank</button>
            </form>

        </div>
    )
}

export default NewBank
