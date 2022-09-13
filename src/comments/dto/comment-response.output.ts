import { Field, ObjectType, PartialType } from "@nestjs/graphql";
import { Comment } from "../entities/comment.entity";


@ObjectType()
export class CommentResponse extends PartialType(Comment){
    @Field(()=>String)
    _id:string
}