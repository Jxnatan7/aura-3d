import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Model3D, Model3DDocument } from "../schemas/model-3d.schema";
import { ModelUpdatePayload } from "../service/model-processor.service";

@Injectable()
export class Model3DRepository {
  constructor(
    @InjectModel(Model3D.name)
    private readonly model3DModel: Model<Model3DDocument>,
  ) {}

  async create(data: Partial<Model3D>): Promise<Model3D> {
    const newTask = new this.model3DModel(data);
    return newTask.save();
  }

  async findByExternalId(externalId: string): Promise<Model3DDocument | null> {
    return this.model3DModel.findOne({ externalId }).exec();
  }

  async updateByExternalId(
    externalId: string,
    updateData: Partial<Model3D>,
  ): Promise<Model3D> {
    const updated = await this.model3DModel
      .findOneAndUpdate({ externalId }, { $set: updateData }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(
        `Model with externalId ${externalId} not found`,
      );
    }
    return updated;
  }

  async findAllByUserId(userId: string): Promise<Model3D[]> {
    return this.model3DModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  getModel() {
    return this.model3DModel;
  }

  async findPending(limit: number): Promise<Model3DDocument[]> {
    return this.model3DModel
      .find({
        status: "SUCCEEDED",
        $or: [
          { isStoredLocally: false },
          { isStoredLocally: { $exists: false } },
        ],
      })
      .limit(limit)
      .exec();
  }

  async markAsStored(id: string, payload: ModelUpdatePayload): Promise<void> {
    await this.model3DModel.updateOne({ _id: id }, { $set: payload });
  }

  async findById(id: string): Promise<Model3DDocument | null> {
    return this.model3DModel.findById(id).exec();
  }
}
