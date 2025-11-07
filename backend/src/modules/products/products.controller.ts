import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Product } from '../../entities/product.entity';
import { ProductsService } from './products.service';
import { RolesGuard } from '@/common/roles.guard';
import { AuthGuard } from '@/common/auth.guard';
import { Roles } from '@/common/roles.decorator';
import { Role } from '@/common/enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async GetAllProducts(
    @Req() req,
    @Query('max') max: string,
    @Query('min') min: string,
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('category') category?: string[] | undefined | string,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    page = Number(page);
    limit = Number(limit);

    // Normalize category to always be an array
    const categoryArray = Array.isArray(category)
      ? category
      : category
        ? [category]
        : undefined;
    // const bearer = req.headers['authorization'];
    // const authHeader = bearer?.split(' ')[1];
    const bearer = req.headers['cookie'];

    const authHeader = bearer.split('=')[1];

    if (
      authHeader &&
      bearer.split('=')[0] !== 'token' &&
      authHeader !== 'undefined'
    )
      return this.productsService.findAdminAll();

    const categoryIds = categoryArray ? categoryArray?.map(Number) : undefined; // convert to numbers
    const minNum = min !== undefined && min !== '' ? Number(min) : undefined;
    const maxNum = max !== undefined && max !== '' ? Number(max) : undefined;
    const data = await this.productsService.findAll(
      page,
      limit,
      order,
      query,
      minNum,
      maxNum,
      categoryIds,
    );
    return data;
  }

  @Get(':id')
  GetOneProduct(@Param('id') id: number) {
    const product = this.productsService.findOne(id);
    return product;
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  create(@Body() body: Partial<Product>) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(@Param('id') id: number, @Body() body: Partial<Product>) {
    const updated = this.productsService.update(id, body);
    if (!updated) throw new Error('Product not found'); // or use HttpException
    return updated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  delete(@Param('id') id: number) {
    const deleted = this.productsService.delete(id);
    return deleted;
  }
}
