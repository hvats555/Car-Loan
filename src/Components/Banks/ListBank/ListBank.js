import React from 'react';
import { useState, useEffect } from 'react';

import db from '../../../firebase';
import { doc, query, where, collection, onSnapshot, orderBy, Timestamp, deleteDoc} from "firebase/firestore"; 

function ListBanks() {
    const [banks, setbanks] = useState([]);
    
    useEffect(() => {
        const fetchBanks = async () => {
            const q = query(collection(db, "banks"), orderBy('createdAt', 'desc'));
            onSnapshot(q, (querySnapshot) => {
                console.log(querySnapshot);
                const banks = [];
                querySnapshot.forEach((doc) => {
                    const object = {
                        id: doc.id,
                        name: doc.data().name
                    }
                    banks.push(object);
                });
                console.log(banks);
                setbanks(banks);
            });
        }

        fetchBanks();

    }, []);

    return (
        <div>
            { 
                banks ? banks.map((bank) => (
                    <div key={bank.id}>
                        <hr />
                        <p><strong>Bank Name:</strong> {bank.name}</p>
                        <hr />
                    </div>
                )) : <p>No banks available</p>
            }
        </div>
    )
}

export default ListBanks
