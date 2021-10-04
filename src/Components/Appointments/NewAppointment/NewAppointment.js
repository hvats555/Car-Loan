import {useState} from 'react';

import db from '../../../firebase';
import {serverTimestamp} from 'firebase/firestore';
import {collection, addDoc, Timestamp } from "firebase/firestore"; 
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import dayjs from 'dayjs';

import validateEmail from '../../../utils/validateEmail';

import './NewAppointment.css';

function NewAppointment(props) {
    const todaysDate = () => {
        return dayjs().format('YYYY-MM-DD');
    }

    const appointmentInitialState = {
        fullName: '',
        phoneNumber: '',
        email: '',
        taxExemption: false,
        appointmentDate: todaysDate(),
        approvedBanks: []
    }

    const validationInitialState = {
        fullName: {
            isError: false,
            errorText: ''
        },
        phoneNumber: {
            isError: false,
            errorText: ''
        },
        email: {
            isError: false,
            errorText: ''
        },

        appointmentDate: {
            isError: false,
            errorText: ''
        }
    }

    const [appointment, setAppointment] = useState(appointmentInitialState);
    const [validationErrors, setValidationErrors] = useState(validationInitialState);

      const handleValidation = () => {
        const fields = appointment;
        let errors = {...validationErrors};
        let formIsValid = true;
        
        // Cannot be empty
        if(!fields['fullName']){
          formIsValid = false;
          errors.fullName['isError'] = !formIsValid;
          errors.fullName['errorText'] = 'Cannot be empty';
        }
  
        if(fields['phoneNumber']){
            if(fields['phoneNumber'].length != 10)
            formIsValid = false;
            errors.phoneNumber['isError'] = !formIsValid;
            errors.phoneNumber['errorText'] = 'Phone number must be of 10 digits';
          }

        if(!fields['appointmentDate']){
            formIsValid = false;
            errors.appointmentDate['isError'] = !formIsValid;
            errors.appointmentDate['errorText'] = 'Cannot be empty';
        }
    
        setValidationErrors(errors);
        return formIsValid;
      }

    const inputChangeHandler = (key, value) => {
        setAppointment({...appointment, [key]: value})
    }

    const saveAppointmentInDb = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            appointment.createdAt = serverTimestamp();
            appointment.appointmentDate = Timestamp.fromDate(new Date(appointment.appointmentDate));
    
            await addDoc(collection(db, "customers"), appointment);
    
            setAppointment(appointmentInitialState);
            setValidationErrors(validationInitialState);
            props.modalCloseHandler();
        }
    }

    return (
        <div className="newAppointment">
            <h2>Add Credit Application</h2>
            <form onSubmit={(event) => {saveAppointmentInDb(event)}}>

            <Grid container spacing={1} rowSpacing={{xs: 1}}>
                <Grid item md={6} xs={12}>
                    <TextField
                    errorState={validationErrors.fullName.isError}
                    helperText={validationErrors.fullName.errorText}

                    fullWidth id="outlined-basic" size="small" type="text" name="fullName" placeholder="Full Name" value={appointment.fullName} onChange={(event) => {inputChangeHandler("fullName", event.target.value)}} />
                </Grid>

                <Grid item md={6} xs={12}>
                    <TextField
                    type="number"
                    errorState={validationErrors.phoneNumber.isError}
                    helperText={validationErrors.phoneNumber.errorText}

                    fullWidth id="outlined-basic" size="small" name="phoneNumber" placeholder="Phone Number (Optional)" value={appointment.phoneNumber} onChange={(event) => {inputChangeHandler("phoneNumber", event.target.value)}} />
                </Grid>

                <Grid item md={6} xs={12}>
                    <TextField
                    
                    errorState={validationErrors.email.isError}
                    helperText={validationErrors.email.errorText}

                    fullWidth id="outlined-basic" size="small" type="email" name="email" placeholder="Email (Optional)" value={appointment.email} onChange={(event) => {inputChangeHandler("email", event.target.value)}}/>            
                </Grid>
                
                <Grid sx={{marginTop: '.5rem'}} md={6} xs={12}>
                    <TextField 

                    errorState={validationErrors.appointmentDate.isError}
                    helperText={validationErrors.appointmentDate.errorText}
                    fullWidth
                    id="outlined-basic" 
                    size="small" 
                    type="date" 
                    name="appointmentDate" 
                    min={todaysDate()} 
                    onChange={(event) => {
                        inputChangeHandler("appointmentDate", event.target.value)
                    }}
                    value={appointment.appointmentDate} placeholder="Appointment Date" />            
                </Grid>

                <Grid fullWidth item md={6} xs={12}>
                    <FormControlLabel control={<Checkbox onChange={(event) => {inputChangeHandler("taxExemption", event.target.checked)
                    }}/>} label="Tax Exempt" />  
                </Grid>
                
            </Grid>
            <Button fullWidth sx={{marginTop: '20px'}} type="submit" variant="contained">Save</Button>
            </form>
        </div>
    )
}

export default NewAppointment
