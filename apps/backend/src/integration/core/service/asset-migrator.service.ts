import { Injectable, Logger } from "@nestjs/common";
import { StorageService } from "./storage.service";

export class ExternalId {
  constructor(public readonly value: string) {}
}

export class AssetUrl {
  constructor(public readonly value: string) {}

  isExternal(): boolean {
    return typeof this.value === "string" && !this.value.includes("aura");
  }
}

export class ModelFormat {
  constructor(public readonly value: string) {}
}

export class BasePath {
  constructor(private readonly id: ExternalId) {}

  toString(): string {
    return `models/${this.id.value}`;
  }

  toThumbnailPath(): string {
    return `${this.toString()}/thumbnail.png`;
  }

  toFormatPath(format: ModelFormat): string {
    return `${this.toString()}/${this.id.value}.${format.value}`;
  }
}

@Injectable()
export class AssetMigratorService {
  private readonly logger = new Logger(AssetMigratorService.name);

  constructor(private readonly storage: StorageService) {}

  async migrateThumbnail(
    url: AssetUrl,
    path: BasePath,
  ): Promise<string | undefined> {
    if (!url.isExternal()) return url.value;
    return this.tryDownload(url, path.toThumbnailPath());
  }

  async migrateFormats(
    urls: Record<string, string>,
    path: BasePath,
  ): Promise<Record<string, string>> {
    const formats = Object.entries(urls);
    const migratedEntries = await Promise.all(
      formats.map((entry) => this.migrateFormat(entry, path)),
    );
    return Object.fromEntries(migratedEntries);
  }

  private async migrateFormat(
    [formatStr, urlStr]: [string, string],
    path: BasePath,
  ): Promise<[string, string]> {
    const url = new AssetUrl(urlStr);
    const format = new ModelFormat(formatStr);

    if (!url.isExternal()) return [format.value, url.value];

    const localUrl = await this.tryDownload(url, path.toFormatPath(format));
    return [format.value, localUrl || url.value];
  }

  private async tryDownload(
    url: AssetUrl,
    path: string,
  ): Promise<string | undefined> {
    try {
      const result = await this.storage.saveFileFromUrl(url.value, path);
      return result;
    } catch (error) {
      this.logger.warn(
        `Falha ao baixar asset da url ${url.value}: ${(error as Error).message}`,
      );
      return undefined;
    }
  }
}
