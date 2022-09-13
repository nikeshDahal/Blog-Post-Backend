import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from '../posts/posts.service';
import { CommentsModule } from './comments.module';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private commentsModule:Model<Comment>,
    private postService : PostsService){}

  async create(CurrentUser:any,createCommentInput: CreateCommentInput) {
    const post = await this.postService.findOne(createCommentInput.id)
    if(!post){
      throw new NotFoundException("Post not found")
    }
    console.log("post=>",post)
    const newComment = new this.commentsModule({
      comment:createCommentInput.comment,
      postId:createCommentInput.id,
      commentedBy:CurrentUser.id
    })
    const createdComment = await newComment.save();
    console.log("comment created =>", createdComment);

    const comment =await  this.commentsModule.aggregate([
      {
        $match: {
          _id: createdComment._id,
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'postId',
        },
      },
      { $unwind: '$postId' },
    ]);
    return comment;
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  update(updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${updateCommentInput.id} comment`;
  }

  remove(id: string) {
    return `This action removes a #${id} comment`;
  }
}
