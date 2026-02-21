import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { StorageEnvironment } from "./storage.service";
import { FilePayload } from "./file-downloader.service";

@Injectable()
export class S3UploaderService {
  private readonly client: S3Client;

  constructor(private readonly env: StorageEnvironment) {
    this.client = this.buildClient();
  }

  async upload(path: string, payload: FilePayload): Promise<string> {
    const command = this.createCommand(path, payload);
    await this.client.send(command);
    return this.buildPublicUrl(path);
  }

  private buildClient(): S3Client {
    return new S3Client({
      region: this.env.region,
      endpoint: this.env.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.env.accessKeyId,
        secretAccessKey: this.env.secretAccessKey,
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
