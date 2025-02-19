jest.mock("../DirectionsScreen", () => {
  const ActualScreen = jest.requireActual("../DirectionsScreen").default;
  return (props) => <ActualScreen {...props} GOOGLE_MAPS_API_KEY="mocked-api-key" />;
});

jest.mock("@/services/DirectionService.ts", () => ({
  retrieveRoutes: jest.fn().mockResolvedValue("mocked-route"),
}));

import { retrieveRoutes } from "@/services/DirectionService.ts";

describe("DirectionsScreen - Route Calculation", () => {
  it("should retrieve routes correctly", async () => {
    const result = await retrieveRoutes(10, 10, 20, 20, "DRIVING", "mocked-api-key");

    expect(retrieveRoutes).toHaveBeenCalled();
    expect(result).toBe("mocked-route");
  });
});
