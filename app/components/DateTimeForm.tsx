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
    const [showAllAMSlots, setShowAllAMSlots] = useState<boolean>(false);
    const [showAllPMSlots, setShowAllPMSlots] = useState<boolean>(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tileDisabled = ({ date, view }: any): boolean => {
        if (view === "month") {
            return date < today;
        }
        return false;
    };

    const handleDateChange = (date: Date) => {
        if (date instanceof Date) {
            setSelectedDate(date);
            setSelectedTimeSlot(null);
        }
    };

    const timeZones = moment.tz.names();

    const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimeZone(e.target.value);
    };

    const handleTimeSlotSelection = (timeSlot: any) => {
        setSelectedTimeSlot(timeSlot);
    };

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

    const splitTimeSlots = (slots: string[]) => {
        const now = moment().tz(selectedTimeZone);
        const timeSlotsAM: string[] = [];
        const timeSlotsPM: string[] = [];
        slots.forEach((slot) => {
            const slotTime = moment.tz(
                `${moment(selectedDate).format("YYYY-MM-DD")} ${slot}`,
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

    const availableSlots = getBusinessHoursSlots();
    const { timeSlotsAM, timeSlotsPM } = splitTimeSlots(availableSlots);

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
                            value={selectedDate}
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
                    {selectedDate && (
                        <h3>
                            Available Starting times for{" "}
                            {moment(selectedDate)
                                .tz(selectedTimeZone)
                                .format("ddd, MMMM D, YYYY")}
                        </h3>
                    )}
                    <div className="time-slots-columns">
                        <div className="time-slot">
                            <h4>AM</h4>
                            <div
                                className={`slot-container ${
                                    showAllAMSlots ? "expanded" : "collapsed"
                                }`}
                            >
                                {/* Add "scrollable" class for scrolling implementation. */}

                                {timeSlotsAM.length > 0 ? (
                                    timeSlotsAM.map((slot) => (
                                        <button
                                            className="time-slot-button"
                                            key={slot}
                                            onClick={() =>
                                                handleTimeSlotSelection(slot)
                                            }
                                            aria-label={`Select ${slot} as the starting time.`}
                                        >
                                            {slot}
                                        </button>
                                    ))
                                ) : (
                                    <p className="no-slots-p">
                                        No AM times available.
                                    </p>
                                )}
                            </div>
                            {timeSlotsAM.length > 6 && (
                                <button
                                    className="show-more-less-btn"
                                    aria-label={"No more AM slots available"}
                                    onClick={() =>
                                        setShowAllAMSlots(!showAllAMSlots)
                                    }
                                >
                                    {showAllAMSlots ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </div>
                        <div className="time-slot">
                            <h4>PM</h4>
                            <div
                                className={`slot-container ${
                                    showAllPMSlots ? "expanded" : "collapsed"
                                }`}
                            >
                                {/* Add "scrollable" class for scrolling implementation. */}
                                {timeSlotsPM.length > 0 ? (
                                    timeSlotsPM.map((slot) => (
                                        <button
                                            className="time-slot-button"
                                            key={slot}
                                            onClick={() =>
                                                handleTimeSlotSelection(slot)
                                            }
                                            aria-label={`Select ${slot} as the starting time.`}
                                        >
                                            {slot}
                                        </button>
                                    ))
                                ) : (
                                    <p className="no-slots-p">
                                        No PM times available.
                                    </p>
                                )}
                            </div>
                            {timeSlotsPM.length > 6 && (
                                <button
                                    className="show-more-less-btn"
                                    aria-label={"No more PM slots available"}
                                    onClick={() =>
                                        setShowAllPMSlots(!showAllPMSlots)
                                    }
                                >
                                    {showAllPMSlots ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <button
                className="select-date-time-btn"
                aria-label="Submit the selected date and time for the appointment."
            >
                Select Date
            </button>
        </div>
    );
};

export default DateTimeForm;
