import { retrieveRoutes } from "@/services/DirectionService.ts";

jest.mock("@/services/DirectionService.ts", () => ({
  retrieveRoutes: jest.fn().mockRejectedValue(new Error("API Error")),
}));

describe("DirectionsScreen - Error Handling", () => {
  it("should handle API errors gracefully", async () => {
    await expect(
      retrieveRoutes(10, 10, 20, 20, "DRIVING", "mocked-api-key")
    ).rejects.toThrow("API Error");
  });
});
