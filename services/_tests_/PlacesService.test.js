import { searchPlaces } from "../PlacesService"; // Adjust the path if needed

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("PlacesService", () => {
    test("searchPlaces should return a list of places", async () => {
        const mockResponse = {
            results: [
                {
                    geometry: {
                        location: { lat: 45.5017, lng: -73.5673 },
                    },
                },
            ],
            status: "OK",
        };

        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        const response = await searchPlaces("restaurant", 45.5017, -73.5673, "VALID_API_KEY");

        expect(response).toBeDefined();
        expect(Array.isArray(response.results)).toBe(true);
        expect(response.results.length).toBeGreaterThan(0);
    });

    test("searchPlaces should handle gibberish search gracefully", async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ results: [], status: "ZERO_RESULTS" }),
        });

        const response = await searchPlaces("asdasdasd", 45.5017, -73.5673, "VALID_API_KEY");

        expect(response).toBeDefined();
        expect(response.results).toEqual([]);
        expect(response.coords).toEqual([]);
    });

    test("searchPlaces should throw an error on API failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network Error"));

        await expect(
            searchPlaces("restaurant", 45.5017, -73.5673, "INVALID_API_KEY")
        ).rejects.toThrow("Failed to fetch places");
    });
});
