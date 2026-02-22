import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { FilePayload } from "./file-downloader.service";
import { StorageEnvironment } from "./storage.service";

@Injectable()
export class S3UploaderService {
  private readonly client: S3Client;
  private readonly env: StorageEnvironment;

  constructor() {
    this.env = new StorageEnvironment();
    this.client = this.buildClient();
  }

  async upload(path: string, payload: FilePayload): Promise<string> {
    const command = this.createCommand(path, payload);
    await this.client.send(command);
    return this.buildPublicUrl(path);
  }

  private buildClient(): S3Client {
    return new S3Client({
      region: this.env.region || "us-east-1",
      endpoint: this.env.endpoint || "http://minio:9000",
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.env.accessKeyId || "admin",
        secretAccessKey: this.env.secretAccessKey || "admin",
      },
    });
  }

  private createCommand(path: string, payload: FilePayload): PutObjectCommand {
    return new PutObjectCommand({
      Bucket: this.env.bucketName,
      Key: path,
      Body: payload.buffer,
      ContentType: payload.contentType,
    });
  }

  private buildPublicUrl(path: string): string {
    const endpoint = this.env.publicEndpoint;
    const bucket = this.env.bucketName;
    const target = path;
    return `${endpoint}/${bucket}/${target}`;
  }
}
