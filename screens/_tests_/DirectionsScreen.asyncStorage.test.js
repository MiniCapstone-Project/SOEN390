import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn(),
}));

describe("DirectionsScreen - AsyncStorage", () => {
  it("should retrieve saved locations", async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ latitude: 10, longitude: 10 }));

    const result = await AsyncStorage.getItem("origin");

    expect(result).toEqual(JSON.stringify({ latitude: 10, longitude: 10 }));
  });

  it("should save location correctly", async () => {
    await AsyncStorage.setItem("destination", JSON.stringify({ latitude: 20, longitude: 20 }));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("destination", JSON.stringify({ latitude: 20, longitude: 20 }));
  });
});
