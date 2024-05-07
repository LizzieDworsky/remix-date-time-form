// Import necessary modules
import { useState } from "react";
import DateTimeForm from "./DateTimeForm";
import UserForm from "./UserForm";
import { DateTimeState } from "../types";

const AppointmentForm = () => {
    const [showDateTimeForm, setShowDateTimeForm] = useState(true);
    const [selectedDateTime, setSelectedDateTime] = useState<DateTimeState>({
        selectedDate: new Date(),
        selectedTime: null,
    });

    // Event Handling Function placeholder to capture and handle form submission.
    const handleFormSubmission = () => {
        console.log(selectedDateTime);
        setShowDateTimeForm(!showDateTimeForm);
    };

    return (
        <div className="appointment-form">
            {showDateTimeForm ? (
                <DateTimeForm
                    selectedDateTime={selectedDateTime}
                    setSelectedDateTime={setSelectedDateTime}
                />
            ) : (
                <UserForm />
            )}
            <button
                className="select-date-time-btn"
                aria-label="Submit the selected date and time for the appointment."
                onClick={handleFormSubmission}
            >
                Select Date
            </button>
        </div>
    );
};

// Export the main component
export default AppointmentForm;
