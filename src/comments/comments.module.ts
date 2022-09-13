import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './entities/comment.entity';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports :[MongooseModule.forFeature([{name:'Comment',schema:CommentSchema}]), PostsModule],
  providers: [CommentsResolver, CommentsService ]
})
export class CommentsModule {}
