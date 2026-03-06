import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Like, LikeDocument } from "../schemas/like.schema";
import { Model3D, Model3DDocument } from "../schemas/model-3d.schema";

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Model3D.name) private model3dModel: Model<Model3DDocument>,
  ) {}

  async toggleLike(
    modelId: string,
    userId: string,
  ): Promise<{ liked: boolean; likesCount: number }> {
    const userObjectId = new Types.ObjectId(userId);
    const modelObjectId = new Types.ObjectId(modelId);

    const existingLike = await this.likeModel.findOne({
      user: userObjectId,
      model: modelObjectId,
    });

    if (existingLike) {
      await this.likeModel.deleteOne({ _id: existingLike._id });
      const updatedModel = await this.model3dModel.findByIdAndUpdate(
        modelObjectId,
        { $inc: { likesCount: -1 } },
        { new: true },
      );

      return { liked: false, likesCount: updatedModel?.likesCount || 0 };
    } else {
      try {
        await this.likeModel.create({
          user: userObjectId,
          model: modelObjectId,
        });
        const updatedModel = await this.model3dModel.findByIdAndUpdate(
          modelObjectId,
          { $inc: { likesCount: 1 } },
          { new: true },
        );

        return { liked: true, likesCount: updatedModel?.likesCount || 1 };
      } catch (error) {
        if (error.code === 11000) {
          throw new ConflictException("Usuário já curtiu este modelo.");
        }
        throw error;
      }
    }
  }
}
