import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Product } from '../../entities/product.entity';
import { RolesGuard } from '@/common/roles.guard';
import { AuthGuard } from '@/common/auth.guard';
import { Roles } from '@/common/roles.decorator';
import { Role } from '@/common/enum';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CatgoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get()
  async getAllCatgories() {
    const data = await this.categoryService.findAll();
    return data;
  }

  @Get(':id')
  GetOneProduct(@Param('id') id: number) {
    const product = this.categoryService.findOne(id);
    return product;
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  create(@Body() body: Partial<Product>) {
    return this.categoryService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(@Param('id') id: number, @Body() body: Partial<Product>) {
    const updated = this.categoryService.update(id, body);
    if (!updated) throw new Error('Product not found'); // or use HttpException
    return updated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  delete(@Param('id') id: number) {
    const deleted = this.categoryService.delete(id);
    return deleted;
  }
}
