import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type LikeDocument = Like & Document;

@Schema({ timestamps: true, collection: "likes" })
export class Like {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Model3D", required: true })
  model: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index({ user: 1, model: 1 }, { unique: true });
LikeSchema.index({ user: 1 });
