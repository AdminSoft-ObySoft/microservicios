import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    // para nuestra restapi
    // const app = await NestFactory.create(AppModule);
    // await app.listen(envs.port);
    // app.setGlobalPrefix('api');

    // para que sea un microservicio
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.TCP,
            options: {
                port: envs.port,
            },
        }
    );
    // const app = await NestFactory.create(AppModule);
    const logger = new Logger('Main');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    await app.listen();
    logger.log(`Products microservice is running on port: ${envs.port}`);
}
bootstrap();
