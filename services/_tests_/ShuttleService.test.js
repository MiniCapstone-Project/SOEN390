import { findNextShuttle } from "../ShuttleService";
import schedule from "@/assets/schedule.json";

describe("ShuttleService", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("should return a message if shuttle service is not valid", () => {
    const result = findNextShuttle(false);
    expect(result).toBe("You are too far from either campus to use the shuttle service.");
  });

  test("should return the time until the next shuttle", () => {
    const mockDate = new Date(2023, 0, 1, 12, 0); // January 1, 2023, 12:00 PM
    jest.setSystemTime(mockDate);

    const result = findNextShuttle(true);
    const nextShuttleTime = schedule.times.find(time => {
      const [hours, minutes] = time.split(":").map(Number);
      const shuttleTime = hours * 60 + minutes;
      return shuttleTime > 12 * 60; // 12:00 PM in minutes
    });

    const [nextHours, nextMinutes] = nextShuttleTime.split(":").map(Number);
    const nextShuttleMinutes = nextHours * 60 + nextMinutes;
    const expectedMinutes = nextShuttleMinutes - (12 * 60);

    expect(result).toBe(`Time Until Next Shuttle: ${expectedMinutes} min`);
  });

  test("should return a message if there are no more shuttles today", () => {
    const mockDate = new Date(2023, 0, 1, 23, 0); // January 1, 2023, 11:00 PM
    jest.setSystemTime(mockDate);

    const result = findNextShuttle(true);
    expect(result).toBe("No More Shuttles Today, Try Again Before 6:45PM Tomorrow");
  });
});
