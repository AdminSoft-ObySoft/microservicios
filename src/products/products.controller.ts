import { Controller, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // @Post()
    @MessagePattern('create-product')
    create(@Payload() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    // @Get()
    @MessagePattern('find-all-products')
    findAll(@Query() paginationDto: PaginationDto) {
        return this.productsService.findAll(paginationDto);
    }

    // @Get(':id')
    @MessagePattern('find-one-product')
    findOne(@Payload('id') id: string) {
        return this.productsService.findOne(+id);
    }

    // @Patch(':id')
    @MessagePattern('update-product')
    update(
        // @Param('id') id: string,
        // @Body() updateProductDto: UpdateProductDto
        @Payload() updateProductDto: UpdateProductDto
    ) {
        return this.productsService.update(
            updateProductDto.id,
            updateProductDto
        );
    }

    // @Delete(':id')
    @MessagePattern('remove-product')
    remove(@Payload('id') id: string) {
        return this.productsService.remove(+id);
    }
}
