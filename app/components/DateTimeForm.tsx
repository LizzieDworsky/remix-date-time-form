import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DateTimeForm = ({}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const handleDateChange = (date: any) => {
        if (date instanceof Date) {
            setSelectedDate(date);
        }
    };

    return (
        <div>
            <h3>Pick a Date and Time</h3>
            <Calendar
                selectRange={false}
                onChange={(date) => handleDateChange(date)}
                value={selectedDate}
            />
            {selectedDate && (
                <h3>
                    Available Starting times for{" "}
                    {selectedDate.toLocaleDateString("en-US", options)}
                </h3>
            )}
        </div>
    );
};

export default DateTimeForm;
