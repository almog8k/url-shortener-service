import { sql } from "@databases/sqlite";
import getDbConnection from "../utils/DB/db-connection";
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
    logger.debug({ msg: "Trying to add url", metadata: { Url } });
    await getDbConnection()?.query(
      sql`INSERT INTO url_details (id, original_url, url_short_id)
              VALUES(${randomUUID()}, ${Url.originalUrl}, ${Url.urlShortId});`
    );
    logger.debug({ msg: "Successfully added url", metadata: { Url } });
  } catch (error: any) {
    logger.error({ msg: "Failed to add short url", metadata: { Url, error } });
    throw error;
  }
}

export async function getUrlByShortID(
  shortId: string
): Promise<string | undefined> {
  try {
    logger.debug({
      msg: "Trying to get original url by shortId",
      metadata: { shortId },
    });
    const results = await getDbConnection()?.query(sql`
    SELECT original_url FROM url_details WHERE url_short_id=${shortId};
  `);
    if (results && results.length) {
      const originalUrl = results[0].original_url;
      logger.debug({
        msg: "Found original url",
        metadata: { originalUrl },
      });

      return originalUrl;
    } else {
      logger.debug({
        msg: "Original url can't be found based on given shortId",
        metadata: { shortId },
      });

      return undefined;
    }
  } catch (error) {
    logger.error({
      msg: "Failed to get original url with given shortId",
      metadata: { shortId, error },
    });
    throw error;
  }
}

export async function isUrlShortIdExist(shortId: string): Promise<boolean> {
  return (await getUrlByShortID(shortId)) !== undefined;
}

export async function isUrlExist(urlAddress: string): Promise<boolean> {
  try {
    logger.debug({
      msg: "Trying to check if url exist",
      metadata: { urlAddress },
    });
    const results = await getDbConnection()?.query(sql`
    SELECT original_url FROM url_details WHERE original_url=${urlAddress};
  `);
    return results !== undefined && results.length > 0;
  } catch (error) {
    logger.error({
      msg: "Failed to check if url exist url",
      metadata: { urlAddress, error },
    });
    throw error;
  }
}
