import { Injectable, Logger } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private readonly logger = new Logger(StorageService.name);
  private readonly BUCKET_NAME = process.env.BUCKET_NAME || "models-3d";

  private readonly PUBLIC_ENDPOINT =
    process.env.BUCKET_ENDPOINT || "http://localhost:9000";

  constructor() {
    this.s3Client = new S3Client({
      region: "us-east-1",
      endpoint: process.env.BUCKET_ENDPOINT || "http://minio:9000",
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY || "admin",
        secretAccessKey: process.env.BUCKET_ACCESS_SECRET || "admin",
      },
    });
  }

  async saveFileFromUrl(url: string, path: string): Promise<string> {
    try {
      const apiKey = process.env.MESHY_API_KEY;

      const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const buffer = Buffer.from(response.data);

      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.BUCKET_NAME,
          Key: path,
          Body: buffer,
          ContentType: contentType,
        }),
      );

      return `${this.PUBLIC_ENDPOINT}/${this.BUCKET_NAME}/${path}`;
    } catch (error) {
      this.logger.error(`Erro ao salvar arquivo ${url}: ${error.message}`);
      throw error;
    }
  }
}
