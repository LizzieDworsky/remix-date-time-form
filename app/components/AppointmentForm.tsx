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
        selectedTime: "",
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
            {showDateTimeForm ? (
                <button
                    className="submit-forms-btn"
                    aria-label="Submit the selected date and time for the appointment."
                    onClick={() => setShowDateTimeForm(false)}
                >
                    Select Date
                </button>
            ) : null}
        </div>
    );
};

export default AppointmentForm;
