import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model3DDocument } from "../schemas/model-3d.schema";
import { ModelProcessorService } from "./model-processor.service";
import { Model3DRepository } from "../repositories/model-3d.repository";

@Injectable()
export class ModelArchiverService {
  private readonly logger = new Logger(ModelArchiverService.name);

  constructor(
    private readonly repository: Model3DRepository,
    private readonly processor: ModelProcessorService,
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

  async executeProcess(model: Model3DDocument): Promise<void> {
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
