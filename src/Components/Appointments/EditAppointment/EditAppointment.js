import {DateTime} from 'luxon';
import {useState} from 'react';

import db from '../../../firebase';
import { doc, Timestamp, setDoc, getDoc} from "firebase/firestore"; 
import { useEffect } from 'react/cjs/react.development';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import toast from 'react-hot-toast';

function EditAppointment(props) {
    const appointmentInitialState = {
        fullName: '',
        phoneNumber: '',
        email: '',
        appointmentDate: '',
        taxExemption: false
    }

    const [appointment, setAppointment] = useState(appointmentInitialState);

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

        // if(!fields['phoneNumber']){
        //     formIsValid = false;
        //     errors.phoneNumber['isError'] = !formIsValid;
        //     errors.phoneNumber['errorText'] = 'Cannot be empty';
        // }

        if(fields['phoneNumber']){
            if(fields['phoneNumber'].toString().length !== 10)
            formIsValid = false;
            errors.phoneNumber['isError'] = !formIsValid;
            errors.phoneNumber['errorText'] = 'Phone number must be of 10 digits';
        }

        // if(!fields['email']){
        //     formIsValid = false;
        //     errors.email['isError'] = !formIsValid;
        //     errors.email['errorText'] = 'Cannot be empty';
        // }

        if(!fields['appointmentDate']){
            formIsValid = false;
            errors.appointmentDate['isError'] = !formIsValid;
            errors.appointmentDate['errorText'] = 'Cannot be empty';
        }

        setValidationErrors(errors);
        return formIsValid;
    }

    useEffect(() => {
        const fetchAppointments = async (id) => {
            const docRef = doc(db, "customers", id);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
            setAppointment({
                id: docSnap.id,
                fullName: docSnap.data().fullName,
                phoneNumber: docSnap.data().phoneNumber,
                email: docSnap.data().email,
                taxExemption: docSnap.data().taxExemption.toString(),
                createdAt: new Date(docSnap.data().createdAt.seconds * 1000).toString(),
                appointmentDate: new Date(docSnap.data().appointmentDate.seconds * 1000).toString()
            })
    
            } else {
                console.log("No such document!");
            }
        }

        fetchAppointments(props.id);
    }, []);

    const inputChangeHandler = (key, value) => {
        setAppointment({...appointment, [key]: value})
    }

    const updateAppointment = async (event) => {
        event.preventDefault();

        if(handleValidation()){
            appointment.appointmentDate = Timestamp.fromDate(new Date(appointment.appointmentDate));
            await setDoc(doc(db, "customers", props.id), appointment);
            setAppointment(appointmentInitialState);
            setValidationErrors(validationInitialState);
            props.modalCloseHandler();
            toast.success("Application updated");
        }
    }

    const todaysDate = () => {
        return DateTime.now().toFormat('yyyy-MM-dd').toString();
    }

    return (
        <div>
            <h2>Edit Credit Application</h2>
            <form onSubmit={(event) => {updateAppointment(event)}}>
                <Grid container spacing={1} rowSpacing={{xs: 1}}>
                    <Grid item md={6} xs={12}>
                        <TextField 
                        errorState={validationErrors.fullName.isError}
                        helperText={validationErrors.fullName.errorText}
                        fullWidth id="outlined-basic" size="small" type="text" name="fullName" placeholder="Full Name" value={appointment.fullName} onChange={(event) => {inputChangeHandler("fullName", event.target.value)}} />
                    </Grid>

                    <Grid item md={6} xs={12}>
                        <TextField 
                        errorState={validationErrors.phoneNumber.isError}
                        helperText={validationErrors.phoneNumber.errorText}
                        fullWidth id="outlined-basic" size="small" type="text" name="phoneNumber" placeholder="Phone Number (Optional)" value={appointment.phoneNumber} onChange={(event) => {inputChangeHandler("phoneNumber", event.target.value)}} />
                    </Grid>

                    <Grid item md={6} xs={12}>
                        <TextField 
                        errorState={validationErrors.email.isError}
                        helperText={validationErrors.email.errorText}
                        fullWidth id="outlined-basic" size="small" type="email" name="email" placeholder="Email (Optional)" value={appointment.email} onChange={(event) => {inputChangeHandler("email", event.target.value)}}/>            
                    </Grid>
                    
                    <Grid fullWidth item md={6} xs={12}>
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
                        <FormControlLabel control={<Checkbox checked={appointment.taxExemption} onChange={(event) => {inputChangeHandler("taxExemption", event.target.checked)
                        }}/>} label="Tax Exempt" />  
                    </Grid>
                </Grid>
                 <Button fullWidth sx={{marginTop: '20px'}} type="submit" variant="contained">Save</Button>
            </form>
        </div>
    )
}

export default EditAppointment
