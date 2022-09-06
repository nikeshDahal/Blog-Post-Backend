import { CreateUserInput } from './create-user.input';
import { InputType, Field,  } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';


@InputType()
export class UpdateUserInput{

  @IsOptional()
  @Field(()=> String)
  username?: string;


  @IsOptional()
  @IsEmail()
  @Field(() => String)
  email?: string;

  @IsOptional()
  @Field()
  password?: string;

}


