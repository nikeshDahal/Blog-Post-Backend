import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './post.entity';
// import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
// import { UsersModule } from '../users/users.module';
// import { User } from '../users/user.entity';


@Module({
  imports :[MongooseModule.forFeature([{name:'Post',schema:PostSchema}]) , UsersModule ],
  exports :[PostsService , ],
  providers: [PostsResolver, PostsService  ]
})
export class PostsModule {}
