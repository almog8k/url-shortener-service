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
  describe("POST /shorten-urls", () => {
    let existedUrl: string;
    test("When adding a new valid url, Then should get back the URL short id with 200 response approval", async () => {
      // Arrange
      const url = {
        urlAddress: `https://www.twitter.com/${randomUUID()}`,
      };

      // Act
      const receivedAPIResponse = await axiosAPIClient.post<UrlResponse>(
        "/shorten-urls",
        url
      );

      // Assert
      expect(receivedAPIResponse).toMatchObject({
        data: {
          urlShortId: expect.any(String),
          originalUrl: expect.any(String),
        },
      });
      existedUrl = receivedAPIResponse.data.originalUrl;
    });

    test("When adding short url id with invalid URL, stop and return 400", async () => {
      // Arrange
      const url = {
        urlAddress: `invalid-url/${randomUUID()}`,
      };

      // Act
      const shortUrlResponse = await axiosAPIClient.post("/shorten-urls", url);

      // Assert
      expect(shortUrlResponse.status).toBe(400);
    });

    test("When adding short url id which existed, stop and return 409", async () => {
      // Arrange
      const url = {
        urlAddress: existedUrl,
      };

      // Act
      const shortUrlResponse = await axiosAPIClient.post("/shorten-urls", url);

      // Assert
      expect(shortUrlResponse.status).toBe(409);
    });
  });
});
