import { generateShortId } from "./shortener-service";
import * as urlRepository from "./url-repository";
import { UrlResponse } from "./url-response";
import { logger } from "../utils/logger/logger-wrapper";
import {
  ResourceExistsError,
  ResourceNotFoundError,
  TooManyAttemptsError,
} from "../utils/errors/errors";

export async function addUrl(url: string): Promise<UrlResponse> {
  await assertUrlDoesNotExist(url);

  const urlShortId = await getUniqueShortId(url);

  await urlRepository.addUrl({
    originalUrl: url,
    urlShortId,
  });

  logger.info({
    msg: "Added successfully short url ID and original URL",
    metadata: { url, urlShortId },
  });

  return { urlShortId, originalUrl: url };
}

export async function getUrlByUrlShortID(urlShortId: string) {
  const originalUrl = await urlRepository.getUrlByShortID(urlShortId);
  if (!originalUrl) {
    logger.warning({
      msg: "Short urlId was not found",
      metadata: { urlShortId },
    });
    throw new ResourceNotFoundError("Url was not found");
  }
  return originalUrl;
}

async function assertUrlDoesNotExist(urlAddress: string): Promise<void> {
  const urlExist = await urlRepository.isUrlExist(urlAddress);
  const metadata = { urlAddress, urlExist };
  if (urlExist) {
    logger.warning({
      msg: "Url already exists ",
      metadata,
    });
    throw new ResourceExistsError("Url exist");
  }
  logger.info({ msg: "Url does not exist", metadata });
}

async function getUniqueShortId(urlAddress: string): Promise<string> {
  const maxAttempts = 3;
  let attempts = 0;
  let exist = false;
  let urlShortId;
  logger.debug({ msg: "Generating short URL ID", metadata: { urlAddress } });
  do {
    urlShortId = generateShortId(urlAddress);
    exist = await urlRepository.isUrlShortIdExist(urlShortId);
    attempts++;
    if (attempts === maxAttempts) {
      throw new TooManyAttemptsError(
        "Too many attempts for generating shortId"
      );
    }
  } while (exist);
  logger.debug({
    msg: "Generated short URL ID",
    metadata: { urlShortId, attempts },
  });
  return urlShortId;
}
