import { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment-timezone";
import "react-calendar/dist/Calendar.css";

const DateTimeForm = ({}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>(
        moment.tz.guess()
    );
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
        null
    );
    const [isInitialSlot, setIsInitialSlot] = useState<boolean>(true);

    const handleDateChange = (date: any) => {
        if (date instanceof Date) {
            setSelectedDate(date);
            setSelectedTimeSlot(null);
        }
    };

    const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimeZone(e.target.value);
    };
    const timeZones = moment.tz.names();

    const handleTimeSlotSelection = (timeSlot: string) => {
        setSelectedTimeSlot(timeSlot);
    };
    const togglePMView = () => {
        setIsInitialSlot(!isInitialSlot);
    };

    const timeSlotsAM = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
    ];
    const timeSlotsPMInitial = [
        "12:00 PM",
        "12:30 PM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM",
    ];
    const timeSlotsPMTwo = [
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
        "04:30 PM",
    ];
    const timeSlotsPM = isInitialSlot ? timeSlotsPMInitial : timeSlotsPMTwo;

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
            <div>
                <h4>AM</h4>
                {timeSlotsAM.map((slot) => (
                    <button
                        key={slot}
                        onClick={() => handleTimeSlotSelection(slot)}
                    >
                        {slot}
                    </button>
                ))}
                <a href="#">
                    <p>Load More</p>
                </a>
                <h4>PM</h4>
                {timeSlotsPM.map((slot) => (
                    <button
                        key={slot}
                        onClick={() => handleTimeSlotSelection(slot)}
                    >
                        {slot}
                    </button>
                ))}
                <a href="#" onClick={togglePMView}>
                    <p>Load More</p>
                </a>
            </div>
            <button>Select Date</button>
        </div>
    );
};

export default DateTimeForm;
