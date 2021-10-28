import React from 'react';
import { useState, useEffect } from 'react';
import AddApprovedBanks from '../../Components/ApprovedBanks/AddApprovedBanks';
import ListApprovedBanks from '../../Components/ApprovedBanks/ListApprovedBanks/ListApprovedBanks';
import CarSearch from '../../Components/CarSearch/CarSearch';
import toast from 'react-hot-toast';
import axios from 'axios';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { useAuth } from '../../contexts/AuthContext';
 
import Modal from '../../Components/UI/Modal/Modal';
import {omit} from 'lodash';
// import store from 'store';

import store from 'store';

function ApprovedBanks(props) {
    const limit = 25;
    const [newApprovedBankModal, setNewApprovedBankModal] = useState(false);

    const {currentUser} = useAuth();
    
    const [searchResults, setSearchResults] = useState({});

    const [carSearchLoading, setCarSearchLoading] = useState(false);
    const [moreCarSearchLoading, setMoreCarSearchLoading] = useState(false);
    const [isCarEmpty, setIsCarsEmpty] = useState(false);
    const [emailSendLoading, setEmailSendLoading] = useState(false);

    const [carSearchOptions, setCarSearchOptions] = useState({
        customerId: props.customerId,
        profitAmount: 3000,
        adminFee: 700,
        downPayment: 0,
        tradeInValue: 0,
        termExtension: 0,
        interestBreak: 0,

        tradeInAllowance: 0,
        tradeLienAmount: 0,
        warranty: 0,
        docfee: 0
    });

    const carSearchOptionsHandler = (key, value) => {
        setCarSearchOptions({...carSearchOptions, [key]: value});
    }

    const searchResultsHandler = () => {
        toast('Car search started', {
            icon: '🔎'
        });
        setSearchResults({});
        const url = process.env.REACT_APP_API_URL + `/cars/search?limit=${limit}`;
        setCarSearchLoading(true);

        axios.post(url, carSearchOptions).then((result) => {
            console.log(result.data);
            setSearchResults(result.data);
            setCarSearchLoading(false);
        }).catch((err) => {
            setCarSearchLoading(false);
            toast.error("Cannot search, something went wrong!")
            console.log(err);
        })
    }

    const searchMoreResultsHandler = () => {
        const url = process.env.REACT_APP_API_URL + `/cars/search?limit=${limit}&startAfter=${searchResults.lastDocRef}`;
        setMoreCarSearchLoading(true);

        axios.post(url, {
            customerId: props.customerId,
        }).then((result) => {
            const concatedResult = searchResults.result.concat(result.data.result);

            setSearchResults({
                result: concatedResult,
                hasMore: result.data.hasMore,
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

    useEffect(() => {
        if(store.get(`user_${props.customerId}_search_options`)) {
            let storedCarSearchOptions = store.get(`user_${props.customerId}_search_options`);
            setCarSearchOptions({
                ...carSearchOptions,
                profitAmount: storedCarSearchOptions.profitAmount,
                 adminFee: storedCarSearchOptions.adminFee,
                downPayment: storedCarSearchOptions.downPayment,
                tradeInValue: storedCarSearchOptions.tradeInValue,
                termExtension: storedCarSearchOptions.termExtension,
                interestBreak: storedCarSearchOptions.interestBreak,
                tradeInAllowance: storedCarSearchOptions.tradeInAllowance,
                tradeLienAmount: storedCarSearchOptions.tradeLienAmount,
                warranty: storedCarSearchOptions.warranty,
                docfee: storedCarSearchOptions.docfee
            });
        } else {
            store.set(`user_${props.customerId}_search_options`, carSearchOptions)
        }
    }, [])

    useEffect(() => {
        store.set(`user_${props.customerId}_search_options`, carSearchOptions)
    }, [carSearchOptions])

    const [email, setEmail] = useState(null);

    const sendEmail = (e) => {
        console.log(currentUser.email);
        e.preventDefault();

        setEmailSendLoading(true);
        const url = process.env.REACT_APP_API_URL + '/email';
        const body = {
            to: currentUser.email,
            approvedBanks: props.appointment.approvedBanks,
            results: searchResults.result
        }

        toast.promise(
            axios.post(url, body)
            .then(function (response) {
                console.log(response);
                setEmailSendLoading(false);
                setEmail(null);
            })
            .catch(function (error) {
              setEmailSendLoading(false);
              toast.error(`Oops! Something went wrong, cannot send Email`);
              console.log(error);
            }),
             {
               loading: 'Sending email, Please wait ⏳',
               success: <b>Email Sent!</b>,
               error: <b>Oops, Something went wrong. Email not sent</b>,
             }
        );
    }

    return (
        <div>
            <div className="appHeader">
                <h3>Approved Banks</h3>

                <Fab onClick={() => {newApprovedBankModalHandler(true)}}color="primary" aria-label="add">
                <AddIcon />
            </Fab>
            </div>

            {newApprovedBankModal ? 
                <Modal modalCloseHandler={() => {newApprovedBankModalHandler(false)}}>
                    <AddApprovedBanks searchResultsHandler={searchResultsHandler} modalCloseHandler={() => {newApprovedBankModalHandler(false)}} customerId={props.customerId} />
                </Modal> : null
            }
            <ListApprovedBanks searchResultsHandler={searchResultsHandler} customerId={props.customerId} approvedBanks={props.appointment.approvedBanks}/>

            <CarSearch emailSendLoading={emailSendLoading} sendEmail={sendEmail} email={email} setEmail={setEmail} carSearchOptions={carSearchOptions} carSearchOptionsHandler={carSearchOptionsHandler} carSearchLoading={carSearchLoading} searchResults={searchResults} moreCarSearchLoading={moreCarSearchLoading} searchResultsHandler={searchResultsHandler} searchMoreResultsHandler={searchMoreResultsHandler} customerId={props.customerId} approvedBanks={props.appointment.approvedBanks} />
        </div>
    )
}

export default ApprovedBanks
