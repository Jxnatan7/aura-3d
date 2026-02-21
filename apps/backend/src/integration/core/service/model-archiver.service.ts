import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Model3D,
  Model3DDocument,
  ModelUrls,
} from "../schemas/model-3d.schema";
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

export class ModelUpdatePayload {
  constructor(
    public readonly isStoredLocally: boolean,
    public readonly thumbnailUrl?: string,
    public readonly modelUrls?: ModelUrls,
  ) {}
}

@Injectable()
export class AssetMigrator {
  private readonly logger = new Logger(AssetMigrator.name);

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

@Injectable()
export class ModelRepository {
  constructor(
    @InjectModel(Model3D.name) private readonly model: Model<Model3DDocument>,
  ) {}

  async findPending(limit: number): Promise<Model3DDocument[]> {
    return this.model
      .find({
        status: "SUCCEEDED",
        $or: [
          { isStoredLocally: false },
          { isStoredLocally: { $exists: false } },
        ],
      })
      .limit(limit)
      .exec();
  }

  async markAsStored(id: string, payload: ModelUpdatePayload): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: payload });
  }
}

@Injectable()
export class ModelProcessor {
  constructor(private readonly migrator: AssetMigrator) {}

  async process(model: Partial<Model3D>): Promise<ModelUpdatePayload> {
    const externalId = new ExternalId(model.externalId || "");
    const basePath = new BasePath(externalId);

    const thumbnailUrl = await this.processThumbnail(
      model.thumbnailUrl,
      basePath,
    );
    const modelUrls = await this.processModelUrls(model.modelUrls, basePath);

    return new ModelUpdatePayload(true, thumbnailUrl, modelUrls);
  }

  private async processThumbnail(
    url: string | undefined,
    basePath: BasePath,
  ): Promise<string | undefined> {
    if (!url) return undefined;
    return this.migrator.migrateThumbnail(new AssetUrl(url), basePath);
  }

  private async processModelUrls(
    urls: ModelUrls | undefined,
    basePath: BasePath,
  ): Promise<ModelUrls | undefined> {
    if (!urls) return undefined;
    const parsedUrls = JSON.parse(JSON.stringify(urls));
    return this.migrator.migrateFormats(parsedUrls, basePath);
  }
}

@Injectable()
export class ModelArchiverService {
  private readonly logger = new Logger(ModelArchiverService.name);

  constructor(
    private readonly repository: ModelRepository,
    private readonly processor: ModelProcessor,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron(): Promise<void> {
    this.logger.log(
      "Iniciando verificação de modelos para arquivamento local...",
    );
    const pendingModels = await this.repository.findPending(10);
    await this.processCollection(pendingModels);
  }

  private async processCollection(models: Model3DDocument[]): Promise<void> {
    if (models.length === 0) return this.notifyEmpty();

    this.logger.log(`Encontrados ${models.length} modelos para baixar.`);
    await Promise.all(models.map((model) => this.executeProcess(model)));
  }

  private notifyEmpty(): void {
    this.logger.log("Nenhum modelo pendente para arquivamento.");
  }

  private async executeProcess(model: Model3DDocument): Promise<void> {
    try {
      this.logger.debug(`Arquivando modelo: ${model.externalId}`);
      const payload = await this.processor.process(model);
      await this.repository.markAsStored(model.id, payload);
      this.logger.log(`Modelo ${model.externalId} migrado com sucesso.`);
    } catch (error) {
      this.logger.error(
        `Falha ao arquivar modelo ${model.externalId}`,
        (error as Error).stack,
      );
    }
  }
}
