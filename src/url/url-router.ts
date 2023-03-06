import express from "express";
import * as urlController from "../url/url-controller";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", urlController.createUrl);

  router.get("/:shortUrlId", urlController.getUrl);

  expressApp.use("/shorten-urls", router);
}
