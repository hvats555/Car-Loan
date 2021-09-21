import React from 'react';

function FilterAppointments(props) {
    return (
        <div>
            Filter Appointments: <input type="date" onChange={(event) => {props.appointmentFilterHandler(event.target.value)}}/>
        </div>
    )
}

export default FilterAppointments
