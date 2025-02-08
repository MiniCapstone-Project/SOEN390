interface DirectionsResponse {
    status: string;
    routes: Array<any>;
}

export const retrieveRoutes = async (
    originLat: number,
    originLong: number,
    destinationLat: number,
    destinationLong: number,
    apikey: string
    ) => {
        // turn origin and destination into strings
        const start = `${originLat},${originLong}`;
        const end = `${destinationLat},${destinationLong}`;

        //construct api call url
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=${apikey}`;

        try {
            const response = await fetch(url);  // attempt api call
            const data: DirectionsResponse = await response.json();  // retrieve data from api call

            if (data.status == "OK") {  // if api call is successful
                console.log("Route found");
                return data.routes[0]; // 0 represents the shortest route
            } else {  // if api call fails
                throw new Error(`Direction Fetch Failure with code ${data.status}`);
            }
        } catch (error) {
            console.error("Error fetching directions: ", error);
            throw error;
        }
    }
