import { sql } from "@databases/sqlite";
import getDbConnection from "./db-connection";
import { randomUUID } from "crypto";
import { SharedLogContext } from "../utils/shared-logger-context";

type UrlRecord = {
  id: string;
  originalUrl: string;
  urlShortId: string;
};

const SHARED_LOG_CONTEXT: SharedLogContext = {
  dirname: __dirname,
  filename: __filename,
};

export async function addShortUrl(
  urlDetails: Omit<UrlRecord, "id">
): Promise<void> {
  SHARED_LOG_CONTEXT.functionName = addShortUrl.name;
  SHARED_LOG_CONTEXT.metadata = urlDetails;
  await getDbConnection().query(
    sql`INSERT INTO url_details (id, original_url, url_short_id)
            VALUES(${randomUUID()}, ${urlDetails.originalUrl}, ${
      urlDetails.urlShortId
    });`
  );
}

export async function getUrlByShortID(
  shortId: string
): Promise<string | undefined> {
  SHARED_LOG_CONTEXT.functionName = getUrlByShortID.name;
  SHARED_LOG_CONTEXT.metadata = { shortId };
  const results = await getDbConnection().query(sql`
        SELECT original_url FROM url_details WHERE url_short_id=${shortId};
      `);
  if (results.length) {
    return results[0].original_url;
  } else {
    return undefined;
  }
}

export async function isUrlShortIdExist(shortId: string): Promise<boolean> {
  SHARED_LOG_CONTEXT.functionName = isUrlShortIdExist.name;
  SHARED_LOG_CONTEXT.metadata = { shortId };
  return (await getUrlByShortID(shortId)) !== undefined;
}

export async function isUrlExist(urlAddress: string): Promise<boolean> {
  SHARED_LOG_CONTEXT.functionName = isUrlExist.name;
  SHARED_LOG_CONTEXT.metadata = { urlAddress };
  const results = await getDbConnection().query(sql`
        SELECT original_url FROM url_details WHERE original_url=${urlAddress};
      `);
  return results.length > 0;
}
