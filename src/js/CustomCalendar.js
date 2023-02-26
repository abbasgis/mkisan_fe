import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {useSelector} from "react-redux";

function CustomCalendar() {
    const [date, setDate] = useState(new Date());
    const map = useSelector(state => state.map.map);
    const handleChange = (date) => {
        setDate(date);
    };

    return (
        <div>
            <Calendar
                onChange={handleChange}
                value={date}
            />
        </div>
    );
}

export default CustomCalendar;
