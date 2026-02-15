import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Model3D, Model3DDocument } from "../schemas/model-3d.schema";
import { StorageService } from "./storage.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class ModelArchiverService {
  private readonly logger = new Logger(ModelArchiverService.name);

  constructor(
    @InjectModel(Model3D.name) private model3dModel: Model<Model3DDocument>,
    private storageService: StorageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.logger.log(
      "Iniciando verificação de modelos para arquivamento local...",
    );
    const modelsToProcess = await this.model3dModel
      .find({
        status: "SUCCEEDED",
        $or: [
          { isStoredLocally: false },
          { isStoredLocally: { $exists: false } },
        ],
      })
      .limit(10)
      .exec();

    if (modelsToProcess.length === 0) {
      this.logger.log("Nenhum modelo pendente para arquivamento.");
      return;
    }

    this.logger.log(
      `Encontrados ${modelsToProcess.length} modelos para baixar.`,
    );

    for (const model of modelsToProcess) {
      await this.processModel(model);
    }
  }

  private async processModel(model: Model3DDocument) {
    try {
      this.logger.debug(`Arquivando modelo: ${model.externalId}`);

      const basePath = `models/${model.externalId}`;
      const updates: any = { isStoredLocally: true };

      if (
        model.thumbnailUrl &&
        typeof model.thumbnailUrl === "string" &&
        model.thumbnailUrl.startsWith("http")
      ) {
        try {
          const localThumb = await this.storageService.saveFileFromUrl(
            model.thumbnailUrl,
            `${basePath}/thumbnail.png`,
          );
          updates.thumbnailUrl = localThumb;
        } catch (e) {
          this.logger.warn(`Falha ao baixar thumbnail: ${e.message}`);
        }
      }
      if (model.modelUrls) {
        updates.modelUrls = {};

        const urlsObj = JSON.parse(JSON.stringify(model.modelUrls));

        for (const format of Object.keys(urlsObj)) {
          const url = urlsObj[format];

          if (
            typeof url === "string" &&
            url.startsWith("http") &&
            !url.includes("localhost") &&
            !url.includes("minio")
          ) {
            try {
              const localUrl = await this.storageService.saveFileFromUrl(
                url,
                `${basePath}/${model.externalId}.${format}`,
              );
              updates.modelUrls[format] = localUrl;
            } catch (e) {
              this.logger.warn(
                `Falha ao baixar formato ${format}: ${e.message}`,
              );
              updates.modelUrls[format] = url;
            }
          } else {
            updates.modelUrls[format] = url;
          }
        }
      }
      await this.model3dModel.updateOne({ _id: model._id }, { $set: updates });

      this.logger.log(
        `Modelo ${model.externalId} migrado para MinIO com sucesso.`,
      );
    } catch (error) {
      this.logger.error(`Falha ao arquivar modelo ${model.externalId}`, error);
    }
  }

  //   @Cron(CronExpression.EVERY_10_SECONDS)
  // async testCron() {
  //   this.logger.log("Iniciando teste para envio de dados para client via sse");

  //   let progress = 0;

  //   setInterval(() => {
  //     progress += 10;
  //     if (progress > 100) return;
  //     this.eventEmitter.emit("model.updated", {
  //       id: "1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  //       name: "Modelo Novo",
  //       status: progress >= 100 ? "SUCCEEDED" : "IN_PROGRESS",
  //       isCompleted: progress >= 100,
  //       isGenerating: progress < 100,
  //       progress,
  //       modelUrls: [],
  //     });
  //   }, 1000);
  // }
}
