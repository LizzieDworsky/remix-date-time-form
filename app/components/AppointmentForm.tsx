// Import necessary modules
import { useState } from "react";
import DateTimeForm from "./DateTimeForm";
import UserForm from "./UserForm";
import { DateTimeState } from "../types";
import moment from "moment-timezone";

const AppointmentForm = () => {
    const [showDateTimeForm, setShowDateTimeForm] = useState(true);
    const [selectedDateTime, setSelectedDateTime] = useState<DateTimeState>({
        selectedDate: new Date(),
        selectedTime: null,
        selectedTimeZone: moment.tz.guess(),
    });

    return (
        <div className="appointment-form">
            {showDateTimeForm ? (
                <DateTimeForm
                    selectedDateTime={selectedDateTime}
                    setSelectedDateTime={setSelectedDateTime}
                />
            ) : (
                <UserForm
                    selectedDateTime={selectedDateTime}
                    setShowDateTimeForm={setShowDateTimeForm}
                />
            )}
            <button
                className="select-date-time-btn"
                aria-label="Submit the selected date and time for the appointment."
                onClick={() => setShowDateTimeForm(false)}
            >
                Select Date
            </button>
        </div>
    );
};

export default AppointmentForm;
