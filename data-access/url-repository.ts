import { sql } from "@databases/sqlite";
import getDbConnection from "./db-connection";
import { randomUUID } from "crypto";

type UrlRecord = {
  id: string;
  originalUrl: string;
  urlShortId: string;
};

export async function addShortUrl(
  urlDetails: Omit<UrlRecord, "id">
): Promise<void> {
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
  return (await getUrlByShortID(shortId)) !== undefined;
}

export async function isUrlExist(urlAddress: string): Promise<boolean> {
  const results = await getDbConnection().query(sql`
        SELECT original_url FROM url_details WHERE original_url=${urlAddress};
      `);
  return results.length > 0;
}
