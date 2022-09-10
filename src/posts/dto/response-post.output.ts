import { Field, ObjectType, PartialType } from "@nestjs/graphql";
import { Post } from "../post.entity";
import { CreatePostInput } from "./create-post.input";

@ObjectType()
export class PostResponse extends PartialType(Post){
    @Field(()=>String)
    _id:string
}