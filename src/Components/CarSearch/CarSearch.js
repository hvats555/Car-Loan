import React, {useEffect, useState} from 'react';
import db from '../../firebase';
import { collection, query, where, getDocs,FieldPath, documentId, getDoc, doc } from "firebase/firestore";

const store = require('store');

// Problem Statement -> Prepare car search results for that bank front end after adding the approved bank 


function CarSearch(props) {
    const [cars, setCars] = useState([]);
    const [selectedBankId, setSelectedBankId] = useState();

    const fetchCarSearchResults = async (customerId, bankId) => {
        const tempCarIds = [];
        const q = query(collection(db, "selectedCars"), where('customer', '==', customerId), where('bank', '==', bankId));

        const querySnapshot = await getDocs(q);
        const carsArray = [];

        querySnapshot.forEach((d) => {
            tempCarIds.push(d.data().car);
        });

        for(const tempCarId of tempCarIds) {
            const docRef = doc(db, "carsInventory", tempCarId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                carsArray.push(docSnap.data());
            }
        }

        setCars(carsArray);

        // store restults in local storege for fast access
        store.set(bankId, carsArray);

        console.log(cars);
    }
 
    const inputChangeHandler = (bankId) => {
        if(store.get(bankId)) {
            setCars(store.get(bankId));
        } else {
            fetchCarSearchResults(props.customerId, bankId)
        }
    }

    return (
        <div>
            <h1>Search Reults</h1>

            Results:-

            <select name="bankName" placeholder="Select Banks" onChange={(event) => {
                inputChangeHandler(event.target.value);
                setSelectedBankId(event.target.value);
            }}>
                <option key='0' disabled selected value={null}>Select Bank</option>

                {
                    props.approvedBanks ? props.approvedBanks.map((bank) => (
                        <option key={bank.bankId} value={bank.bankId}>{bank.bankName}</option>
                    )) : <option key='N/A' disabled value="N/A">No banks found</option>
                }
            </select>

            <button onClick={() => {fetchCarSearchResults(props.customerId, selectedBankId)}}>Refresh results</button>


            {cars ? cars.map((car, index) => (
                <p key={index}><strong>({index + 1})</strong>.{car.name}</p>
            )): null}



        </div>
    )
}

export default CarSearch
