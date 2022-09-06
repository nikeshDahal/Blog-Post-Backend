import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input.dto';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserType } from '../auth/dto/user.dto';
import { CurrentUser } from '../auth/current.user';
// import { userResponseOutput } from './dto/user-response.output';


@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    // return this.usersService.create(createUserInput);
    const user = await this.usersService.create(createUserInput);
    console.log(user)
    return user;
  }


  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Query(()=>User)
  async myProfile(@CurrentUser() currentUser : UserType){
    return currentUser
  }


  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => Int }) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(@CurrentUser() currentUser :any,@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const user = this.usersService.update(currentUser._id, updateUserInput);
 
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async removeUser(@CurrentUser() currentUser :any) {
    const user = await this.usersService.remove(currentUser._id);
 
    return user;
  }
}
