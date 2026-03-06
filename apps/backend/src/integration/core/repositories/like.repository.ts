import { Injectable } from "@nestjs/common";
import { Like, LikeDocument } from "../schemas/like.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Types } from "mongoose";
import { toObjectIdOrLeave } from "src/@core/services/mongo-query.service";

@Injectable()
export class LikeRepository {
  constructor(
    @InjectModel(Like.name)
    private readonly likeModel: Model<LikeDocument>,
  ) {}

  async findByModelIdsAndUserId(modelIds: Types.ObjectId[], userId: string) {
    return this.likeModel
      .find({
        user: toObjectIdOrLeave(userId),
        model: { $in: modelIds },
      })
      .select("model")
      .lean();
  }

  async exists({
    modelId,
    userId,
  }: {
    modelId: string;
    userId: Types.ObjectId | string;
  }) {
    return this.likeModel.exists({ model: modelId, user: userId });
  }
}
