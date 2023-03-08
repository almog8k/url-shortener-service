import getDbConnection from "../utils/DB/pg-db-connection";
import { logger } from "../utils/logger/logger-wrapper";

type UrlRecord = {
  id: string;
  originalUrl: string;
  urlShortId: string;
};

export async function addUrl(Url: Omit<UrlRecord, "id">): Promise<void> {
  try {
    logger.debug({ msg: "Trying to add url", metadata: { Url } });
    const client = await getDbConnection();
    await client?.query(
      `INSERT INTO url_details ( url_short_id, original_url)
              VALUES($1, $2);`,
      [Url.urlShortId, Url.originalUrl]
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
    const client = await getDbConnection();
    const results = await client?.query(
      `
    SELECT original_url FROM url_details WHERE url_short_id=$1;
  `,
      [shortId]
    );
    if (results && results.rowCount > 0) {
      const originalUrl = results.rows[0].original_url;
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
    const client = await getDbConnection();
    const results = await client?.query(
      `
    SELECT original_url FROM url_details WHERE original_url=$1
  `,
      [urlAddress]
    );
    return results !== undefined && results.rowCount > 0;
  } catch (error) {
    logger.error({
      msg: "Failed to check if url exist url",
      metadata: { urlAddress, error },
    });
    throw error;
  }
}
