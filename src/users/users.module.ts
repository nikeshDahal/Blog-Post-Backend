import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';

@Module({
  imports :[MongooseModule.forFeature([{name:'User',schema:UserSchema}])],
  exports :[UsersService ],
  providers: [UsersResolver, UsersService ],
})
export class UsersModule {}
