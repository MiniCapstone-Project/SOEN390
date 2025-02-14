import { retrieveRoutes } from "../DirectionService"; // Adjust if needed
import { GOOGLE_MAPS_API_KEY } from "../../constants/GoogleKey"; // Import API key

describe("DirectionService", () => {
    test("retrieveRoutes should return a valid route response", async () => {
        const mockOriginLat = 45.5017;
        const mockOriginLong = -73.5673; // Montreal
        const mockDestinationLat = 45.4945;
        const mockDestinationLong = -73.5622; // Nearby location

        const response = await retrieveRoutes(
            mockOriginLat, mockOriginLong,
            mockDestinationLat, mockDestinationLong,
            "driving",
            GOOGLE_MAPS_API_KEY // Pass the API key
        );

        expect(response).toBeDefined();
        expect(typeof response).toBe("object"); // Ensure it's an object
        expect(response.legs).toBeDefined(); // Ensure legs property exists
        expect(response.legs.length).toBeGreaterThan(0); // At least one route
    });
});
