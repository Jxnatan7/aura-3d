import { Injectable, Logger } from "@nestjs/common";
import { FileDownloaderService } from "./file-downloader.service";
import { S3UploaderService } from "./s3-uploader.service";
import { ImageProcessingService } from "./image-processing.service";

export class FilePayload {
  constructor(
    public readonly buffer: Buffer,
    public readonly contentType: string,
  ) {}
}

export class StorageEnvironment {
  public readonly region = "us-east-1";
  public readonly endpoint = process.env.BUCKET_ENDPOINT || "http://minio:9000";
  public readonly accessKeyId = process.env.BUCKET_ACCESS_KEY || "admin";
  public readonly secretAccessKey = process.env.BUCKET_ACCESS_SECRET || "admin";
  public readonly bucketName = process.env.BUCKET_NAME || "models-3d";
  public readonly publicEndpoint =
    process.env.BUCKET_ENDPOINT || "http://localhost:9000";
  public readonly meshyApiKey = process.env.MESHY_API_KEY || "";
}
@Injectable()
export class StorageService {
  constructor(
    private readonly downloader: FileDownloaderService,
    private readonly uploader: S3UploaderService,
    private readonly imageProcessor: ImageProcessingService,
  ) {}

  async saveFileFromUrl(url: string, path: string): Promise<string> {
    try {
      return await this.processFile(url, path);
    } catch (error) {
      this.handleError(url, error as Error);
    }
  }

  private async processFile(url: string, path: string): Promise<string> {
    let payload = await this.downloader.download(url);

    const isThumbnail = url.includes("preview.png");

    if (isThumbnail) {
      const processedBuffer = await this.imageProcessor.removeBackground(
        payload.buffer,
      );
      payload = new FilePayload(processedBuffer, "image/png");
    }

    return this.uploader.upload(path, payload);
  }

  private handleError(url: string, error: Error): never {
    const logger = new Logger(StorageService.name);
    logger.error(`Erro ao salvar arquivo ${url}: ${error.message}`);
    throw error;
  }
}
