import { retrieveRoutes } from "../DirectionService";

// Mock global fetch function
global.fetch = jest.fn();

describe("DirectionService", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("retrieveRoutes should return a valid route response", async () => {
        const mockResponse = {
            status: "OK", // <-- Added missing status field
            routes: [{ legs: [{}] }] // Simulated API success response
        };

        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(mockResponse),
            ok: true,
        });

        const response = await retrieveRoutes(45.5017, -73.5673, 45.4945, -73.5622, "driving");

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response.legs).toBeDefined();
        expect(response.legs.length).toBeGreaterThan(0);
    });

    test("retrieveRoutes should handle API errors gracefully", async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({ status: "REQUEST_DENIED" }),
            ok: true, // <-- Keep this `true`, API errors still return a JSON response
        });

        await expect(
            retrieveRoutes(45.5017, -73.5673, 45.4945, -73.5622, "driving")
        ).rejects.toThrow("Direction Fetch Failure with code REQUEST_DENIED");
    });

    test("retrieveRoutes should handle network failures", async () => {
        fetch.mockRejectedValueOnce(new Error("Network Error"));

        await expect(
            retrieveRoutes(45.5017, -73.5673, 45.4945, -73.5622, "driving")
        ).rejects.toThrow("Network Error");
    });
});
