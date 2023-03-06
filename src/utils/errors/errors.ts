import { HttpStatusCode } from "axios";

export class AppError extends Error {
  constructor(
    public name: string,
    public message: string,
    public isTrusted = true
  ) {
    super(message);
  }
}

export class InvalidInputError extends AppError {
  constructor(public message: string) {
    super("Invalid Input Error", message);
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(public message: string) {
    super("Resource not Found Error", message);
  }
}

export class ResourceExistsError extends AppError {
  constructor(public message: string) {
    super("Resource Already Exists Error", message);
  }
}

export class TooManyAttemptsError extends AppError {
  constructor(public message: string) {
    super("Too many attempts Error", message);
  }
}

export class HttpError extends AppError {
  constructor(
    public name: string,
    public message: string,
    public code: number = HttpStatusCode.InternalServerError
  ) {
    super(name, message);
  }
}

export type ResponseError = {
  message: string;
  code: number;
};
