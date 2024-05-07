import { Dispatch, SetStateAction } from "react";
import { DateTimeState } from "../types";
import { IoMdArrowRoundBack } from "react-icons/io";
import moment from "moment-timezone";

interface UserFormProps {
    selectedDateTime: DateTimeState;
    setShowDateTimeForm: Dispatch<SetStateAction<boolean>>;
}

const UserForm = ({ selectedDateTime, setShowDateTimeForm }: UserFormProps) => {
    console.log(selectedDateTime);
    return (
        <div>
            <div className="date-time-bar">
                <IoMdArrowRoundBack onClick={() => setShowDateTimeForm(true)} />
                <div className="calendar-details-container">
                    <p>{`${selectedDateTime.selectedTime}`}</p>
                    <p>
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
