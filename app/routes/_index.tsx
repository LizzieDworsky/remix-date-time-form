import type { MetaFunction } from "@remix-run/node";
import AppointmentForm from "../components/AppointmentForm";
import "../styles/index.css";

export const meta: MetaFunction = () => {
    return [
        { title: "Date Time Form" },
        {
            name: "A date time form Created for a client of Brem.",
            content: "A date time form Created for a client of Brem.",
        },
    ];
};

export default function Index() {
    return (
        <div className="appointment-page-content">
            <div className="heading">
                <div className="company-logo">
                    <img
                        src="/images/logoipsum-329.svg"
                        alt="company logo placeholder"
                    />
                </div>
                <div>
                    <h1>Book Your Appointment</h1>
                    <p>123 Anywhere Dr, Anywhere, NY 12345</p>
                </div>
            </div>
            <AppointmentForm />
            <div className="footer">
                <p>We will contact you shortly</p>
            </div>
        </div>
    );
}
