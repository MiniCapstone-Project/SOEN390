export class PlacesAPIError extends Error {
    constructor(message: string, public statusCode?: number) {
      super(message);
      this.name = "PlacesAPIError";
    }
  }
  