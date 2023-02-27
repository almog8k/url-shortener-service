import { UrlDTO, UrlSchema } from "./url-schema";
import util from "util";
import { AppError } from "../utils/errors/error-handling";
import { logger } from "../utils/logger/logger-wrapper";
import { SharedLogContext } from "../utils/logger/definition";
import { ValidationError } from "../utils/errors/errors";

const SHARED_LOG_CONTEXT: SharedLogContext = {
  dirname: __dirname,
  filename: __filename,
};

export function assertUrlIsValid(url: UrlDTO) {
  SHARED_LOG_CONTEXT.functionName = assertUrlIsValid.name;
  SHARED_LOG_CONTEXT.metadata = { urlAddress: url.urlAddress };
  logger.debug(`Validating url ${util.inspect(url)}`);
  const isValid = UrlSchema.safeParse(url);
  if (!isValid.success) {
    throw new ValidationError("Invalid Url", SHARED_LOG_CONTEXT);
  }
  logger.debug(`Url ${util.inspect(url)} is valid`);
}
