import express from "express";
import { logger } from "../../utils/logger/logger-wrapper";
import util from "util";
import * as newShortUrlUseCase from "../../domain/new-short-url-use-case";
import { HttpStatusCode } from "axios";
import { ErrorResponse } from "../../utils/errors/errors";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      logger.info(
        `Url-Shortener API was called to add new short url ${util.inspect(
          req.body
        )} `
      );
      const urlResponse = await newShortUrlUseCase.addUrl(req.body);

      return res.status(HttpStatusCode.Created).json(urlResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  router.get("/:shortUrlId", async (req, res, next) => {
    try {
      const { shortUrlId } = req.params;
      logger.info(
        `Url-Shortener API was called to redirect short URL to original URl ${util.inspect(
          req.params
        )} `
      );

      const originalUrl = await newShortUrlUseCase.getUrlByUrlShortID(
        shortUrlId
      );

      if (!originalUrl) {
        logger.info(`Short urlId "${shortUrlId}" was not found".`);
        const notFoundResponse: ErrorResponse = {
          message: "URL not found",
          code: HttpStatusCode.NotFound,
        };
        res.status(notFoundResponse.code).json(notFoundResponse);
        return;
      }

      logger.info(
        `Short urlId "${shortUrlId}" was successfully redirected to "${originalUrl}".`
      );

      res.redirect(HttpStatusCode.MovedPermanently, originalUrl);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  expressApp.use("/shorten-urls", router);
}
