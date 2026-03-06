import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Create3DGenerationDto } from "../dto/create-generation.dto";
import { GeneratorService } from "src/3d-processing/core/services/3d-generator.service";
import { FilterRequest } from "src/@core/services/mongo-query.service";
import { User, UserJwt } from "src/@decorators/user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { LikeService } from "src/integration/core/service/like.service";

@Controller("api/v1/3d-generation")
export class GeneratorController {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly likeService: LikeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async generate(
    @Body() dto: Create3DGenerationDto,
    @User() user,
  ): Promise<any> {
    return this.generatorService.startGeneration(dto, user);
  }

  @Get(":id")
  async getModel3DById(@Param("id") id: string) {
    return this.generatorService.getModel3DById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/search")
  async search(@Body() filterRequest: FilterRequest, @User() user: UserJwt) {
    return this.generatorService.search(filterRequest, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/like")
  async toggleLike(@Param("id") modelId: string, @User() user: UserJwt) {
    const userId = user.id;
    return this.likeService.toggleLike(modelId, userId);
  }
}
