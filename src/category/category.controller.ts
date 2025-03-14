import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get('/:id')
  async getCategoriesById(@Param('id') id: number) {
    console.log(123);

    const category = await this.categoryService.getOneById(id);
    console.log(1, category);

    const products = category?.products;
    return {
      message: 'get',
      data: category,
    };
  }
}
