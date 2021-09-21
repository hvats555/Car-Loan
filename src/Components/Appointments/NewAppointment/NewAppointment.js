import {useState} from 'react';

import db from '../../../firebase';
import {serverTimestamp} from 'firebase/firestore';
import { query, where, collection, addDoc, getDocs, Timestamp } from "firebase/firestore"; 

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
        appointmentDate: todaysDate()
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
                <input type="text" name="fullName" placeholder="Full Name" value={appointment.fullName} onChange={(event) => {inputChangeHandler("fullName", event.target.value)}} />

                <input type="text" name="phoneNumber" placeholder="Phone Number" value={appointment.phoneNumber} onChange={(event) => {inputChangeHandler("phoneNumber", event.target.value)}} />

                <input type="email" name="email" placeholder="Email" value={appointment.email} onChange={(event) => {inputChangeHandler("email", event.target.value)}}/>

                <label for="isTradeInCheckBox">Is Tradein?</label>

                <input id="isTradeInCheckBox" type="checkbox" name="isTradeIn" checked={appointment.isTradeIn} onChange={(event) => {inputChangeHandler("isTradeIn", event.target.checked)}}/>

                <br />

                <input type="date" name="appointmentDate" min={todaysDate()} 
                onChange={(event) => {inputChangeHandler("appointmentDate", event.target.value)}}
                value={appointment.appointmentDate} placeholder="Appointment Date" />

                <input type="submit" value="Save Appointment"/>
            </form>
        </div>
    )
}

export default NewAppointment
