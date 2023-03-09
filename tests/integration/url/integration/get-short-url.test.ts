import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { randomUUID } from "crypto";
import { startWebServer, stopWebServer } from "../../../../src/server";
import { UrlResponse } from "../../../../src/url/url-response";

let axiosAPIClient: AxiosInstance;
beforeAll(async () => {
  const apiConnection = await startWebServer();

  const axiosConfig: CreateAxiosDefaults = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true,
  };

  axiosAPIClient = axios.create(axiosConfig);
});

afterAll(async () => {
  stopWebServer();
});

describe("/api", () => {
  describe("GET /shorten-urls", () => {
    test("When a short URL is accessed, Then the request should be redirected to the original URL with 301 response code", async () => {
      // Arrange
      const url = {
        urlAddress: `https://www.google.com/${randomUUID()}`,
      };

      const shortenUrlResponse = await axiosAPIClient.post<UrlResponse>(
        "/shorten-urls",
        url
      );

      const shortUrlId = shortenUrlResponse.data.urlShortId;
      const originalUrl = shortenUrlResponse.data.originalUrl;

      // Act
      const redirectResponse = await axiosAPIClient.get(
        `/shorten-urls/${shortUrlId}`,
        {
          maxRedirects: 0,
        }
      );

      //Assert;
      expect(redirectResponse.status).toBe(301);
      expect(redirectResponse.headers.location).toBe(originalUrl);
    });

    test("When a non-existent short URL is accessed, Then a 404 response code should be returned", async () => {
      // Arrange
      const nonExistentShortUrlId = "non-existent-id";

      // Act
      const response = await axiosAPIClient.get(
        `/shorten-urls/${nonExistentShortUrlId}`
      );

      //Assert;
      expect(response.status).toBe(404);
    });
  });
});
