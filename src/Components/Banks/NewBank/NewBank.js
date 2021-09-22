import React from 'react';
import { useState } from 'react';

import db from '../../../firebase';
import {collection, addDoc, serverTimestamp} from "firebase/firestore"; 


function NewBank(props) {
    const bankInitialState = {
        name: ''
    }

    const [bank, setBank] = useState(bankInitialState);

    const inputChangeHandler = (key, value) => {
        setBank({...bank, [key]: value})
    }

    const saveBankInDb = async (event) => {
        event.preventDefault();

        bank.createdAt = serverTimestamp();

        await addDoc(collection(db, "banks"), bank);

        // reset appointment state
        setBank(bankInitialState);
        props.modalCloseHandler();
    }

    return (
        <div>
            Add a new bank

            <form onSubmit={saveBankInDb}>    
                <input type="text" name="name" placeholder="Bank Name" value={bank.name} onChange={(event) => {inputChangeHandler("name", event.target.value)}}/>

                <button type="submit">Add bank</button>
            </form>
        </div>
    )
}

export default NewBank
