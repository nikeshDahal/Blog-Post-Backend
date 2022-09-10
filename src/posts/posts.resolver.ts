import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { CurrentUser } from '../auth/current.user';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostResponse } from './dto/response-post.output';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  async createPost(@CurrentUser() CurrentUser:any,@Args('createPostInput') createPostInput: CreatePostInput) {
  const [post] = await this.postsService.create(CurrentUser._id,createPostInput);
  return post;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [PostResponse], { name: 'posts' })
  async findAll() {
   const post = await this.postsService.findAll();
   console.log(post)
   return post
  }

  // @Query(() => Post, { name: 'post' })
  // async findOne(@Args('id') id: string) {
  //   const [post]= await this.postsService.findOne(id);
  //   return post
  // }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  updatePost(@CurrentUser() CurrentUser:any,@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(CurrentUser,updatePostInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  removePost(@CurrentUser() CurrentUser:any,@Args('id') id: string) {
    return this.postsService.remove(CurrentUser,id);
  }
}
