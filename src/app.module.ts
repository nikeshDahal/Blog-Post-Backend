import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import {AppService} from "./app.service"

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/Blog-Nest-project'),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context:({req})=>({req}),
      sortSchema: true,
    }),
    UsersModule,
    AuthModule,
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
