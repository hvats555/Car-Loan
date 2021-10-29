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


    const initialCarSearchOptions = {
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
    }

    const carSearchOptionValiationInitialState = {
        profitAmount: {
            isError: false,
            errorText: ''
        },

        adminFee: {
            isError: false,
            errorText: ''
        },

        downPayment: {
            isError: false,
            errorText: ''
        },

        tradeInValue: {
            isError: false,
            errorText: ''
        },

        termExtension: {
            isError: false,
            errorText: ''
        },

        interestBreak: {
            isError: false,
            errorText: ''
        },

        tradeInAllowance: {
            isError: false,
            errorText: ''
        },

        tradeLienAmount: {
            isError: false,
            errorText: ''
        },

        warranty: {
            isError: false,
            errorText: ''
        },

        docfee: {
            isError: false,
            errorText: ''
        }
    }

    const [carSearchOptions, setCarSearchOptions] = useState(initialCarSearchOptions);

    const [carSearchOptionValiationErrors, setCarSearchOptionValiationErrors] = useState(carSearchOptionValiationInitialState);

    const handleCarSearchOptionValidation = () => {
        const fields = carSearchOptions;
        let errors = {...carSearchOptionValiationErrors};
        let formIsValid = true;
        
        if(fields['profitAmount'] < 0){
          formIsValid = false;
          errors.profitAmount['isError'] = !formIsValid;
          errors.profitAmount['errorText'] = 'Value cannot be negative';
        }

        if(fields['adminFee'] < 0){
            formIsValid = false;
            errors.adminFee['isError'] = !formIsValid;
            errors.adminFee['errorText'] = 'Value cannot be negative';
          }

        if(fields['downPayment'] < 0){
            formIsValid = false;
            errors.downPayment['isError'] = !formIsValid;
            errors.downPayment['errorText'] = 'Value cannot be negative';
        }

        if(fields['tradeInValue'] < 0){
            formIsValid = false;
            errors.tradeInValue['isError'] = !formIsValid;
            errors.tradeInValue['errorText'] = 'Value cannot be negative';
        }

        if(fields['termExtension'] < 0){
            formIsValid = false;
            errors.termExtension['isError'] = !formIsValid;
            errors.termExtension['errorText'] = 'Value cannot be negative';
        }

        if(fields['interestBreak'] < 0){
            formIsValid = false;
            errors.interestBreak['isError'] = !formIsValid;
            errors.interestBreak['errorText'] = 'Value cannot be negative';
        }

        if(fields['tradeInAllowance'] < 0){
            formIsValid = false;
            errors.tradeInAllowance['isError'] = !formIsValid;
            errors.tradeInAllowance['errorText'] = 'Value cannot be negative';
        }

        if(fields['tradeLienAmount'] < 0){
            formIsValid = false;
            errors.tradeLienAmount['isError'] = !formIsValid;
            errors.tradeLienAmount['errorText'] = 'Value cannot be negative';
        }

        if(fields['warranty'] < 0){
            formIsValid = false;
            errors.warranty['isError'] = !formIsValid;
            errors.warranty['errorText'] = 'Value cannot be negative';
        }        
        
        if(fields['docfee'] < 0){
            formIsValid = false;
            errors.docfee['isError'] = !formIsValid;
            errors.docfee['errorText'] = 'Value cannot be negative';
        }
  
        setCarSearchOptionValiationErrors(errors);
        return formIsValid;
      }


    const carSearchOptionsHandler = (key, value) => {
        setCarSearchOptions({...carSearchOptions, [key]: value});
    }

    const searchResultsHandler = () => {
        if(handleCarSearchOptionValidation()) {
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
            setCarSearchOptionValiationErrors(carSearchOptionValiationInitialState);
        }
    }

    const searchMoreResultsHandler = () => {
        if(handleCarSearchOptionValidation()) {
            const url = process.env.REACT_APP_API_URL + `/cars/search?limit=${limit}&startAfter=${searchResults.lastDocRef}`;
            setMoreCarSearchLoading(true);
    
            axios.post(url, carSearchOptions).then((result) => {
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
            setCarSearchOptionValiationErrors(carSearchOptionValiationInitialState);

        }
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

            <CarSearch carSearchValiationErrors={carSearchOptionValiationErrors} emailSendLoading={emailSendLoading} sendEmail={sendEmail} email={email} setEmail={setEmail} carSearchOptions={carSearchOptions} carSearchOptionsHandler={carSearchOptionsHandler} carSearchLoading={carSearchLoading} searchResults={searchResults} moreCarSearchLoading={moreCarSearchLoading} searchResultsHandler={searchResultsHandler} searchMoreResultsHandler={searchMoreResultsHandler} customerId={props.customerId} approvedBanks={props.appointment.approvedBanks} />
        </div>
    )
}

export default ApprovedBanks
