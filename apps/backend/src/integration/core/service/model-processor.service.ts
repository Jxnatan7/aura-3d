import { Injectable } from "@nestjs/common";
import {
  AssetMigratorService,
  AssetUrl,
  BasePath,
  ExternalId,
} from "./asset-migrator.service";
import { Model3D, ModelUrls } from "../schemas/model-3d.schema";

export class ModelUpdatePayload {
  constructor(
    public readonly isStoredLocally: boolean,
    public readonly thumbnailUrl?: string,
    public readonly modelUrls?: ModelUrls,
  ) {}
}

@Injectable()
export class ModelProcessorService {
  constructor(private readonly migrator: AssetMigratorService) {}

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
