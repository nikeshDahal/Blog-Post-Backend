import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;
  @Field(()=>String)
  postTitle:string;

  @Field(()=>String)
  postDescription:string

  @Field(()=>Boolean)
  isPublic : boolean

}
