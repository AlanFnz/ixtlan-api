import debug from "debug";
import { BaseError } from "../utils/error.utils";

const log: debug.IDebugger = debug("app:error-handler");

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    log("Error message from the centralized error-handling component", err);
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
export const errorHandler = new ErrorHandler();
