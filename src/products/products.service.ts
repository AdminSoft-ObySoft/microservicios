import {
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from './generated/prisma'
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('ProductsService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma Client connected successfully');
    }

    create(createProductDto: CreateProductDto) {
        // Example: create a product in the database
        this.logger.log(
            `Creating product: ${JSON.stringify(createProductDto)}`
        );
        return this.product.create({ data: createProductDto });
    }

    async findAll(paginationDto: PaginationDto) {
        // Example: return all products from the database
        const { page, limit } = paginationDto;
        const totalCount = await this.product.count({
            where: { available: true },
        });
        const lastPage = Math.ceil(totalCount / (limit ?? 10));
        return {
            data: await this.product.findMany({
                skip: (page ?? 1 - 1) * (limit ?? 10),
                take: limit ?? 10,
                where: { available: true },
                orderBy: { createdAt: 'desc' }, // Example ordering
            }),
            meta: {
                totalRegisters: totalCount,
                lastPage,
                page: page ?? 1,
                size: limit ?? 10,
            },
        };
    }

    async findOne(id: number) {
        // Example: return a single product by id
        const product = await this.product.findUnique({
            where: { id, available: true },
        });
        if (!product) {
            throw new NotFoundException(`Product with id #${id} not found`);
        }

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const { id: __, ...data } = updateProductDto;
        this.logger.log(
            `Updating product with id #${__}: ${JSON.stringify(data)}`
        );

        await this.findOne(id); // Ensure the product exists before updating
        return this.product.update({ where: { id }, data });
    }

    async remove(id: number) {
        await this.findOne(id); // Ensure the product exists before deleting
        // return this.product.delete({ where: { id } });
        const product = await this.product.update({
            where: { id },
            data: { available: false },
        });
        return product;
    }
}
