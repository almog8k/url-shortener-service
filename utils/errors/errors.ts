import { HttpStatusCode } from "axios";

import { SharedLogContext } from "../logger/definition";

export class BaseError extends Error {
  constructor(
    public name: string,
    public message: string,
    public logContext?: SharedLogContext,
    public isTrusted = true
  ) {
    super(message);
  }
}

export class ValidationError extends BaseError {
  constructor(public message: string, logContext: SharedLogContext) {
    super("Validation Error", message, logContext);
  }
}

export class UrlExistError extends BaseError {
  constructor(logContext: SharedLogContext) {
    super("Url Exist Error", "Url already exist", logContext);
  }
}

export class AppError extends BaseError {
  constructor(
    public name: string,
    public message: string,
    public logContext?: SharedLogContext,
    public HTTPStatus: number = 500,
    public isTrusted = true
  ) {
    super(name, message, logContext);
  }
}
