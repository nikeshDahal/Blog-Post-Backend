import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import mongoose, { Model } from 'mongoose';
import { Post } from './post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { pipeline } from 'stream';


@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private postModel: Model<Post>,
    private usersService: UsersService,
  ) {}
  async create(currentUser: any, createPostInput: CreatePostInput) {
    const titleExists = await this.postModel.findOne({
      postTitle: createPostInput.postTitle,
    });
    if (titleExists) {
      throw new BadRequestException('Post title is already taken');
    }
    const { postTitle, postDescription, isPublic } = createPostInput;
    // let ID = new mongoose.Types.ObjectId(currentUser._id);
    let ID = currentUser._id;
    const newPost = new this.postModel({
      postTitle,
      postDescription,
      isPublic,
      postedBy: ID,
    });
    const createdPost = await newPost.save();
    console.log('posts', createdPost);
    const post = this.postModel.aggregate([
      {
        $match: {
          _id: createdPost._id,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'postedBy',
        },
      },
      { $unwind: '$postedBy' },
    ]);
    return post;
  }

  async findAll() {
    const posts = await this.postModel.aggregate([
      {
        $match: {
          isPublic: { $eq: true },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$postedBy' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$userId'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'postedBy',
        },
      },
      { $unwind: '$postedBy' },
      {
        $lookup:{
          from: "comments",
          let:{post_Id:"$_id"},
          pipeline:[{ $match: { $expr: { $eq: ["$$post_Id", "$postId"] } } }],
          as : "totalComments"
        }

      },
      { $addFields: { totalComments: { $size: "$totalComments" }}},
      {
        //stage3 to get comment  details
        $lookup: {
          from: 'comments',
          let: { post_Id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        '$postId',
                        '$$post_Id' /*declared varaible form let */,
                      ],
                    },
                  ],
                },
              },
            },
            {
              $limit: 5,
            },
            {
              $lookup: {
                from:"users",
                let:{user_Id:"$commentedBy"},
                pipeline:[
                  {
                    $match: { $expr: { $and: [{ $eq: ["$_id", "$$user_Id"] }] } }
                  },
                ],
                as:"commentedBy"
              },
            },
            { $unwind: '$commentedBy' },
          ],
          as: 'comments',
        },
      },
    ]);
    return posts;
  }

  async findOne(id: string) {
    // const ID =  new mongoose.Types.ObjectId(id)
    console.log('id', id);
    const post = await this.postModel.findById({ _id: id });
    return post;
  }

  async update(currentUser: any, updatePostInput: UpdatePostInput) {
    const [post] = await this.postModel.find({
      _id: updatePostInput.id,
    });
    console.log('update', post);
    if (post.postedBy.toString() != currentUser._id.toString()) {
      throw new BadRequestException('Author Invalid');
    }
    const titleExists = await this.postModel.findOne({
      postTitle: updatePostInput.postTitle,
    });
    if (titleExists) {
      throw new BadRequestException('Post title is already taken');
    }
    const updatedPost = await this.postModel
      .findOneAndUpdate(
        { _id: updatePostInput.id },
        { $set: updatePostInput },
        { new: true },
      )
      .exec();
    if (!updatedPost) {
      throw new NotFoundException('post not found');
    }
    console.log('updated Post', updatedPost);
    return updatedPost;
  }

  async remove(CurrentUser: any, id: string) {
    const [post] = await this.postModel.find({
      _id: id,
    });
    if (post.postedBy.toString() != CurrentUser._id.toString()) {
      throw new BadRequestException('Author Invalid');
    }
    const postFound = await this.postModel.findOneAndDelete({ _id: id }).exec();
    if (!postFound) {
      throw new NotFoundException('post not found');
    }
    console.log('removed post =>', post);
    return post;
  }
}
