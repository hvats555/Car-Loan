import {useState} from 'react';

import db from '../../../firebase';
import {serverTimestamp} from 'firebase/firestore';
import {collection, addDoc, Timestamp } from "firebase/firestore"; 
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import dayjs from 'dayjs';

function NewAppointment(props) {
    const todaysDate = () => {
        return dayjs().format('YYYY-MM-DD');
    }

    const appointmentInitialState = {
        fullName: '',
        phoneNumber: '',
        email: '',
        isTradeIn: false,
        appointmentDate: todaysDate(),
        approvedBanks: []
    }

    const [appointment, setAppointment] = useState(appointmentInitialState);

    const inputChangeHandler = (key, value) => {
        setAppointment({...appointment, [key]: value})
    }

    const saveAppointmentInDb = async (event) => {
        event.preventDefault();

        // const q = query(collection(db, "customers"), where("email", "==", appointment.email));
        // const querySnapshot = await getDocs(q);

        // ! for development only
        // if(!_.isUndefined(querySnapshot.doc)) {
        if(true){
            appointment.createdAt = serverTimestamp();
            // date is converted from YYYY-MM-DD format to firebase timestamp before saving to db
            appointment.appointmentDate = Timestamp.fromDate(new Date(appointment.appointmentDate));

            await addDoc(collection(db, "customers"), appointment);
        } else {
            console.log("Customer with email already exist in database");
        }

        // reset appointment state
        setAppointment(appointmentInitialState);
        props.modalCloseHandler();
    }

    return (
        <div>
            <h2>Create New Appointment</h2>
            <form onSubmit={(event) => {saveAppointmentInDb(event)}}>

            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField fullWidth id="outlined-basic" size="small" type="text" name="fullName" placeholder="Full Name" value={appointment.fullName} onChange={(event) => {inputChangeHandler("fullName", event.target.value)}} />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth id="outlined-basic" size="small" type="text" name="phoneNumber" placeholder="Phone Number" value={appointment.phoneNumber} onChange={(event) => {inputChangeHandler("phoneNumber", event.target.value)}} />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth id="outlined-basic" size="small" type="email" name="email" placeholder="Email" value={appointment.email} onChange={(event) => {inputChangeHandler("email", event.target.value)}}/>            
                </Grid>
                
                <Grid fullWidth item xs={6}>
                    <TextField 
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
            </Grid>
            <Button sx={{marginTop: '20px'}} type="submit" variant="contained">Save Appointment</Button>
            </form>
        </div>
    )
}

export default NewAppointment
