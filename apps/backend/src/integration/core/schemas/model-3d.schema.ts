import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { MeshyStatus } from "../interfaces/meshy-types";

export type Model3DDocument = Model3D & Document;

@Schema({ _id: false })
class TextureMaps {
  @Prop() baseColor?: string;
  @Prop() metallic?: string;
  @Prop() normal?: string;
  @Prop() roughness?: string;
}

@Schema({ _id: false })
class TaskError {
  @Prop() message?: string;
}

@Schema({ _id: false })
class ModelUrls {
  @Prop() glb?: string;
  @Prop() fbx?: string;
  @Prop() obj?: string;
  @Prop() usdz?: string;

  @Prop()
  preRemeshedGlb?: string;
}

@Schema({ timestamps: true, collection: "models_3d" })
export class Model3D extends Document {
  @Prop()
  name?: string;

  @Prop({ required: true, index: true })
  externalId: string;

  @Prop({ type: String, required: true, default: "PENDING" })
  status: MeshyStatus;

  @Prop()
  type?: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop()
  texturePrompt?: string;

  @Prop({ type: ModelUrls })
  modelUrls?: ModelUrls;

  @Prop({ type: [TextureMaps] })
  textureUrls?: TextureMaps[];

  @Prop()
  progress?: number;

  @Prop()
  precedingTasks?: number;

  @Prop({ type: TaskError })
  taskError?: TaskError;

  @Prop()
  startedAt?: number;

  @Prop()
  externalCreatedAt?: number;

  @Prop()
  expiresAt?: number;

  @Prop()
  finishedAt?: number;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  userId?: Types.ObjectId;

  @Prop({ type: Object })
  rawMetadata?: any;

  @Prop({ default: false, index: true })
  isStoredLocally: boolean;
}

export const ModelSchema = SchemaFactory.createForClass(Model3D);
