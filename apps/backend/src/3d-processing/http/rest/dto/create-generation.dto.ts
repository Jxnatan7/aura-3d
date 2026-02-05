import { IsEnum, IsOptional, IsString } from "class-validator";

export class Create3DGenerationDto {
  @IsString()
  name: string;

  @IsString()
  imageBase64: string;

  @IsOptional()
  @IsEnum(["standard", "lowpoly"])
  modelType?: "standard" | "lowpoly";
}
