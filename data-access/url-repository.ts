import { sql } from "@databases/sqlite";
import getDbConnection from "./db-connection";
import { randomUUID } from "crypto";
import { logger } from "../utils/logger/logger-wrapper";
import util from "util";

type UrlRecord = {
  id: string;
  originalUrl: string;
  urlShortId: string;
};

export async function addUrl(Url: Omit<UrlRecord, "id">): Promise<void> {
  try {
    logger.debug(`Trying to add url ${util.inspect(Url)}`);
    await getDbConnection().query(
      sql`INSERT INTO url_details (id, original_url, url_short_id)
              VALUES(${randomUUID()}, ${Url.originalUrl}, ${Url.urlShortId});`
    );
    logger.debug(`Successfully added url ${util.inspect(Url)}`);
  } catch (error: any) {
    logger.error(`Failed to add short url ${util.inspect(Url)}`);
    throw error;
  }
}

export async function getUrlByShortID(
  shortId: string
): Promise<string | undefined> {
  try {
    logger.debug(`Trying to get original url by shortId: ${shortId}`);
    const results = await getDbConnection().query(sql`
    SELECT original_url FROM url_details WHERE url_short_id=${shortId};
  `);
    if (results.length) {
      logger.debug(`Found original url ${results[0].original_url}`);
      return results[0].original_url;
    } else {
      logger.debug(`Original url can't be found with shortId: ${shortId}`);
      return undefined;
    }
  } catch (error) {
    logger.error(`Failed to get original url with shortId: ${shortId}`);
    throw error;
  }
}

export async function isUrlShortIdExist(shortId: string): Promise<boolean> {
  return (await getUrlByShortID(shortId)) !== undefined;
}

export async function isUrlExist(urlAddress: string): Promise<boolean> {
  try {
    logger.debug(`Trying to check if url exist url: ${urlAddress}`);
    const results = await getDbConnection().query(sql`
    SELECT original_url FROM url_details WHERE original_url=${urlAddress};
  `);
    return results.length > 0;
  } catch (error) {
    logger.error(`Failed to check if url exist url: ${urlAddress}`);
    throw error;
  }
}
