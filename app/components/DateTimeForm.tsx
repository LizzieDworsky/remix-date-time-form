import { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment-timezone";
import "react-calendar/dist/Calendar.css";

// Define types for state objects.
interface DateTimeState {
    selectedDate: Date;
    selectedTime: string | null;
}
interface ShowAllAMPMSlotsState {
    showAllAMSlots: boolean;
    showAllPMSlots: boolean;
}

// Define the DateTimeForm component.
const DateTimeForm = ({}) => {
    // State variables
    const [selectedDateTime, setSelectedDateTime] = useState<DateTimeState>({
        selectedDate: new Date(),
        selectedTime: null,
    });
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>(
        moment.tz.guess()
    );
    const [showAllAMPMSlots, setShowAllAMPMSlots] =
        useState<ShowAllAMPMSlotsState>({
            showAllAMSlots: false,
            showAllPMSlots: false,
        });
    // Initialize today's date for the tileDisabled function.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Function for disabling past dates on React Calendar.
    const tileDisabled = ({ date, view }: any): boolean => {
        if (view === "month") {
            return date < today;
        }
        return false;
    };
    // Event Handling function for changing the date.
    const handleDateChange = (date: Date) => {
        if (date instanceof Date) {
            setSelectedDateTime((previousDateTimeState) => ({
                ...previousDateTimeState,
                selectedDate: date,
                selectedTime: null,
            }));
        }
    };
    // Getting the array of timezones from moment library.
    // Note: this list is a little overwhelming, alternatives should be assessed.
    const timeZones = moment.tz.names();
    // Event Handling function for changing the timezone.
    const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTz = e.target.value;
        if (timeZones.includes(newTz)) {
            setSelectedTimeZone(newTz);
        } else {
            console.error(`Invalid Timezone: ${newTz}`);
        }
    };
    // Event Handling function for changing the time slot.
    const handleTimeSlotSelection = (timeSlot: string) => {
        setSelectedDateTime((previousDateTimeState) => ({
            ...previousDateTimeState,
            selectedTime: timeSlot,
        }));
    };
    // Function to generate time slots every 30 minutes during the business hours.
    const getBusinessHoursSlots = () => {
        const businessOpenET = moment.tz(
            "08:00 AM",
            "hh:mm A",
            "America/New_York"
        );
        const businessCloseET = moment.tz(
            "05:00 PM",
            "hh:mm A",
            "America/New_York"
        );

        const slots = [];
        let currentSlot = businessOpenET.clone().tz(selectedTimeZone);

        while (currentSlot.isBefore(businessCloseET)) {
            slots.push(currentSlot.format("hh:mm A"));
            currentSlot.add(30, "minutes");
        }

        return slots;
    };
    // Function to split time slots into AM and PM arrays.
    const splitTimeSlots = (slots: string[]) => {
        const now = moment().tz(selectedTimeZone);
        const timeSlotsAM: string[] = [];
        const timeSlotsPM: string[] = [];
        slots.forEach((slot) => {
            const slotTime = moment.tz(
                `${moment(selectedDateTime.selectedDate).format(
                    "YYYY-MM-DD"
                )} ${slot}`,
                "YYYY-MM-DD hh:mm A",
                selectedTimeZone
            );
            if (slotTime.isAfter(now)) {
                if (slot.includes("AM")) {
                    timeSlotsAM.push(slot);
                } else if (slot.includes("PM")) {
                    timeSlotsPM.push(slot);
                }
            }
        });
        return { timeSlotsAM, timeSlotsPM };
    };

    // Get available time slots.
    const availableSlots = getBusinessHoursSlots();
    const { timeSlotsAM, timeSlotsPM } = splitTimeSlots(availableSlots);
    // Function to map time slots to buttons for UI.
    const mapTimeSlots = (timeSlotArr: string[]) => {
        return timeSlotArr.map((slot) => {
            const isSelected = selectedDateTime.selectedTime === slot;
            const buttonClass = `time-slot-button ${
                isSelected ? "active-time-slot" : ""
            }`;
            return (
                <button
                    className={buttonClass}
                    key={slot}
                    onClick={() => handleTimeSlotSelection(slot)}
                    aria-label={`Select ${slot} as the starting time.`}
                >
                    {slot}
                </button>
            );
        });
    };
    // Function to render Show More/Show Less button
    const showMoreLessBtn = (timeSlotArrLength: number, amPm: string) => {
        const showAll =
            amPm === "AM"
                ? showAllAMPMSlots.showAllAMSlots
                : showAllAMPMSlots.showAllPMSlots;

        const setAMPM = () => {
            setShowAllAMPMSlots((prevState) => ({
                ...prevState,
                showAllAMSlots:
                    amPm === "AM"
                        ? !prevState.showAllAMSlots
                        : prevState.showAllAMSlots,
                showAllPMSlots:
                    amPm === "PM"
                        ? !prevState.showAllPMSlots
                        : prevState.showAllPMSlots,
            }));
        };

        return (
            timeSlotArrLength > 6 && (
                <button
                    className="show-more-less-btn"
                    aria-label={`Toggle display of ${amPm} time slots.`}
                    onClick={() => setAMPM()}
                >
                    {showAll ? "Show Less" : "Show More"}
                </button>
            )
        );
    };
    // Event Handling Function placeholder to capture and handle form submission.
    const handleFormSubmission = () => {
        console.log(selectedDateTime);
    };
    // Return JSX for DateTimeForm component.
    return (
        <div className="date-time-form">
            <div className="date-time-content">
                <div>
                    <h3>Pick a Date and Time</h3>
                    <div className="calendar-container">
                        <Calendar
                            tileDisabled={tileDisabled}
                            selectRange={false}
                            onChange={(date) => handleDateChange(date as Date)}
                            value={selectedDateTime.selectedDate}
                            calendarType="gregory"
                            aria-label="Calendar to select appointment date."
                        />
                        <label htmlFor="timezone">Change Timezone:</label>
                        <select
                            id="timezone"
                            value={selectedTimeZone}
                            onChange={handleTimeZoneChange}
                            aria-label="Select your timezone."
                        >
                            {timeZones.map((zone) => (
                                <option key={zone} value={zone}>
                                    {zone}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="time-slots-container">
                    {selectedDateTime.selectedDate && (
                        <h3>
                            Available Starting times for{" "}
                            {moment(selectedDateTime.selectedDate)
                                .tz(selectedTimeZone)
                                .format("ddd, MMMM D, YYYY")}
                        </h3>
                    )}
                    <div className="time-slots-columns">
                        <div className="time-slot">
                            <h4>AM</h4>
                            <div
                                className={`slot-container ${
                                    showAllAMPMSlots.showAllAMSlots
                                        ? "expanded"
                                        : "collapsed"
                                }`}
                            >
                                {/* Add "scrollable" class for scrolling implementation. */}

                                {timeSlotsAM.length > 0 ? (
                                    mapTimeSlots(timeSlotsAM)
                                ) : (
                                    <p className="no-slots-p">
                                        No AM times available.
                                    </p>
                                )}
                            </div>
                            {showMoreLessBtn(timeSlotsAM.length, "AM")}
                        </div>
                        <div className="time-slot">
                            <h4>PM</h4>
                            <div
                                className={`slot-container ${
                                    showAllAMPMSlots.showAllPMSlots
                                        ? "expanded"
                                        : "collapsed"
                                }`}
                            >
                                {/* Add "scrollable" class for scrolling implementation. */}
                                {timeSlotsPM.length > 0 ? (
                                    mapTimeSlots(timeSlotsPM)
                                ) : (
                                    <p className="no-slots-p">
                                        No PM times available.
                                    </p>
                                )}
                            </div>
                            {showMoreLessBtn(timeSlotsPM.length, "PM")}
                        </div>
                    </div>
                </div>
            </div>
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

export default DateTimeForm;
