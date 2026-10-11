import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Artists+Music API')
    .setDescription('API documentation for Artists and Songs service')
    .setVersion('1.0')
    .addBasicAuth()
    .addSecurityRequirements('bearer')
    .build();

  const swagger = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, swagger, {
    useGlobalPrefix: true,
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
