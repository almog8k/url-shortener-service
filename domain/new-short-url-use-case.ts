import { generateShortId } from "./shortener-service";
import { UrlDTO } from "./url-schema";
import { assertUrlIsValid } from "./url-validator";
import * as urlRepository from "../data-access/url-repository";
import { UrlResponse } from "./url-response";
import { logger } from "../utils/logger/logger-wrapper";
import { SharedLogContext } from "../utils/logger/definition";
import { UrlExistError } from "./url-errors";

const SHARED_LOG_CONTEXT: SharedLogContext = {
  dirname: __dirname,
  filename: __filename,
};

export async function addUrl(url: UrlDTO): Promise<UrlResponse> {
  SHARED_LOG_CONTEXT.functionName = addUrl.name;
  SHARED_LOG_CONTEXT.metadata = { url };

  assertUrlIsValid(url);
  const { urlAddress } = url;

  await assertUrlDoesNotExist(urlAddress);

  const urlShortId = await getUniqueShortId(urlAddress);

  await urlRepository.addUrl({
    originalUrl: urlAddress,
    urlShortId,
  });

  logger.info(
    `Added short URL with ID ${urlShortId} and original URL ${url.urlAddress}`
  );
  return { urlShortId, originalUrl: url.urlAddress };
}

async function assertUrlDoesNotExist(urlAddress: string): Promise<void> {
  SHARED_LOG_CONTEXT.functionName = assertUrlDoesNotExist.name;
  SHARED_LOG_CONTEXT.metadata = { urlAddress };
  const urlExist = await urlRepository.isUrlExist(urlAddress);
  if (urlExist) {
    throw new UrlExistError(SHARED_LOG_CONTEXT);
  }
}

async function getUniqueShortId(urlAddress: string): Promise<string> {
  let attempts = 1;
  let exist = false;
  let urlShortId;
  logger.debug(`Generating short URL ID with  URL ${urlAddress}`);
  do {
    urlShortId = generateShortId(urlAddress);
    exist = await urlRepository.isUrlShortIdExist(urlShortId);
    attempts++;
  } while (exist);

  logger.debug(
    `Generated short URL ID ${urlShortId} after ${attempts - 1} attempts`
  );
  return urlShortId;
}

export async function getUrlByUrlShortID(urlShortId: string) {
  const originalUrl = await urlRepository.getUrlByShortID(urlShortId);
  return originalUrl;
}
