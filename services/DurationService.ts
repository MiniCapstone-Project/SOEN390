import { GOOGLE_MAPS_API_KEY } from "@/constants/GoogleKey";
import { LatLng } from "react-native-maps";

export const getTripDuration = async (origin: LatLng, destination: LatLng): Promise<number> => {
    // api call to get only the duration of a trip with distance matrix, ensure it is enabled in your google api
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();  // get the data from the API call

    if (data.status == "OK" && data.rows[0].elements[0].status == "OK") {  // make sure status of response is valid
        return data.rows[0].elements[0].duration.value / 60;  // returns seconds, convert to minutes
    } else {  // if status is invalid
        throw new Error("API error " + data.error_message);
    }
}