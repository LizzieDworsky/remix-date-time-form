import { Dispatch, SetStateAction } from "react";
import { DateTimeState } from "../types";
import { IoMdArrowRoundBack } from "react-icons/io";

interface UserFormProps {
    selectedDateTime: DateTimeState;
    setShowDateTimeForm: Dispatch<SetStateAction<boolean>>;
}

const UserForm = ({ selectedDateTime, setShowDateTimeForm }: UserFormProps) => {
    return (
        <div>
            <div className="date-time-bar">
                <IoMdArrowRoundBack onClick={() => setShowDateTimeForm(true)} />
            </div>
        </div>
    );
};

export default UserForm;
