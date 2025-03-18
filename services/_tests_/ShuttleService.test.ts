import { findNextShuttle } from "@/services/ShuttleService";
import schedule from "@/assets/schedule.json";

jest.mock("@/assets/schedule.json", () => ({
  times: ["08:00", "12:00", "16:00", "20:00"]
}));

describe("findNextShuttle", () => {
  it("should return a message if shuttleValid is false", () => {
    const result = findNextShuttle(false);
    expect(result).toBe("You are too far from either campus to use the shuttle service.");
  });

  it("should return the time until the next shuttle", () => {
    const mockDate = new Date(2023, 0, 1, 7, 30); // 7:30 AM
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string);

    const result = findNextShuttle(true);
    expect(result).toBe("Time Until Next Shuttle: 30 min");

    jest.restoreAllMocks();
  });

  it("should return a message if no more shuttles are available today", () => {
    const mockDate = new Date(2023, 0, 1, 21, 0); // 9:00 PM
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string);

    const result = findNextShuttle(true);
    expect(result).toBe("No More Shuttles Today, Try Again Before 6:45PM Tomorrow");

    jest.restoreAllMocks();
  });
});
