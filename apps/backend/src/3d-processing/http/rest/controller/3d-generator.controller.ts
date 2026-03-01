import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Create3DGenerationDto } from "../dto/create-generation.dto";
import { GeneratorService } from "src/3d-processing/core/services/3d-generator.service";
import { FilterRequest } from "src/@core/services/mongo-query.service";
import { User } from "src/@decorators/user.decorator";

@Controller("api/v1/3d-generation")
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

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

  @Post("/search")
  async search(@Body() filterRequest: FilterRequest) {
    return this.generatorService.search(filterRequest);
  }
}
