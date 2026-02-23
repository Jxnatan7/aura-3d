import { Injectable, Logger } from "@nestjs/common";
import * as sharp from "sharp";

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);

  async removeBackground(buffer: Buffer): Promise<Buffer> {
    try {
      const { data, info } = await sharp(buffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const targetR = 30;
      const targetG = 30;
      const targetB = 30;

      const tolerance = 5;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const isMatch =
          Math.abs(r - targetR) <= tolerance &&
          Math.abs(g - targetG) <= tolerance &&
          Math.abs(b - targetB) <= tolerance;

        if (isMatch) {
          data[i + 3] = 0;
        }
      }

      return await sharp(data, {
        raw: {
          width: info.width,
          height: info.height,
          channels: 4,
        },
      })
        .png()
        .toBuffer();
    } catch (error) {
      this.logger.error(
        `Erro ao processar imagem: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
