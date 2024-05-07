import { Dispatch, SetStateAction, useState } from "react";
import { DateTimeState } from "../types";
import { FaArrowLeft, FaRegClock, FaRegCalendar } from "react-icons/fa";
import moment from "moment-timezone";

interface UserFormProps {
    selectedDateTime: DateTimeState;
    setShowDateTimeForm: Dispatch<SetStateAction<boolean>>;
}

interface UserDetailsState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

const UserForm = ({ selectedDateTime, setShowDateTimeForm }: UserFormProps) => {
    const [userDetails, setUserDetails] = useState<UserDetailsState>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(userDetails);
        setUserDetails({ firstName: "", lastName: "", email: "", phone: "" });
    };

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
            <div className="user-details-form-container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={userDetails.firstName}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={userDetails.lastName}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={userDetails.email}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone">Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={userDetails.phone}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                    </div>
                    <button className="submit-forms-btn" type="submit">
                        Book Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
