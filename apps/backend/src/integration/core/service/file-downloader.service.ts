import { Injectable } from "@nestjs/common";
import { StorageEnvironment } from "./storage.service";
import axios, { AxiosResponse } from "axios";

export class FilePayload {
  constructor(
    public readonly buffer: Buffer,
    public readonly contentType: string,
  ) {}
}

@Injectable()
export class FileDownloaderService {
  constructor(private readonly env: StorageEnvironment) {}

  async download(url: string): Promise<FilePayload> {
    const response = await this.fetchData(url);
    return this.buildPayload(response);
  }

  private async fetchData(url: string): Promise<AxiosResponse> {
    return axios.get(url, {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${this.env.meshyApiKey}` },
    });
  }

  private buildPayload(response: AxiosResponse): FilePayload {
    const buffer = Buffer.from(response.data);
    const headers = response.headers;
    const contentType = headers["content-type"] || "application/octet-stream";
    return new FilePayload(buffer, contentType);
  }
}
