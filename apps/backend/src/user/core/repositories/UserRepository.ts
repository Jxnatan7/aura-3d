import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserRole } from "../schemas/user.schema";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByIdOrThrow(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findByRole(role: UserRole): Promise<UserDocument[]> {
    return this.userModel.find({ role }).sort({ createdAt: -1 }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateById(
    id: string,
    updateData: Partial<User>,
  ): Promise<UserDocument> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();

    if (!updated) throw new NotFoundException(`User with id ${id} not found`);
    return updated;
  }

  async updateByEmail(
    email: string,
    updateData: Partial<User>,
  ): Promise<UserDocument> {
    const updated = await this.userModel
      .findOneAndUpdate({ email }, { $set: updateData }, { new: true })
      .exec();

    if (!updated)
      throw new NotFoundException(`User with email ${email} not found`);
    return updated;
  }

  async updateToken(id: string, token: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { $set: { token } });
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`User with id ${id} not found`);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!(await this.userModel.exists({ email }));
  }

  async existsByPhone(phone: string): Promise<boolean> {
    return !!(await this.userModel.exists({ phone }));
  }

  getModel() {
    return this.userModel;
  }
}
