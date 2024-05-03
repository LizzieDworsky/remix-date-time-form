import { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment-timezone";
import "react-calendar/dist/Calendar.css";

const DateTimeForm = ({}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>(
        moment.tz.guess()
    );

    const handleDateChange = (date: any) => {
        if (date instanceof Date) {
            setSelectedDate(date);
        }
    };

    const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimeZone(e.target.value);
    };

    const timeZones = moment.tz.names();

    return (
        <div>
            <h3>Pick a Date and Time</h3>
            <Calendar
                selectRange={false}
                onChange={(date) => handleDateChange(date)}
                value={selectedDate}
                calendarType="gregory"
            />
            <select
                id="timezone"
                value={selectedTimeZone}
                onChange={handleTimeZoneChange}
            >
                {timeZones.map((zone) => (
                    <option key={zone} value={zone}>
                        {zone}
                    </option>
                ))}
            </select>
            {selectedDate && (
                <h3>
                    Available Starting times for{" "}
                    {moment(selectedDate)
                        .tz(selectedTimeZone)
                        .format("ddd, MMMM D, YYYY")}
                </h3>
            )}
        </div>
    );
};

export default DateTimeForm;
