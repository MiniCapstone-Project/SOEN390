import { DirectionsAPIError } from "@/errors/DirectionApiError";

interface DirectionsResponse {
    status: string;
    routes: Array<any>;
}

export const retrieveRoutes = async (
    originLat: number,
    originLong: number,
    destinationLat: number,
    destinationLong: number,
    transportMode: string,
    apikey: string
    ) => {
        const controller = new AbortController();
        const signal = controller.signal;
      
        const start = `${originLat},${originLong}`;
        const end = `${destinationLat},${destinationLong}`;

        console.log("Transport Mode:", transportMode);

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=${transportMode}&key=${apikey}`;

        try {
            const response = await fetch(url, { signal });
            if (!response.ok) {
                throw new DirectionsAPIError(
                  `Failed to fetch directions - HTTP ${response.status}`,
                  response.status
                );
            }
            
            const data: DirectionsResponse = await response.json();

            if (data.status == "OK") {
                console.log("Route found");
                return data.routes[0]; // 0 represents the shortest route
            } else { 
                throw new Error(`Direction Fetch Failure with code ${data.status}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
              if (error.name === "AbortError") {
                console.warn("Fetch aborted due to new search request");
                return null; 
              }
        
              console.error("Error fetching directions:", error.message);
        
              if (error instanceof DirectionsAPIError) {
                throw error;
              } else {
                throw new DirectionsAPIError(error.message);
              }
            }
        
            throw new DirectionsAPIError("Unexpected error fetching directions");
          } finally {
            controller.abort();
          } 
    }
