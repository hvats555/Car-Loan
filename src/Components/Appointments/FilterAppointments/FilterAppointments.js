import React, {useState} from 'react';
import TextField from '@mui/material/TextField';

import todaysDate from '../../../utils/todayDate';

import './FilterAppointments';

function FilterAppointments(props) {
    const [today, setToday] = useState(todaysDate());

    return (
        <div className="filterAppointments">
            <TextField 
              value={today}
              id="outlined-basic" 
              size="small" 
              type="date" 
              onChange={(event) => {props.appointmentFilterHandler(event.target.value); setToday(event.target.value)}}
              placeholder="Appointment Date" />  
        </div>
    )
}

export default FilterAppointments


