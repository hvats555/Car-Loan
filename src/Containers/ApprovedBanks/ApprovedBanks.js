import React from 'react';
import { useState } from 'react';
import AddApprovedBanks from '../../Components/ApprovedBanks/AddApprovedBanks';
import ListApprovedBanks from '../../Components/ApprovedBanks/ListApprovedBanks/ListApprovedBanks';
import CarSearch from '../../Components/CarSearch/CarSearch';

import { collection, query, where, getDocs,FieldPath, documentId, getDoc, doc, limit, document, startAfter, orderBy } from "firebase/firestore";
import db from '../../firebase';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Modal from '../../Components/UI/Modal/Modal';
// import store from 'store';

function ApprovedBanks(props) {
    const [newApprovedBankModal, setNewApprovedBankModal] = useState(false);
    const [lastVisibleDocument, setLastVisibleDocument] = useState({});
    const [cars, setCars] = useState([]);
    const [carSearchLoading, setCarSearchLoading] = useState(false);
    const [moreCarSearchLoading, setMoreCarSearchLoading] = useState(false);
    const [isCarEmpty, setIsCarsEmpty] = useState(false);

    const carStateHandler = (value) => {
        setCars(value);
    }

    const newApprovedBankModalHandler = (state) => {
        setNewApprovedBankModal(state);
    }

    const fetchCarSearchResults = async (customerId, bankId) => {
        const tempCarIds = [];
        console.log("fetching car search results ...")
        setCarSearchLoading(true);

        const q = query(collection(db, "selectedCars"), where('customer', '==', customerId), where('bank', '==', bankId), orderBy('calculatedEmi'), limit(2));

        const querySnapshot = await getDocs(q);

        if(querySnapshot.size === 0) {
            setIsCarsEmpty(true);
        }

        // Get the last visible document
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
        setLastVisibleDocument(lastVisible);        
        // get 25 at once
        // get last doc refrence -> save in state

        const carsArray = [];

        querySnapshot.forEach((d) => {
            tempCarIds.push({car: d.data().car, calculatedEmi: d.data().calculatedEmi});
        });

        for(const tempCarId of tempCarIds) {
            const docRef = doc(db, "carsInventory", tempCarId.car);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                carsArray.push({details: docSnap.data(), calculatedEmi: tempCarId.calculatedEmi});
            }
        }

        setCars(carsArray);

        // if(store.get(bankId)) {
        //     store.remove(bankId);
        // } 

        // store.set(bankId, carsArray);

        setCarSearchLoading(false);
        console.log("Finished Car search resuls");
    }

    const fetchMoreCarSearchResults = async (customerId, bankId) => {
        setMoreCarSearchLoading(true);
        const tempCarIds = [];
        console.log("fetching more car search results ...")

        const q = query(collection(db, "selectedCars"), where('customer', '==', customerId), where('bank', '==', bankId), orderBy('calculatedEmi'), limit(25), startAfter(lastVisibleDocument));

        const querySnapshot = await getDocs(q);

        if(querySnapshot.size === 0) {
            setIsCarsEmpty(true);
        }

        // Get the last visible document
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
        setLastVisibleDocument(lastVisible);    

        const carsArray = [];

        querySnapshot.forEach((d) => {
            tempCarIds.push({car: d.data().car, calculatedEmi: d.data().calculatedEmi});
        });

        for(const tempCarId of tempCarIds) {
            const docRef = doc(db, "carsInventory", tempCarId.car);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                carsArray.push({details: docSnap.data(), calculatedEmi: tempCarId.calculatedEmi});
            }
        }

        const newCarArray = cars.concat(carsArray);
        setCars(newCarArray);

        // if(store.get(bankId)) {
        //     store.remove(bankId);
        // } 

        // store.set(bankId, carsArray);
        console.log("Finished more Car search resuls");
        setMoreCarSearchLoading(false);
    }

    return (
        <div>
            <Grid sx={{alignItems: 'center'}} className="appointmentSingle__info-container" container spacing={2}>
                <Grid item xs={10}>   
                    <h3>Approved Banks</h3>
                </Grid>

                <Grid item xs={2}>              
                    <Button variant="contained" size="small" onClick={() => {newApprovedBankModalHandler(true)}}>Add New</Button>
                </Grid>
            </Grid>

            {newApprovedBankModal ? 
                <Modal modalCloseHandler={() => {newApprovedBankModalHandler(false)}}>
                    <AddApprovedBanks modalCloseHandler={() => {newApprovedBankModalHandler(false)}} customerId={props.customerId} />
                </Modal> : null
            }
            <ListApprovedBanks fetchCarSearchResults={fetchCarSearchResults} setCars={carStateHandler} customerId={props.customerId} approvedBanks={props.appointment.approvedBanks}/>

            <CarSearch moreCarSearchLoading={moreCarSearchLoading} isCarEmpty={isCarEmpty} fetchMoreCarSearchResults={fetchMoreCarSearchResults} carSearchLoading={carSearchLoading} fetchCarSearchResults={fetchCarSearchResults} cars={cars} setCars={carStateHandler} customerId={props.customerId} approvedBanks={props.appointment.approvedBanks} />
        </div>
    )
}

export default ApprovedBanks
