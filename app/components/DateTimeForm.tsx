import { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment-timezone";
import "react-calendar/dist/Calendar.css";

/**
 * Interface for the state representing date and time.
 */
interface DateTimeState {
    selectedDate: Date;
    selectedTime: string | null;
}
/**
 * Interface for the state representing the visibility of AM and PM time slots.
 */
interface ShowAllAMPMSlotsState {
    showAllAMSlots: boolean;
    showAllPMSlots: boolean;
}

/**
 * Component for selecting date and time.
 * @param props - Component properties (none in this case).
 * @returns JSX element representing the DateTimeForm.
 */
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

    // Initialize Variables

    // Getting the array of timezones from moment library.
    // Note: this list is a little overwhelming, alternatives should be assessed.
    const timeZones = moment.tz.names();
    // Initialize today's date for the tileDisabled function.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Helper Functions
    /**
     * Function to disable past dates in the calendar.
     * @param param0 - Object containing the date and view.
     * @returns Boolean indicating whether the tile is disabled.
     */
    const tileDisabled = ({ date, view }: any): boolean => {
        if (view === "month") {
            return date < today;
        }
        return false;
    };

    // Event Handlers
    /**
     * Event handler for date change.
     * @param date - Selected date.
     */
    const handleDateChange = (date: Date) => {
        if (date instanceof Date) {
            setSelectedDateTime((previousDateTimeState) => ({
                ...previousDateTimeState,
                selectedDate: date,
                selectedTime: null,
            }));
        }
    };
    /**
     * Event handler for time zone change.
     * @param e - Change event.
     */
    const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTz = e.target.value;
        if (timeZones.includes(newTz)) {
            setSelectedTimeZone(newTz);
        } else {
            console.error(`Invalid Timezone: ${newTz}`);
        }
    };
    /**
     * Event handler for selecting a time slot.
     * @param timeSlot - Selected time slot.
     */
    const handleTimeSlotSelection = (timeSlot: string) => {
        setSelectedDateTime((previousDateTimeState) => ({
            ...previousDateTimeState,
            selectedTime: timeSlot,
        }));
    };
    // Event Handling Function placeholder to capture and handle form submission.
    const handleFormSubmission = () => {
        console.log(selectedDateTime);
    };

    // Business Logic

    /**
     * Function to get business hours time slots.
     * @returns Array of time slots.
     */
    const getBusinessHoursSlots = () => {
        // Note: Function is currently setup with hardcorded values to generate time slots every 30 minutes
        // during business hours 8 am - 5 pm Eastern Time. Update using parameters for reusability and flexibility.
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
    /**
     * Function to split time slots into AM and PM arrays.
     * @param slots - Array of time slots.
     * @returns Object containing AM and PM time slot arrays.
     */
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

    // Rendering Functions
    /**
     * Function to map time slots to buttons.
     * @param timeSlotArr - Array of time slots.
     * @returns JSX representing time slot buttons.
     */
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
    /**
     * Function to render Show More/Less button.
     * @param {number} timeSlotArrLength - Length of time slot array.
     * @param {string} amPm - AM or PM indicator.
     * @returns {(JSX.Element | null)} JSX representing the Show More/Less button, or null if timeSlotArrLength is not greater than 6.
     */
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

// ToDos: Assess alternative time zone options. Currently the selection may be a little overwhelming.
// ToDos: Revisit getBusinessHoursSlots, refactor for improved reusability.
// ToDos: Add functionality to blockout dates and times. Backend?
