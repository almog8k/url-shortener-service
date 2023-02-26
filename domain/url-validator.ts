import { UrlDTO, UrlSchema } from "./url-schema";
import util from "util";
import { logger } from "@practica/logger";
import { AppError } from "../utils/error-handling";
import { SharedLogContext } from "../utils/shared-logger-context";

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
    throw new AppError(
      "invalid-url",
      "Url is not valid",
      SHARED_LOG_CONTEXT,
      400,
      true
    );
  }
  logger.debug(`Url ${util.inspect(url)} is valid`);
}
