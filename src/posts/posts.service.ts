import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import mongoose, {Model} from 'mongoose';
import { Post } from './post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private postModule: Model<Post> , private usersService:UsersService) {}
  async create(currentUser:any,createPostInput: CreatePostInput) {
    const titleExists = await this.postModule.findOne({postTitle:createPostInput.postTitle}) 
    if(titleExists){
      throw new BadRequestException('Post title is already taken');
    }
    const {postTitle,postDescription,isPublic}= createPostInput;
    // let ID = new mongoose.Types.ObjectId(currentUser._id);
    let ID = currentUser._id
    const newPost = new this.postModule({
      postTitle,
      postDescription,
      isPublic,
      postedBy:ID
    })
    const createPost = await newPost.save(); 
    const user = await this.usersService.findOne(currentUser._id)
    console.log("post and user details :=>",{createPost,user})
    return{
      postTitle,
      postDescription,
      isPublic,
      postedBy:user
    }
    
    // const post = this.postModule.aggregate([
    //   {
    //     $match:{
    //       postedBy:currentUser._id
    //     },
    //   },
    //   {
    //     $lookup:{
    //       from:"users",
    //       localField:"postedBy",
    //       foreignField:"_id",
    //       as:"postedBy"
    //     },
    //   }
    // ])
    // console.log("aggregare =>",post)
    return "post";
  }

  findAll() {
    const posts = this.postModule.aggregate([
      {
        $match:{
          isPublic:{$eq:true}
        }
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$postedBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$_id", "$$userId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "postedBy",
        },
      },
      {$unwind: '$postedBy'},
    ])
    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
