import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID  } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';


@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput){}

  // @IsOptional()
  // @Field(()=> String)
  // username?: string;


  // @IsOptional()
  // @IsEmail()
  // @Field(() => String)
  // email?: string;

  // @IsOptional()
  // @Field()
  // password?: string;




