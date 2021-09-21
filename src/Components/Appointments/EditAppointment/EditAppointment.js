import {DateTime} from 'luxon';
import {useState} from 'react';

import db from '../../../firebase';
import { doc, Timestamp, setDoc, getDoc} from "firebase/firestore"; 
import { useEffect } from 'react/cjs/react.development';

import dayjs from 'dayjs';

function EditAppointment(props) {
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
                <input type="text" name="fullName" placeholder="Full Name" value={appointment.fullName} onChange={(event) => {inputChangeHandler("fullName", event.target.value)}} />

                <input type="text" name="phoneNumber" placeholder="Phone Number" value={appointment.phoneNumber} onChange={(event) => {inputChangeHandler("phoneNumber", event.target.value)}} />

                <input type="email" name="email" placeholder="Email" value={appointment.email} onChange={(event) => {inputChangeHandler("email", event.target.value)}}/>

                <label for="isTradeInCheckBox">Is Tradein?</label>

                <input id="isTradeInCheckBox" type="checkbox" name="isTradeIn" checked={appointment.isTradeIn} onChange={(event) => {inputChangeHandler("isTradeIn", event.target.checked)}}/>

                <br />

                <input 
                type="date" 
                name="appointmentDate" 
                min={todaysDate()} 
                onChange={(event) => {inputChangeHandler("appointmentDate", event.target.value)}} value={dayjs(appointment.appointmentDate).format('YYYY-MM-DD')} placeholder="Appointment Date" />

                <input type="submit" value="Save Appointment"/>
            </form>
        </div>
    )
}

export default EditAppointment
