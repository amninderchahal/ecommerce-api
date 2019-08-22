import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelDeclarations } from './models/model.declarations';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { routesWithoutAuth } from './routes-without-auth';
import { TokenHelper } from './helpers/token-helper';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { HashHelper } from './helpers/hash-helper';
import { UserService } from './services/user/user.service';
import { EmailService } from './services/email/email.service';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './services/product/product.service';
import { UserController } from './controllers/user/user.controller';
import { CartService } from './services/cart/cart.service';
import { CartController } from './controllers/cart/cart.controller';
import { MigrationModule } from './migrations/migration.module';


@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        console.log('Connecting to db: ', process.env.DB_CONNECTION);
        return { uri: process.env.DB_CONNECTION };
      }
    }),
    MongooseModule.forFeature(modelDeclarations),
    MigrationModule
  ],
  controllers: [
    AuthController,
    ProductController,
    UserController,
    CartController
  ],
  providers: [
    TokenHelper,
    HashHelper,
    AuthService,
    UserService,
    EmailService,
    ProductService,
    CartService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .with(routesWithoutAuth)
      .forRoutes('*');
  }
}
