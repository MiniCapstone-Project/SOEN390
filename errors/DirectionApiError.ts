export class DirectionsAPIError extends Error {
    constructor(message: string, public statusCode?: number) {
      super(message);
      this.name = "DirectionsAPIError";
    }
  }
  