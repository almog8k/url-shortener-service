import express from "express";
import util from "util";
import * as newShortUrlUseCase from "./new-short-url-use-case";
import { HttpStatusCode } from "axios";
import { logger } from "../utils/logger/logger-wrapper";
import { validateUrl } from "./url-validator";
import { UrlDTO } from "./url-schema";

export async function createUrl(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  logger.info({
    msg: `Url-Shortener API was called to add new short url`,
    metadata: { reqBody: req.body },
  });
  try {
    const url: UrlDTO = validateUrl(req.body);
    const urlResponse = await newShortUrlUseCase.addUrl(url.urlAddress);
    return res.status(HttpStatusCode.Created).json(urlResponse);
  } catch (error) {
    return next(error);
  }
}

export async function getUrl(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    logger.info({
      msg: "Url-Shortener API was called to redirect short URL to original URl",
      metadata: { reqParams: req.params },
    });
    const { shortUrlId } = req.params;
    const originalUrl = await newShortUrlUseCase.getUrlByUrlShortID(shortUrlId);

    logger.info({
      msg: "Redirected successfully",
      metadata: { shortUrlId, originalUrl },
    });

    res.redirect(HttpStatusCode.MovedPermanently, originalUrl);
  } catch (error) {
    return next(error);
  }
}
