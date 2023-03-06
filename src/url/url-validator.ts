import { UrlDTO, UrlSchema } from "./url-schema";
import { logger } from "../utils/logger/logger-wrapper";
import { InvalidInputError } from "../utils/errors/errors";

export function validateUrl(url: unknown): UrlDTO {
  logger.debug({ msg: "Validating url", metadata: { url } });
  const parsedUrl = UrlSchema.safeParse(url);
  if (!parsedUrl.success) {
    throw new InvalidInputError("Invalid Url");
  }
  logger.debug({ msg: "Url is valid", metadata: { url } });
  return parsedUrl.data;
}
