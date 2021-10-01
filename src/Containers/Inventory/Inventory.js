import React from 'react';
import {useState} from 'react';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import NewInventory from '../../Components/Inventory/NewInventory/NewInventory';
import ListInventory from '../../Components/Inventory/ListInventory/ListInventory';

import Modal from '../../Components/UI/Modal/Modal';

import './Inventory.css';

function Inventory() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const modalCloseHandler = () => {
        setIsModalOpen(false);
    }

    const modalOpenHandler = () => {
        setIsModalOpen(true);
    }   

    return (
        <div className="Inventory">

            <Fab className="createButton" onClick={modalOpenHandler} color="primary" aria-label="add">
                <AddIcon />
            </Fab>

            {isModalOpen ? 
            <Modal modalCloseHandler={modalCloseHandler}>
                <NewInventory modalCloseHandler={modalCloseHandler} />
            </Modal> : null}

            <ListInventory />
        </div>

    )
}

export default Inventory
