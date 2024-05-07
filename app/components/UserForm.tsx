import { Dispatch, SetStateAction } from "react";
import { DateTimeState } from "../types";
import { FaArrowLeft, FaRegClock, FaRegCalendar } from "react-icons/fa";
import moment from "moment-timezone";

interface UserFormProps {
    selectedDateTime: DateTimeState;
    setShowDateTimeForm: Dispatch<SetStateAction<boolean>>;
}

const UserForm = ({ selectedDateTime, setShowDateTimeForm }: UserFormProps) => {
    console.log(selectedDateTime);
    return (
        <div className="user-form-container">
            <div className="date-time-bar">
                <FaArrowLeft
                    className="back-arrow"
                    onClick={() => setShowDateTimeForm(true)}
                />
                <div className="calendar-details-container">
                    <p>
                        <FaRegClock className="icon" />{" "}
                        {`${selectedDateTime.selectedTime} ${moment
                            .tz(
                                selectedDateTime.selectedDate,
                                selectedDateTime.selectedTimeZone
                            )
                            .zoneAbbr()} - 30 Minutes`}
                    </p>
                    <p>
                        <FaRegCalendar className="icon" />{" "}
                        {moment(selectedDateTime.selectedDate).format(
                            "ddd, MMMM D, YYYY"
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
