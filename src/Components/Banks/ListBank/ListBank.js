import React from 'react';
import { useState, useEffect } from 'react';

import db from '../../../firebase';
import { query, collection, onSnapshot, orderBy} from "firebase/firestore"; 

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
            {banks ? <Table size="medium">
                <TableHead>
                    <TableRow >
                        <TableCell><strong>Bank Name</strong></TableCell>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                { banks ? banks.map((bank) => (
                    <TableRow>
                        <TableCell key={bank.id}>{bank.name}</TableCell>
                    </TableRow>
                    )) : <p>No banks available</p>
                }
                </TableBody>
            </Table>: <p>No Appointments found on this date, feel free to create one</p>}
        </div>
    )
}

export default ListBanks
