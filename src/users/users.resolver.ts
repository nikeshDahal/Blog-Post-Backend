import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    // return this.usersService.create(createUserInput);
    const user = await this.usersService.create(createUserInput);
    return user;
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => Int }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const user = this.usersService.update(updateUserInput._id, updateUserInput);
    return user;
  
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: string) {
    const user = await this.usersService.remove(id);
    return user;
  }
}
