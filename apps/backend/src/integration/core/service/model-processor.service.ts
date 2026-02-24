import { Injectable } from "@nestjs/common";
import {
  AssetMigratorService,
  AssetUrl,
  BasePath,
  ExternalId,
} from "./asset-migrator.service";
import { Model3D, ModelUrls, TextureMaps } from "../schemas/model-3d.schema";

export class ModelUpdatePayload {
  constructor(
    public readonly isStoredLocally: boolean,
    public readonly thumbnailUrl?: string,
    public readonly modelUrls?: ModelUrls,
    public readonly textureUrls?: TextureMaps[],
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
    const textureUrls = await this.processTextureUrls(
      model.textureUrls,
      basePath,
    );

    return new ModelUpdatePayload(true, thumbnailUrl, modelUrls, textureUrls);
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

  private async processTextureUrls(
    urls: TextureMaps[] | undefined,
    basePath: BasePath,
  ): Promise<TextureMaps[] | undefined> {
    if (urls?.length === 0) return undefined;
    const newUrls = urls?.map((url) => {
      const parsedUrls = JSON.parse(JSON.stringify(url));
      return this.migrator.migrateFormats(parsedUrls, basePath);
    }) as TextureMaps[];
    return newUrls;
  }
}
