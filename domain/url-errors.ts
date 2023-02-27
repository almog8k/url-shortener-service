import { BaseError } from "../utils/errors/errors";
import { SharedLogContext } from "../utils/logger/definition";

export class UrlExistError extends BaseError {
  constructor(logContext: SharedLogContext) {
    super("Url Exist Error", "Url already exist", logContext);
  }
}
