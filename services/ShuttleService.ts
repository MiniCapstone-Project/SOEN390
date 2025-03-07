import schedule from "@/assets/schedule.json";

export const findNextShuttle = (shuttleValid: boolean): string => {
    if (!shuttleValid) {
        return "You are too far from either campus to use the shuttle service.";
    }

    const now = new Date();  // get current date time
    const currentTime = now.getHours() * 60 + now.getMinutes(); // get time in minutes since day began

    const shuttleSchedule = schedule.times;  // get shuttle times from schedule json

    for (let i = 0; i < Object.keys(shuttleSchedule).length; i++) {
        const timeArray = shuttleSchedule[i].split(":");  // split time string into hours and minutes
        const hours = Number(timeArray[0]);
        const minutes = Number(timeArray[1]);  // get hours and minutes in a number format
        const time = hours * 60 + minutes;  // get the time in minutes for comparator

        if (time > currentTime) {  // this means that the time coming up is the closest to our current time
            // get minutes till shuttle by subtracting, turn to String and create message
            const returnString = "Time Until Next Shuttle: " + String(time - currentTime) + " min";
            return returnString;
        }
    }
    const returnString = "No More Shuttles Today, Try Again Before 6:45PM Tomorrow";
    return returnString;  // fall back if no matches were found
}
