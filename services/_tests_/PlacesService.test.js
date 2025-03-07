import { searchPlaces } from "../PlacesService";

// Mock global fetch function
global.fetch = jest.fn();

describe("PlacesService", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("searchPlaces should return a list of places", async () => {
        const mockResponse = {
            results: [{ name: "Mock Place", geometry: { location: { lat: 45.5017, lng: -73.5673 } } }],
        };

        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(mockResponse),
            ok: true,
        });

        const response = await searchPlaces("coffee", 45.5017, -73.5673);

        expect(response).toBeDefined();
        expect(Array.isArray(response.features)).toBe(true);
        expect(response.features.length).toBeGreaterThan(0);
        expect(response.features[0].properties).toHaveProperty("name");
        expect(response.features[0].geometry).toHaveProperty("coordinates");
    });

    test("searchPlaces should handle API errors gracefully", async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({ status: "REQUEST_DENIED" }),
            ok: false,
        });

        await expect(searchPlaces("coffee", 45.5017, -73.5673))
            .rejects.toThrow("Failed to fetch places");
    });

    test("searchPlaces should handle network failures", async () => {
        fetch.mockRejectedValueOnce(new Error("Failed to fetch places"));

        await expect(searchPlaces("coffee", 45.5017, -73.5673))
            .rejects.toThrow("Failed to fetch places"); // Updated expected error message
    });
});
