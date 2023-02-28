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

export class AppError extends BaseError {
  constructor(
    public name: string,
    public message: string,
    public logContext?: SharedLogContext,
    public HTTPStatus: number = HttpStatusCode.InternalServerError,
    public isTrusted = true
  ) {
    super(name, message, logContext, isTrusted);
  }
}

export type ResponseError = {
  message: string;
  code: number;
};
