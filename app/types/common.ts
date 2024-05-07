/**
 * Interface for the state representing date and time.
 */
export interface DateTimeState {
    selectedDate: Date;
    selectedTime: string | null;
    selectedTimeZone: string;
}
