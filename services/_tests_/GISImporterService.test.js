import { Building, Floor, getBuildingOutlines, getBuildingMarkers, getBuilding } from "@/services/GISImporterService";

// Mock global fetch function
global.fetch = jest.fn();

describe("GISImporterService", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("getBuildingOutlines should return the correct GIS File", async () => {

        const response = getBuildingOutlines();

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response.features).toBeDefined();
        expect(response.features.length).toBeGreaterThan(0);
    });

    test("getBuildingMarkers should return the correct GIS File", async () => {

        const response = getBuildingMarkers();

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response.features).toBeDefined();
        expect(response.features.length).toBeGreaterThan(0);
    });

    test("getBuilding should return a valid building", async () => {
        const response = getBuilding("H");

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response.id).toBe("H");
    });

    test("getBuilding should return valid floors", async () => {
        const response = getBuilding("H");

        expect(response.floors).toBeDefined();
        expect(Object.keys(response.floors).length).toBeGreaterThan(0);
        expect(response.floors["H9"]).toBeDefined();
        expect(response.floors["H9"].id).toBe("H9");
        expect(response.floors["H9"].roomPOIs).toBeDefined();
        expect(Object.keys(response.floors["H9"].roomPOIs).length).toBeGreaterThan(0);
    });

    test("getBuilding should return null upon invalid input", async () => {
        const response = getBuilding("XYZ");

        expect(response).toBeUndefined();
    });
});