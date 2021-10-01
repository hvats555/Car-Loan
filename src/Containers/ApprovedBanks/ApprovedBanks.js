import React from 'react';
import { useState } from 'react';
import AddApprovedBanks from '../../Components/ApprovedBanks/AddApprovedBanks';
import ListApprovedBanks from '../../Components/ApprovedBanks/ListApprovedBanks/ListApprovedBanks';
import CarSearch from '../../Components/CarSearch/CarSearch';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Modal from '../../Components/UI/Modal/Modal';
// import store from 'store';

function ApprovedBanks(props) {
    const limit = 25;
    const [newApprovedBankModal, setNewApprovedBankModal] = useState(false);
    
    const [searchResults, setSearchResults] = useState({});

    const [carSearchLoading, setCarSearchLoading] = useState(false);
    const [moreCarSearchLoading, setMoreCarSearchLoading] = useState(false);
    const [isCarEmpty, setIsCarsEmpty] = useState(false);

    const [carSearchOptions, setCarSearchOptions] = useState({
        customerId: props.customerId,
        profitAmount: 3000,
        downPayment: 0,
        tradeInValue: 0,
        termExtension: 0,
        interestBreak: 0
    });

    const carSearchOptionsHandler = (key, value) => {
        setCarSearchOptions({...carSearchOptions, [key]: value});
    }

    const searchResultsHandler = () => {
        const url = process.env.REACT_APP_API_URL + `/cars/search?limit=${limit}`;
        setCarSearchLoading(true);

        axios.post(url, carSearchOptions).then((result) => {
            console.log(result.data);
            setSearchResults(result.data);
            setCarSearchLoading(false);
        }).catch((err) => {
            setCarSearchLoading(false);
            console.log(err);
        })
    }

    const searchMoreResultsHandler = () => {
        const url = process.env.REACT_APP_API_URL + `/cars/search?limit=${limit}&startAfter=${searchResults.lastDocRef}`;
        setMoreCarSearchLoading(true);

        axios.post(url, {
            customerId: props.customerId,
        }).then((result) => {
            console.log("New result: ", result);
            console.log("Old search results: ", searchResults);

            const concatedResult = searchResults.result.concat(result.data.result);

            setSearchResults({
                result: concatedResult,
                lastDocRef: result.data.lastDocRef
            });
            setMoreCarSearchLoading(false);
        }).catch((err) => {
            setMoreCarSearchLoading(false);
            console.log(err);
        })
    }

    const newApprovedBankModalHandler = (state) => {
        setNewApprovedBankModal(state);
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
                    <AddApprovedBanks searchResultsHandler={searchResultsHandler} modalCloseHandler={() => {newApprovedBankModalHandler(false)}} customerId={props.customerId} />
                </Modal> : null
            }
            <ListApprovedBanks searchResultsHandler={searchResultsHandler} customerId={props.customerId} approvedBanks={props.appointment.approvedBanks}/>

            <CarSearch carSearchOptions={carSearchOptions} carSearchOptionsHandler={carSearchOptionsHandler} carSearchLoading={carSearchLoading} searchResults={searchResults} moreCarSearchLoading={moreCarSearchLoading} searchResultsHandler={searchResultsHandler} searchMoreResultsHandler={searchMoreResultsHandler} customerId={props.customerId} approvedBanks={props.appointment.approvedBanks} />
        </div>
    )
}

export default ApprovedBanks
