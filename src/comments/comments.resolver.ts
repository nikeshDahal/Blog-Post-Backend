import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { CurrentUser } from '../auth/current.user';
import { CommentResponse } from './dto/comment-response.output';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentResponse)
  async createComment(@CurrentUser() CurrentUser:any,@Args('createCommentInput') createCommentInput: CreateCommentInput) {
    const[comment] = await this.commentsService.create(CurrentUser,createCommentInput);
    console.log("comments=>", comment)
    return comment;
  }

  @Query(() => [Comment], { name: 'comments' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Mutation(() => Comment)
  updateComment(@Args('updateCommentInput') updateCommentInput: UpdateCommentInput) {
    return this.commentsService.update(updateCommentInput);
  }

  @Mutation(() => Comment)
  removeComment(@Args('id') id: string) {
    return this.commentsService.remove(id);
  }
}
