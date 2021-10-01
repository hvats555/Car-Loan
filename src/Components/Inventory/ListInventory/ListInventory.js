// TODO: Default list: update and delete view Inventory
import React from 'react';
import {useState, useEffect} from 'react';
import db from '../../../firebase';
import { doc, query, where, collection, onSnapshot, orderBy, Timestamp, deleteDoc} from "firebase/firestore"; 

import {Link} from 'react-router-dom';

import Modal from '../../UI/Modal/Modal';
import EditInventory from '../EditInventory/EditInventory';
import ConfirmationPrompt from '../../ConfirmationPrompt/ConfirmationPrompt';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import './ListInventory.css';

var _ = require('lodash');

function ListInventory() {
    const [Inventory, setInventory] = useState([]);
    
    const q = query(collection(db, "inventory"));
    
    useEffect(() => {
        const fetchInventory = async () => {
            onSnapshot(q, (querySnapshot) => {
                const Inventory = [];
    
                querySnapshot.forEach((doc) => {
                    const object = {
                        id: doc.id,
                        name: doc.data().name,
                        url: doc.data().car_URL,
                        make: doc.data().make,
                        mileage: doc.data().mileage,
                        cost: doc.data().cost
                    }
                    Inventory.push(object);
                });
                setInventory(Inventory);
            });
        }

        fetchInventory();

    }, []);

    return (
        <div className="listInventory">
            <div className="listInventory__head">
                <h2>Inventory</h2>
            </div>

            {!_.isUndefined(Inventory) && Inventory.length > 0 ? <Table size="medium">
                <TableHead>
                    <TableRow >
                        <TableCell>Name</TableCell>
                        <TableCell>Make</TableCell>
                        <TableCell>Mileage</TableCell>
                        <TableCell>Cost</TableCell>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                {Inventory.map((Inventory, index) => (
                    <TableRow className="listInventory__table-row" key={index} >
                            <TableCell>{Inventory.name}</TableCell>
                            <TableCell>{Inventory.make}</TableCell>
                            <TableCell>{Inventory.mileage}</TableCell>
                            <TableCell>{Inventory.cost}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>: <p>Nothing found in inventory</p>}
        </div>
    )
}

export default ListInventory
