import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class TextureMapsResponseDto {
  @ApiPropertyOptional()
  @Expose()
  baseColor?: string;

  @ApiPropertyOptional()
  @Expose()
  metallic?: string;

  @ApiPropertyOptional()
  @Expose()
  normal?: string;

  @ApiPropertyOptional()
  @Expose()
  roughness?: string;
}

export class ModelUrlsResponseDto {
  @ApiPropertyOptional()
  @Expose()
  glb?: string;

  @ApiPropertyOptional()
  @Expose()
  fbx?: string;

  @ApiPropertyOptional()
  @Expose()
  obj?: string;

  @ApiPropertyOptional()
  @Expose()
  usdz?: string;

  @ApiPropertyOptional()
  @Expose()
  preRemeshedGlb?: string;
}

export class TaskErrorResponseDto {
  @ApiPropertyOptional()
  @Expose()
  message?: string;
}

export class EmbeddedUserResponseDto {
  @ApiProperty()
  @Expose({ name: "_id" })
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class Model3DResponseDto {
  @ApiProperty()
  @Expose({ name: "_id" })
  id: string;

  @ApiPropertyOptional()
  @Expose()
  name?: string;

  @ApiProperty()
  @Expose()
  externalId: string;

  @ApiProperty()
  @Expose()
  status: string; // ou MeshyStatus se você exportar o enum/type

  @ApiPropertyOptional()
  @Expose()
  type?: string;

  @ApiPropertyOptional()
  @Expose()
  imageUrl?: string;

  @ApiPropertyOptional()
  @Expose()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @Expose()
  texturePrompt?: string;

  @ApiPropertyOptional({ type: ModelUrlsResponseDto })
  @Expose()
  @Type(() => ModelUrlsResponseDto)
  modelUrls?: ModelUrlsResponseDto;

  @ApiPropertyOptional({ type: [TextureMapsResponseDto] })
  @Expose()
  @Type(() => TextureMapsResponseDto)
  textureUrls?: TextureMapsResponseDto[];

  @ApiPropertyOptional()
  @Expose()
  progress?: number;

  @ApiPropertyOptional()
  @Expose()
  precedingTasks?: number;

  @ApiPropertyOptional({ type: TaskErrorResponseDto })
  @Expose()
  @Type(() => TaskErrorResponseDto)
  taskError?: TaskErrorResponseDto;

  @ApiPropertyOptional()
  @Expose()
  startedAt?: number;

  @ApiPropertyOptional()
  @Expose()
  expiresAt?: number;

  @ApiPropertyOptional()
  @Expose()
  finishedAt?: number;

  @ApiPropertyOptional({ type: EmbeddedUserResponseDto })
  @Expose()
  @Type(() => EmbeddedUserResponseDto)
  user?: EmbeddedUserResponseDto;

  @ApiProperty()
  @Expose()
  isStoredLocally: boolean;

  @ApiProperty()
  @Expose()
  likesCount: number;

  @ApiPropertyOptional()
  @Expose()
  isLikedByMe?: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
