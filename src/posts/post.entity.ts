import { ObjectType, Field, Int  } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../users/user.entity';

export type PostDoccument = Post & Document

@Schema()
@ObjectType()
export class Post {

  @Prop({
    trim: true,
    required: true,
    type:String
  })
  @Field()
  postTitle:string;

  @Prop({
    trim:true,
    required:true,
    type:String
  })
  @Field()
  postDescription:string

  @Prop({
    trim:true,
    required:true,
    type:Boolean
  })
  @Field()
  isPublic:boolean

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  @Field()
  postedBy: User;

}

export const PostSchema = SchemaFactory.createForClass(Post);

