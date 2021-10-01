import {DateTime} from 'luxon';
import {useState} from 'react';

import db from '../../../firebase';
import { doc, Timestamp, setDoc, getDoc} from "firebase/firestore"; 
import { useEffect } from 'react/cjs/react.development';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

function EditInventory(props) {
    const appointmentInitialState = {
        fullName: '',
        phoneNumber: '',
        email: '',
        isTradeIn: false,
        appointmentDate: ''
    }

    const [appointment, setAppointment] = useState(appointmentInitialState);

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
                isTradeIn: docSnap.data().isTradeIn,
                createdAt: new Date(docSnap.data().createdAt.seconds * 1000).toString(),
                appointmentDate: new Date(docSnap.data().appointmentDate.seconds * 1000).toString(),
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
        // date is converted from YYYY-MM-DD format to firebase timestamp before saving to db
        appointment.appointmentDate = Timestamp.fromDate(new Date(appointment.appointmentDate));

        await setDoc(doc(db, "customers", props.id), appointment);

        // reset appointment state
        setAppointment(appointmentInitialState);
        props.modalCloseHandler();
    }

    const todaysDate = () => {
        return DateTime.now().toFormat('yyyy-MM-dd').toString();
    }

    return (
        <div>
            <h2>Edit Appointment</h2>
            <form onSubmit={(event) => {updateAppointment(event)}}>
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

export default EditInventory
